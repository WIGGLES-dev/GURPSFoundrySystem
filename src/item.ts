import Editor from "./svelte/editors/Editor.svelte";
import ColorPicker from "./svelte/ColorPicker.svelte";

import { _Actor } from "./sheet";
import { ItemContainer } from "./container";
import { injectHelpers, svelte, arrayMove } from "./helpers";
import { Writable, writable } from "svelte/store";
import { Weapon } from "g4elogic";
import { _ChatMessage } from "./chat";
import { callbackify } from "util";

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
    getProperty: (path: string) => any

    _entity: Writable<Entity>
    sheet: _ItemSheet
    actor: _Actor

    constructor(data: any, options: any) {
        super(data, options);
        this._entity = writable(this);
    }

    openPDFReference() {
        //@ts-ignore
        const api = ui.PDFoundry;
        const ref = this.getProperty("data.reference");
        try {
            const meta = ref.includes(":") ? ref.split(":") : [ref.split(/[0-9]+/)[0], ref.split(/^[^0-9]+/)[1]];
            api.openPDFByCode(meta[0], { page: +meta[1] });
        } catch (err) {
            ui.notifications.info("Unable to open page reference. Make sure that you've properly recorded it in the reference field.");
        }
    }

    embeddedUpdate() {
        this._entity.set(this);
    }

    getWeapons(): any[] {
        const weapons = getProperty(this.data, "data.weapons") ?? []
        return weapons.reduce((prev: any, cur: any) => {
            const GURPS = this.actor ? this.getGURPSObject().list.character.getElementById("foundryID", cur._id) : null;
            const {
                type, damage, usage, reach, parry, block,
                accuracy, range, rate_of_fire, shots, bulk
            } = cur;
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
                        block,
                    });
                    break
                case "ranged_weapon":
                    prev.ranged.push({
                        _id: cur._id,
                        GURPS,
                        type,
                        damage,
                        usage,
                    })
                    break
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
        data = Object.assign({
            type: "melee_weapon",
            usage: "",
            strength_requirement: "10",
            damage: "1d6",
            damage_type: "cut",
            reach: "",
            parry: 0,
            block: false,
            accuracy: 0,
            range: "10/100",
            rate_of_fire: 1,
            bulk: -2,
            shots: "1"
        }, data);
        const weapons = this.getProperty("data.weapons") || [];
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

    isLabel() { return this.getFlag("GURPS", "is_label"); }
    /**
     * Rearrange a list of indexes and flags in a batch to keep socket requests to a minimum
     * @param index 
     * @param type 
     */
    async moveToIndex(to: number, types: string[], { container = false } = {}) {
        await this.setIndex(to);
        let array = this.actor.ownedItemsByType(...types).sort((a, b) => a.getIndex() - b.getIndex());
        let from = Math.max(this.getIndex() - 1, 0);

        if (typeof from === "number") {
            arrayMove(array, from, to);
        } else {

        }

        let correction = 0;
        const updates = array.map((item, i, array) => {
            if (item) {
                return {
                    _id: item.id,
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
            const isLabel = this.isLabel();

            const getBaseMenu = () => {
                return [
                    {
                        name: `Edit`,
                        icon: '<i class="fas fa-edit"></i>',
                        condition: () => !isLabel,
                        callback() {
                            entity.sheet.render(true);
                        }
                    },
                    {
                        name: `Set As ${isLabel ? "Item" : "Label"}`,
                        icon: `<i class="fas fa-tags"></i>`,
                        condition: () => {
                            return ["skill", "technique", "trait", "item", "spell"].includes(entity.data.type)
                            //return false
                        },
                        async callback() {
                            entity.setFlag("GURPS", "is_label", !isLabel)
                        }
                    },
                    {
                        name: "Change Color",
                        icon: `<i class="fas fa-eye-dropper"></i>`,
                        condition: () => ["skill", "technique", "trait", "item", "spell"].includes(entity.data.type),
                        callback() {
                            new ColorPicker({
                                target: document.body,
                                props: { entity: entity._entity }
                            })
                        }
                    },
                    {
                        name: `Open PDF`,
                        icon: '<i class="fas fa-file-pdf"></i>',
                        condition: () => !isLabel,
                        callback() {
                            entity.openPDFReference();
                        }
                    },
                    {
                        name: `Copy ID`,
                        icon: `<i class="fas fa-copy"></i>`,
                        condition: () => this._id,
                        async callback() {
                            try {
                                await navigator.clipboard.writeText(entity._id);
                            } catch (err) {
                                ui.notifications.info("Your browser does not support clipboard operations")
                            }
                        }
                    },
                    {
                        name: `Delete`,
                        icon: '<i class="fas fa-trash"></i>',
                        condition: () => true,
                        async callback() {
                            entity.delete()
                        }
                    },
                ]
            }

            let options = getBaseMenu();
            switch (this.data.type) {
                case "weapon":
                    return [{
                        name: "Add Weapon",
                        icon: `<i class="fas fa-add"></i>`,
                        condition: () => true,
                        async callback() {
                            await entity.addWeapon()
                        }
                    },
                    {
                        name: "Delete",
                        icon: '<i class="fas fa-trash"></i>',
                        condition: () => true,
                        async callback() {
                            await entity.delete()
                        }
                    }
                    ]
                case "item":
                    break
                case "skill":
                    options = options.concat([
                        {
                            name: `Roll`,
                            icon: '<i class="fas fa-dice-d6"></i>',
                            condition: () => true,
                            callback() {
                                entity.actor.rollSkill(entity.getGURPSObject(), null)
                            }
                        }
                    ])
                case "spell":
                    break
                case "trait":
                    break
                case "melee_weapon":
                    break
                case "ranged_weapon":
                    break
                default:

            }
            return options
        }
    }
}