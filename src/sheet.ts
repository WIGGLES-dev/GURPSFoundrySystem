import _Sheet from "./svelte/Sheet.svelte";
import GCSImportDialog from "./svelte/GCSImportDialog.svelte";
import { _Item } from "./item";
import { Character as GURPSCharacter, Skill, Weapon, Signature } from "g4elogic";
import { writable, Writable } from "svelte/store";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";
import { injectHelpers, svelte, ownedItemsByType, formatModList } from "./helpers";
import WeaponEditor from "./svelte/editors/WeaponEditor.svelte";
import AttackDialog from "./svelte/AttackDialog.svelte";
import ModifierPrompt from "./svelte/dialogs/ModifierPrompt.svelte";
import { getDragContext } from "./dragdrop";

@svelte(_Sheet)
export class _ActorSheet extends ActorSheet {
    //@ts-ignore
    actor: _Actor;
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

    async _onDrop(e: DragEvent) {

        async function attemptToAddPartyMember(id, entity) {
            let roster = entity.getProperty("data.members") || [];
            if (!roster.includes(id)) {
                roster.push(id);
                return entity.update(
                    { "data.members": duplicate(roster) },
                    { diff: false }
                );
            }
        }

        if (this?.actor?.data?.type === "party") {
            try {
                const { origin } = getDragContext(e, "actor");
                if (origin && origin.data.type === "character") {
                    return attemptToAddPartyMember(origin.id, this.actor);
                }
            } catch (err) {
                console.log(err);
                return false
            }
            return false
        }
        //@ts-ignore
        return super._onDrop(e);
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

    _entity: Writable<Entity>
    _GURPS: Writable<GURPSCharacter>
    GURPS: GURPSCharacter
    _sheet: _ActorSheet;

    constructor(data: any, options: any) {
        super(data, options);
        this._entity = writable(this);
        //@ts-ignore
        this.GURPS = new GURPSCharacter();
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
            const update = this.GURPS.load(this, "foundry");
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
        return ownedItemsByType(this, ...types) as _Item[];
    }

    getWildWeapons() {
        return this.ownedItemsByType("melee attack");
    }

    getWeapons() {
        const entity = this
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
            skillLevel: () => {
                let level = weapon.getBestAttackLevel();
                console.log(level);
                return level
            },
            rollParry() {
                entity.rollSkill(
                    `Parry With ${weapon.owner.name}`,
                    weapon.getParryLevel(),
                    [+weapon.parry]
                )
            },
            rollBlock() {
                entity.rollSkill(
                    `Block With ${this.owner.name}`,
                    weapon.getBlockLevel(),
                    [+weapon.block]
                )
            },
            rollSkill() {
                entity.rollSkill(
                    `${weapon.owner.name} ${weapon.usage}`,
                    this.skillLevel(),
                    [weapon.skillMod || 0],
                    "attack",
                    { weapon }
                );
            },
            rollDamage: () => {
                this.rollDamage({
                    damage: weapon.damage,
                    damageType: weapon.damageType,
                    type: weapon.getType(),
                    weaponName: weapon.owner.name,
                    weaponUsage: weapon.usage
                })
            },
        }));
        return {
            ranged: weapons.filter(weapon => weapon.getType() === "ranged_weapon"),
            melee: weapons.filter(weapon => weapon.getType() === "melee_weapon")
        }
    }

    rollSkill(trait: string, level: number, modifiers: number[] = [], modType = "", data: any = {}) {
        switch (modType) {
            case "attack":
                const modifierDialog = new AttackDialog({
                    target: document.body,
                    props: {
                        type: "attack",
                        weapon: data.weapon ? data.weapon : null
                    }
                });
                modifierDialog.$on("roll", (e) => {
                    this.rollAndRender(trait, level, formatModList([...e.detail, ...modifiers]));
                });
                break
            default:
                const modifierPrompt = new ModifierPrompt({
                    target: document.body,
                });
                modifierPrompt.$on("roll", (e) => {
                    this.rollAndRender(trait, level, formatModList([e.detail]));
                })
        }
    }

    private rollAndRender(trait: string, level: number, modifiers: string) {
        try {
            let roll;
            try {
                roll = new SuccessRoll({ level, trait, modifiers });
            } catch (err) {
                roll = new SuccessRoll({ level, trait, modifiers: null });
                ui.notifications.warn("Your modifier is invalid");
            }
            roll.roll();
            let renderer = new SuccessRollRenderer();
            renderer.render(roll, { template: "systems/GURPS/templates/GURPS-foundry-roll-templates/templates_roll.html" }).then((html) => {
                ChatMessage.create({ content: html, user: game.user._id, type: CONST.CHAT_MESSAGE_TYPES.OTHER })
            });
        } catch (err) {
            ui.notifications.error(err)
        }
    }

    dodge() {
        let roll = new SuccessRoll({ level: Math.floor(this.GURPS.getAttribute(Signature.Speed).calculateLevel() + this.GURPS.encumbranceLevel() + 3), modifiers: prompt(), trait: "Dodge" })
        roll.roll();
        let renderer = new SuccessRollRenderer();
        renderer.render(roll).then(html => {
            ChatMessage.create({ content: html, user: game.user._id, type: CONST.CHAT_MESSAGE_TYPES.OTHER })
        });
    }

    async rollDamage({ type = "", damageType = "", weaponUsage = "", weaponName = "", damage = "" }) {
        const swing = this.GURPS.getSwingDamage();
        const thrust = this.GURPS.getThrustDamage();
        try {
            const roll = new Roll(damage, {
                swing,
                sw: swing,
                thrust,
                thr: thrust
            });
            return roll.toMessage({
                GURPSRollType: "Damage", GURPSRollData: {
                    type,
                    damageType,
                    weaponUsage,
                    weaponName
                }
            })
        }
        catch (err) {
            ui.notifications.warn("Roll failed, this is probably because the damage string could not be parsed")
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