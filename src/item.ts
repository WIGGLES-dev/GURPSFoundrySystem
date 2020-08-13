import Editor from "./svelte/editors/Editor.svelte";
import { _Actor } from "./sheet";
import { ItemContainer } from "./container";
import { injectHelpers, svelte } from "./helpers";
import { Writable, writable } from "svelte/store";

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
        // this.shouldRender = true;
        // this.render();
        // this.actor.shouldRender = true;
        // this.actor.render();
    }

    getWeapons(): any[] {
        return getProperty(this.data, "data.weapons") ?? []
    }

    displayWeapons() {
        return this.getWeapons().map((weapon: any) => {
            return Object.assign(weapon, {
                getGURPSObject: () => {
                    return Array.from(this.getGURPSObject().weapons).find((w: any) => w.foundryID = weapon._id)
                }
            })
        })
    }

    getFeatures() {
        return getProperty(this.data, "data.features") ?? []
    }

    getModifiers() {
        return getProperty(this.data, "data.modifiers") ?? []
    }

    async addWeapon(data: any = {}) {
        const weapons = this.getWeapons();
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
    setIndex(index: number): Promise<_Item> {
        return this.update({ "flags.GURPS.index": index }, null) as Promise<_Item>
    }

    /**
     * Rearrange a list of indexes and flags in a batch to keep socket requests to a minimum
     * @param index 
     * @param type 
     */
    moveToIndex(to: number, type: string) {
        let array = this.actor.ownedItemsByType(type).sort((a, b) => a.getIndex() - b.getIndex());

        const from = Math.max(this.getIndex() - 1, 0);

        const move = (array: any[], from: number, to: number) => {
            if (to >= array.length) {
                var k = to - array.length + 1;
                while (k--) {
                    array.push(undefined);
                }
            }
            array.splice(to, 0, array.splice(from, 1)[0]);
        }

        if (typeof from === "number") {
            if (from === 0 && to === 1) {
                move(array, from, to);
            } else if (from === array.length - 1 && to === array.length - 1) {
                move(array, from, to);
            } else {
                move(array, from, to);
            }
        } else {

        }

        let correction = 0;
        const updates = array.map((item, i, array) => {
            if (item) {
                return {
                    _id: item._id,
                    flags: {
                        GURPS: {
                            index: i + 1 - correction
                        }
                    }
                }
            } else {
                correction++;
            }
        }).filter(update => update !== undefined);

        this.actor.updateEmbeddedEntity("OwnedItem", updates);
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

export class _DragDrop {
    entity: _Actor

    constructor(entity: _Actor) {
        this.entity = entity;
    }

    /**
     * Helper function.
     */
    dragDropBinder() {
        return (node: HTMLElement, parameters: any) => {
            const app = parameters.application();
            app.bind(node);
        }
    }

    /**
     * DragDrop factory for sortable list items.
     */
    onList(dragSelector: string, dropSelector: string, type: string) {
        return () => {
            const permissions = {
                dragstart: (e: DragEvent) => true,
                drop: (e: DragEvent) => {
                    const context = this.getDragContext(e);
                    return context.type === type
                }
            }

            const callbacks = {
                dragstart: (e: DragEvent) => {
                    const context = this.getDataContext(e);
                    this.setDragData(e, "text/plain", context);
                },
                drop: async (e: DragEvent) => {

                    const context = this.getDragContext(e);
                    const item = this.getItem(context.id);
                    const GURPSElement = item.getGURPSObject();

                    const targetData = (e.target as HTMLElement).closest("tr").dataset;
                    const targetItem = this.getItem(targetData.entityId);
                    const targetGURPSElement = targetItem.getGURPSObject();

                    /**
                     * Logic to handle dropping of items between lists. If types match drop the item to the first matching list in this order
                     * 1. Lists on different actors
                     * 2. The same actor, which will be a reorder operation
                     * 3. Dragging from the Item directory
                     */
                    if (item.data.type === type) {
                        if (item.actor && item.actor !== targetItem.actor) {
                            let newItem = await targetItem.actor.createOwnedItem(item) as _Item;
                            newItem.moveToIndex(+targetData.index, context.type);
                        } else if (item.actor && item.actor === targetItem.actor) {
                            if (targetGURPSElement.canContainChildren) {
                                item.setContainedBy(targetItem);
                                item.moveToIndex(+targetData.index + 1, context.type);
                            } else {
                                item.moveToIndex(+targetData.index, context.type);
                            }

                        } else {
                            this.entity.createOwnedItem(item).then(item => {
                                (this.entity.getOwnedItem(item._id) as _Item).moveToIndex(+targetData.index, context.type);
                            });
                        }
                    }
                }
            }

            //@ts-ignore
            const dragDrop = new DragDrop({
                dragSelector,
                dropSelector,
                permissions,
                callbacks
            });
            return dragDrop
        }
    }
    private getDataContext(e: DragEvent) {
        const _this = this;
        const dataset = (e.target as HTMLElement).dataset;
        return {
            id: dataset.entityId,
            index: dataset.index,
            type: dataset.type || this.getItem(dataset.entityId).data.type,
        }
    }
    private getDragContext(e: DragEvent) {
        const _this = this;
        return JSON.parse(e.dataTransfer.getData("text/plain"))
    }

    /**
     * Get an item from an id searching in the following place in this order
     * 1. the contextual entity
     * 2. the Item collection
     * 3. all the actors in the actors collection
     */
    private getItem(id: string): _Item {
        console.log(id);
        return game.gurps4e.getItem(id, this.entity)
    }

    /**
     * Helper function to convert a DragEvent into the id assuming it has that data. If you give it an id it will return the
     * associated item using @link {getItem} 
     */
    private itemFromEvent(e: string | DragEvent): _Item {
        if (typeof e === "string") {
            return this.getItem(e)
        } else {
            const data = JSON.parse(e.dataTransfer.getData("text/plain"));
            console.log(data.id);
            return this.getItem(data.id)
        }
    }

    private setDragData(e: DragEvent, type: string, data: any) {
        e.dataTransfer.setData(type, JSON.stringify(data))
    }

    openEditor(data: string | DragEvent) {
        const edit = this.itemFromEvent(data);
        // @ts-ignore
        edit.sheet.render(true);
    }

    dragover(e: DragEvent, index: number, length: number) {
        const result = _Item.getDragoverIndex(e, index, length);
        e.preventDefault();
        return result
    }
}