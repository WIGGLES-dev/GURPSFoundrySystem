import Editor from "./svelte/editors/Editor.svelte";
import { _Actor } from "./sheet";
import { ItemContainer } from "./container";
import { injectHelpers, svelte, arrayMove } from "./helpers";
import { Writable, writable } from "svelte/store";
import { Weapon } from "g4elogic";
import { _ChatMessage } from "./chat";

@svelte(Editor)
export class _ItemSheet extends ItemSheet {
    item: _Item
    app: Editor

    static get defaultOptions() {
        return mergeObject(ItemSheet.defaultOptions, {
            classes: [""],
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
export class _Item extends ItemContainer {
    getData: (path: string) => any

    _entity: Writable<Entity>
    sheet: _ItemSheet
    actor: _Actor
    shouldRender: boolean

    constructor(data: any, options: any) {
        super(data, options);
        this._entity = writable(this);
    }

    initialize() {
        super.initialize();
    }

    _onUpdate(data: any, options: any, userId: string, context: any) {
        if (data.name || data.img) this.shouldRender = true;
        return super._onUpdate(data, options, userId, context);
    }

    embeddedUpdate() {
        this._entity.set(this);
        this?.actor?.updateGURPS();
    }

    getWeapons(): any[] {
        const weapons = getProperty(this.data, "data.weapons") ?? []
        return weapons.reduce((prev: any, cur: any) => {
            const GURPS = this.actor ? this.getGURPSObject().list.character.getElementById("foundryID", cur._id) : null;
            const {
                type, damage, usage, reach, parry, block,
                accuracy, range, rate_of_fire, shots, bulk
            } = cur
            switch (cur.type) {
                case "melee_weapon":
                    prev.melee.push({
                        _id: cur._id,
                        GURPS,
                        type,
                        damage,
                        usage,
                        reach,
                        parry,
                        block
                    })
                case "ranged_weapon":
                    prev.ranged.push({
                        _id: cur._id,
                        GURPS,
                        type,
                        damage,
                        usage,
                    })
                default:
            }
            return prev
        }, { melee: [], ranged: [] })
    }

    getFeatures() {
        return getProperty(this.data, "data.features") ?? []
    }

    getModifiers() {
        return getProperty(this.data, "data.modifiers") ?? []
    }

    async addWeapon(data: any = {}) {
        const weapons = this.getData("data.weapons") || [];
        weapons.push(Object.assign(data, {
            _id: randomID()
        }));
        await this.update({ "data.weapons": duplicate(weapons) }, null);
    }

    async addFeature(data: any = {}) {
        const features = this.getFeatures();
        features.push(Object.assign(data, {
            _id: randomID()
        }));
        return this.update({ "data.features": duplicate(features) }, null)
    }

    async addModifier(data: any = {}) {
        const modifiers = this.getModifiers();
        modifiers.push(Object.assign(data, {
            _id: randomID()
        }));
        return this.update({ "data.modifiers": duplicate(modifiers) }, null)
    }

    async removeByPath(path: string, id: string) {
        let list = getProperty(this.data, path);
        list = list.filter((item: any) => item._id !== id);
        return this.update({ [path]: duplicate(list) }, null);
    }

    getGURPSObject() {
        return this.actor.GURPS.getElementById("foundryID", this._id)
    }

    getIndex(): number {
        return this.getFlag("GURPS", "index")
    }
    async setIndex(index: number): Promise<_Item> {
        return this.update({ "flags.GURPS.index": index }, null) as Promise<_Item>
    }

    getContainerIndex(): number {
        return this.getFlag("GURPS", "container_index")
    }

    async setContainerIndex(index: number): Promise<_Item> {
        return this.update({ "flags.GURPS.container_index": index }, null) as Promise<_Item>
    }

    private async orderList(type: string) {
        let array = this.actor.ownedItemsByType(type).sort((a, b) => a.getIndex() - b.getIndex());
        const updates = array.map((item, i) => {
            return {
                _id: item._id,
                flags: {
                    GURPS: {
                        index: i + 1
                    }
                }
            }
        });
        return this.actor.updateEmbeddedEntity("OwnedItem", updates);
    }

    /**
     * Rearrange a list of indexes and flags in a batch to keep socket requests to a minimum
     * @param index 
     * @param type 
     */
    async moveToIndex(to: number, type: string, { container = false } = {}) {
        // let proxy = await this.orderList(type);
        let array = this.actor.ownedItemsByType(type).sort((a, b) => a.getIndex() - b.getIndex());
        const from = Math.max(this.getIndex() - 1, 0);

        if (typeof from === "number") {
            arrayMove(array, from, to);
        } else {

        }

        let correction = 0;
        const updates = array.map((item, i, array) => {
            if (item) {
                return {
                    _id: item._id,
                    flags: {
                        GURPS: {
                            [container ? "container_index" : "index"]: i + 1 - correction
                        }
                    }
                }
            } else {
                correction++;
            }
        }).filter(update => update !== undefined);

        console.log(updates);

        return this.actor.updateEmbeddedEntity("OwnedItem", updates);
    }

    static getDragoverIndex(event: DragEvent, index: number, endIndex: number): number {
        const boundingBox = (event.target as HTMLElement).getBoundingClientRect();

        const vSplit = boundingBox.height / 2;
        const hSplit = boundingBox.width / 2;

        if (index !== 0 && index !== endIndex) {
            if (event.offsetY > vSplit) {
                index = index + 1
            } else if (event.offsetY <= vSplit) {

            }
        }

        if (index < 0) {
            return 0
        } else if (index >= endIndex) {
            return endIndex
        } else {
            return index
        }
    }

    /**
     * Dynamically generate menu item objects for the context menu based on the type of item this instance is
     * @return the context menu object
     */
    getMenuItems() {
        return () => {
            const entity = this;
            const getBaseMenu = () => {
                return [{
                    name: `delete ${this.getGURPSObject().name}`,
                    icon: "",
                    condition: () => true,
                    async callback() {
                        entity.delete()
                    }
                },
                {
                    name: `edit ${this.getGURPSObject().name}`,
                    icon: "",
                    condition: () => true,
                    callback() {
                        entity.sheet.render(true);
                    }
                }]
            }

            let options = getBaseMenu();
            switch (this.data.type) {
                case "item":

                case "skill":
                    options = options.concat([
                        {
                            name: `roll against ${this.getGURPSObject().name}`,
                            icon: "",
                            condition: () => true,
                            callback() {
                                entity.actor.rollSkill(entity.getGURPSObject())
                            }
                        }
                    ])
                case "spell":

                case "trait":

                case "melee_weapon":

                case "ranged_weapon":

                default:

            }
            return options
        }
    }
}