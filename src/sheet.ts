import _Sheet from "./svelte/Sheet.svelte";
import { _Item } from "./item";
import { Character as GURPSCharacter, Skill } from "g4elogic";
import { FoundryEntity } from "./foundry_actor";
import { writable, Writable } from "svelte/store";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";
import { injectHelpers, svelte } from "./helpers";

@svelte(_Sheet)
export class _ActorSheet extends ActorSheet {
    actor: _Actor
    app: _Sheet
    _entity: Writable<Entity>

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
}

@injectHelpers
export class _Actor extends Actor {
    getData: (path: string) => any

    _entity: Writable<Entity>
    _GURPS: Writable<GURPSCharacter>
    GURPS: GURPSCharacter
    sheet: _ActorSheet
    shouldRender: boolean

    constructor(data: any, options: any) {
        super(data, options);
        //@ts-ignore
        this._entity = writable(this);
        this.GURPS = new GURPSCharacter(new FoundryEntity());
        this._GURPS = writable(this.GURPS);
        this.updateGURPS();
    }

    async setPools() {
        const ST = this.getData("data.attributes.strength");
        const HT = this.getData("data.attributes.health");
        const hp = this.getData("data.attributes.hit_points");
        const fp = this.getData("data.attributes.fatigue_points");
        await this.update({ "data.pools.fatigue_points.max": HT + fp });
        await this.update({ "data.pools.hit_points.max": ST + hp });
    }

    prepareData() {
        super.prepareData();
    }

    _onUpdate(data: any, options: any, userId: string, context: any) {
        if (data.name || data.img) this.shouldRender = true;
        super._onUpdate(data, options, userId, context);
    }

    _onUpdateEmbeddedEntity(type: string, doc: any, update: any, options: any, userId: string) {
        super._onUpdateEmbeddedEntity(type, doc, update, options, userId);
        (this.getOwnedItem(doc._id) as _Item).embeddedUpdate();
    }

    initialize() {
        super.initialize();
    }

    updateGURPS() {
        try {
            this._GURPS.set(this.GURPS.load(this));
            //@ts-ignore
            this._entity.set(this);
            console.log(this.GURPS, this);
        } catch (e) {
            console.log(e);
        }
    }

    updateIndexes(type: string) {
        const updates =
            this.ownedItemsByType(type)
                .sort((a, b) => a.getIndex() - b.getIndex())
                .map((item, i) => {
                    return {
                        _id: item._id,
                        flags: {
                            GURPS: {
                                index: i
                            }
                        }
                    }
                });
        return this.updateEmbeddedEntity("OwnedItem", updates)
    }

    ownedItemsByType(...types: string[]): _Item[] {
        return this.items.filter((item: Item) => types.includes(item.data.type))
    }

    getWildWeapons() {
        return this.ownedItemsByType("melee attack", "ranged attack")
    }

    rollSkill(skill: Skill, modifiers: string = null) {
        let roll = new SuccessRoll({ level: skill.calculateLevel(), trait: skill.name, modifiers });
        roll.roll();
        let renderer = new SuccessRollRenderer();
        renderer.render(roll).then((html) => {
            ChatMessage.create({ content: html, user: game.user._id, type: CONST.CHAT_MESSAGE_TYPES.OTHER })
        });
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