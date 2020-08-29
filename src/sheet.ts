import _Sheet from "./svelte/Sheet.svelte";
import GCSImportDialog from "./svelte/GCSImportDialog.svelte";
import { _Item } from "./item";
import { Character as GURPSCharacter, Skill, Weapon, Signature } from "g4elogic";
import { writable, Writable } from "svelte/store";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";
import { injectHelpers, svelte } from "./helpers";
import WeaponEditor from "./svelte/WeaponEditor.svelte";

@svelte(_Sheet)
export class _ActorSheet extends ActorSheet {
    actor: _Actor
    app: _Sheet

    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, {
            classes: ["GURPSActor"],
            template: "systems/GURPS/holder.html",
            width: 700,
            height: 900,
            submitOnChange: false
        })
    }

    activateListeners(html: JQuery<HTMLElement>) {
        return super.activateListeners(html);
    }

    submit(): null {
        return null
    }

    loadGCSFile() {
        const dialog = new GCSImportDialog({
            target: document.body,
        });

        dialog.$on("File Loaded", async (e) => {
            const files = e.detail;
            if (files.length === 1) {
                let file = files[0];
                let character = new GURPSCharacter("GCSJSON").load(JSON.parse(await file.text()), "GCSJSON");

                console.log(character);
                character.save("foundry", this.actor);
            } else if (files.length > 1) {

            }
        });
    }

    customHeaderButtons() {
        return [
            // {
            //     label: "Popout",
            //     class: "popout",
            //     icon: "fas fa-external-link-alt",
            //     onclick: (e: Event) => {
            //         const getter = `game.${(this.entity.collection.name as string).toLowerCase()}.get("${this.entity.id}")`
            //         Popout.onPopoutClicked(e, this, getter)
            //     }
            // },
            {
                label: "LoadGCS",
                class: "load",
                icon: "fas fa-file-import",
                onclick: (e: Event) => this.loadGCSFile()
            }
        ]
    }
}

@injectHelpers
export class _Actor extends Actor {
    getProperty: (path: string) => any

    readonly _entity: Writable<Entity>
    readonly _GURPS: Writable<GURPSCharacter>
    readonly GURPS: GURPSCharacter
    readonly sheet: _ActorSheet

    constructor(data: any, options: any) {
        super(data, options);
        this._entity = writable(this);
        this.GURPS = new GURPSCharacter("foundry");
        this._GURPS = writable(this.GURPS);
        this.updateGURPS();
    }

    prepareData() {
        super.prepareData();

        if (this.GURPS) {
            this.updateGURPS();
        }

        this.determineInitiative();
        this.setPools();
    }

    private determineInitiative() {
        const speed = this.getProperty("data.attributes.speed");
        const dexterity = this.getProperty("data.attributes.dexterity");
        const health = this.getProperty("data.attributes.health");

        if (this.data.type === "character") {
            mergeObject(this.data.data, {
                initiative: speed + (dexterity + health) / 4
            });
        } else if (this.data.type === "monster") {
            mergeObject(this.data.data, {
                initiative: speed
            })
        }
    }

    private setPools() {
        const ST = this.getProperty("data.attributes.strength") || 10;
        const HT = this.getProperty("data.attributes.health") || 10;
        const hp = this.getProperty("data.attributes.hit_points") || 0;
        const fp = this.getProperty("data.attributes.fatigue_points") || 0;

        const hpValue = this.getProperty("data.pools.hit_points.value");
        const fpValue = this.getProperty("data.pools.fatigue_points.value");

        if (this.data.type === "character") {
            mergeObject(this.data.data, {
                pools: {
                    fatigue_points: {
                        max: HT + fp,
                        value: fpValue
                    },
                    hit_points: {
                        max: ST + hp,
                        value: hpValue
                    }
                }
            });
        }
    }

    _onUpdateEmbeddedEntity(type: string, doc: any, update: any, options: any, userId: string) {
        (this.getOwnedItem(doc._id) as _Item).embeddedUpdate();
        this.updateGURPS();
        super._onUpdateEmbeddedEntity(type, doc, update, options, userId);
    }

