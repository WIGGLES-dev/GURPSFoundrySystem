import _Sheet from "./svelte/Sheet.svelte";
import GCSImportDialog from "./svelte/GCSImportDialog.svelte";
import { _Item } from "./item";
import { Character as GURPSCharacter, Skill, Weapon } from "g4elogic";
import { writable, Writable } from "svelte/store";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";
import { injectHelpers, svelte } from "./helpers";
import Popout from "./popout.js";

@svelte(_Sheet)
export class _ActorSheet extends ActorSheet {
    actor: _Actor
    app: _Sheet

    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, {
            classes: ["sheet"],
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

        }

        this.determineInitiative();
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

    async setPools() {
        const ST = this.getProperty("data.attributes.strength");
        const HT = this.getProperty("data.attributes.health");
        const hp = this.getProperty("data.attributes.hit_points");
        const fp = this.getProperty("data.attributes.fatigue_points");
        let update1 = await this.update({ "data.pools.fatigue_points.max": HT + fp });
        let update2 = await this.update({ "data.pools.hit_points.max": ST + hp });
        return { ...update1, ...update2 }
    }

    _onUpdateEmbeddedEntity(type: string, doc: any, update: any, options: any, userId: string) {
        (this.getOwnedItem(doc._id) as _Item).embeddedUpdate();
        this.updateGURPS();
        super._onUpdateEmbeddedEntity(type, doc, update, options, userId);
    }

    async updateGURPS() {
        try {
            const update = this.GURPS.load(this);
            this._GURPS.set(update);
            this._entity.set(this);
        } catch (e) {
            console.log(e);
        }
    }

    ownedItemsByType(...types: string[]): _Item[] {
        return this.items.filter((item: Item) => types.includes(item.data.type))
    }

    getWildWeapons() {
        return this.ownedItemsByType("melee attack", "ranged attack")
    }

    rollSkill(skill: Skill, modifiers: string) {
        modifiers = "+" + (modifiers || "0") + "+" + (prompt("modifiers") || "0");
        let roll = new SuccessRoll({ level: Math.floor(skill.calculateLevel()), trait: skill.name, modifiers });
        roll.roll();
        let renderer = new SuccessRollRenderer();
        renderer.render(roll).then((html) => {
            ChatMessage.create({ content: html, user: game.user._id, type: CONST.CHAT_MESSAGE_TYPES.OTHER })
        });
    }

    async rollDamage(weapon: Weapon) {
        const roll = new Roll(weapon.damage, {
            swing: this.GURPS.getSwingDamage(),
            thrust: this.GURPS.getThrustDamage()
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