    updateGURPS() {
        try {
            const update = this.GURPS.load(this);
            this._GURPS.set(update);
            this._entity.set(this);
        } catch (e) {
            console.log(e);
        }
    }

    async sortList(type: string, sortPropPath: string) {
        const list = this.ownedItemsByType(type)
        const toUpdate = list
            .map((item, i) => { return { original: i, sortProp: item.getProperty(sortPropPath) } })
            .sort((a, b) => a.sortProp - b.sortProp)
            .map(item => list[item.original])
            .map((item, i) => {
                return {
                    _id: item.id,
                    "flags.GURPS.index": i + 1
                }
            });
        return this.updateEmbeddedEntity("OwnedItem", toUpdate);
    }

    ownedItemsByType(...types: string[]): _Item[] {
        return this.items.filter((item: Item) => types.includes(item.data.type))
    }

    getWeapons() {
        const weapons = this.GURPS.featureList.weapons.map(weapon => Object.assign(weapon, {
            edit(entity) {
                new WeaponEditor({
                    target: document.body,
                    props: {
                        entity,
                        weapon
                    }
                })
            },
            roll() { },
            skill: () => this.GURPS.getElementById("foundryID", weapon.skillID) || false,
            type: weapon.getType()
        }));
        return {
            ranged: weapons.filter(weapon => weapon.getType() === "ranged_weapon"),
            melee: weapons.filter(weapon => weapon.getType() === "melee_weapon")
        }
    }

    rollSkill({ trait, level, modifiers }) {
        modifiers = (modifiers === "none" || !modifiers ? `` : `+${modifiers}`) + (modifiers !== "none" && !modifiers ? `+${prompt("modifiers") || "0"}` : "");
        let roll = new SuccessRoll({ level, trait: trait, modifiers });
        roll.roll();
        let renderer = new SuccessRollRenderer();
        renderer.render(roll).then((html) => {
            ChatMessage.create({ content: html, user: game.user._id, type: CONST.CHAT_MESSAGE_TYPES.OTHER })
        });
    }

    dodge() {
        let roll = new SuccessRoll({ level: Math.floor(this.GURPS.getAttribute(Signature.Speed).calculateLevel() + this.GURPS.encumbranceLevel() + 3), modifiers: prompt(), trait: "Dodge" })
        roll.roll();
        let renderer = new SuccessRollRenderer();
        renderer.render(roll).then(html => {
            ChatMessage.create({ content: html, user: game.user._id, type: CONST.CHAT_MESSAGE_TYPES.OTHER })
        });
    }

    async rollDamage(weapon: Weapon) {
        const swing = this.GURPS.getSwingDamage();
        const thrust = this.GURPS.getThrustDamage();
        try {
            const roll = new Roll(weapon.damage, {
                swing,
                sw: swing,
                thrust,
                thr: thrust
            });
            return roll.toMessage({
                GURPSRollType: "Damage", GURPSRollData: {
                    type: weapon.getType(),
                    damageType: weapon.damageType,
                    weaponUsage: weapon.usage,
                    weaponName: weapon.owner.name
                }
            })
        }
        catch (err) {
            ui.notifications.warn("Roll failed, this is probably because the damage string could not be parsed")
        }
    }

    getSkillLevelForTechnique(technique) {
        try {
            if (technique.getProperty("data.based_on") === "skill") {
                let skill = this.getOwnedItem(technique.getProperty("data.skill_id"));
                if (skill && skill.type === "skill") {
                    let level = this.GURPS.getElementById("foundryID", skill.id).calculateLevel();
                    if (typeof level === "number") return Math.floor(level);
                    return NaN;
                }
            } else if (technique.getProperty("data.based_on") === "attribute") {
                let signature = technique.getProperty("data.signature");
                return this.GURPS.getAttribute(signature).calculateLevel();
            }
        } catch (err) {
            console.log(err);
            return 10;
        }
    }

    // static getBase64Image(img: HTMLImageElement) {
    //     const canvas = document.createElement("canvas");
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     const ctx = canvas.getContext("2d");
    //     ctx.drawImage(img, 0, 0);
    //     const dataURL = canvas.toDataURL("imgage/png");
    //     return dataURL.replace("/^data:image/\(png|jpg);base64,/", "")
    // }
}