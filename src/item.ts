import Editor from "./svelte/editors/Editor.svelte";
import WeaponEditor from "./svelte/editors/WeaponEditor.svelte";
import ColorPicker from "./svelte/ColorPicker.svelte";

import { _Actor } from "./sheet";
import { getContainedBy, setContainedBy } from "./container";
import { injectHelpers, svelte, arrayMove } from "./helpers";
import { Writable, writable } from "svelte/store";
import { _ChatMessage } from "./chat";
import { FeatureType, Signature } from "g4elogic";

@svelte(Editor)
export class _ItemSheet extends ItemSheet {
    private _item: _Item;

    public get item(): _Item {
        return this._item;
    }

    public set item(value: _Item) {
        this._item = value;
    }
    app: Editor

    static get defaultOptions() {
        return mergeObject(ItemSheet.defaultOptions, {
            classes: ["GURPSItem"],
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
export class _Item extends Item {
    getProperty: (path: string) => any
    GURPSUpdater: (store: any) => void

    _entity: Writable<Entity>
    private _sheet: _ItemSheet;
    public get sheet(): _ItemSheet {
        return this._sheet;
    }
    public set sheet(value: _ItemSheet) {
        this._sheet = value;
    }
    private _actor: _Actor;
    public get actor(): _Actor {
        return this._actor;
    }
    public set actor(value: _Actor) {
        this._actor = value;
    }

    constructor(data: any, options: any) {
        super(data, options);
        this._entity = writable(this);
    }

    openPDFReference() {
        //@ts-ignore
        const api = ui.PDFoundry;
        let ref = this.getProperty("data.reference");
        try {
            ref = /( )/.test(ref) ? ref.split(" ")[0] : ref;
            ref = /,/.test(ref) ? ref.split(",")[0] : ref;
            ref = /\//.test(ref) ? ref.split("/")[0] : ref;
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
                        edit: () => {
                            new WeaponEditor({
                                target: document.body,
                                props: {
                                    entity: this._entity,
                                    weapon: { foundryID: cur._id }
                                }
                            })
                        }
                    });
                    break
                case "ranged_weapon":
                    prev.ranged.push({
                        _id: cur._id,
                        GURPS,
                        type,
                        damage,
                        usage,
                        accuracy,
                        range,
                        rate_of_fire,
                        shots,
                        bulk,
                        edit: () => {
                            new WeaponEditor({
                                target: document.body,
                                props: {
                                    entity: this._entity,
                                    weapon: { foundryID: cur._id }
                                }
                            })
                        }
                    })
                    break
                default:
            }
            return prev
        }, { melee: [], ranged: [] })
    }

    getFeatures() {
        return getProperty(this.data, "data.features") || []
    }

    getModifiers() {
        return getProperty(this.data, "data.modifiers") || []
    }

    getDefaults(path) {
        return this.getProperty(path) || []
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
        if (!["trait", "skill", "item"].includes(this.data.type)) return false
        const features = this.getFeatures();
        features.push(Object.assign({
            type: FeatureType.skillBonus,
            attribute: Signature.ST,
            name_compare_type: "is",
            specialization_compare_type: "is"
        }, data, {
            _id: randomID()
        }));
        return this.update({ "data.features": duplicate(features) }, null)
    }

    async addModifier(data: any = {}, path?: string) {
        if (this.data.type !== "trait") return false
        const modifiers = this.getModifiers();
        modifiers.push(Object.assign({}, data, {
            _id: randomID()
        }));
        return this.update({ "data.modifiers": duplicate(modifiers) }, null)
    }

    async addDefault(data: any = {}, path: string = "data.defaults") {
        if (this.data.type !== "skill" && !path) return false
        const defaults = this.getDefaults(path);
        defaults.push(Object.assign({
            type: "DX",
            modifier: 0
        }, data, {
            _id: randomID()
        }));
        return this.update({ [path]: duplicate(defaults) }, null)
    }

    async removeByPath(path: string, id: string) {
        let list = this.getProperty(path);
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

    isLabel() { return this.getFlag("GURPS", "is_label"); }
    /**
     * Rearrange a list of indexes and flags in a batch to keep socket requests to a minimum
     * @param index 
     * @param type 
     */
    async moveToIndex(from: number, to: number, types: string[]) {
        let array = this.actor.ownedItemsByType(...types).sort((a, b) => a.getIndex() - b.getIndex());
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
                            ["index"]: i + 1 - correction
                        }
                    }
                }
            } else {
                correction++;
            }
        }).filter(update => update !== undefined);

        return this.actor.updateEmbeddedEntity("OwnedItem", updates);
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
                        name: `Move to ${(entity.getProperty("data.location") || "carried") === "carried" ? "Other" : "Carried"} Equipment`,
                        icon: "",
                        condition: entity.data.type === "item",
                        async callback() {
                            const containedBy = getContainedBy(entity);
                            const location = entity.getProperty("data.location");

                            if (containedBy && location) {
                                console.log(containedBy, location);
                                await setContainedBy(entity, null);
                            }
                            if (location === "carried") {
                                entity.update({ "data.location": "other" }, {});
                            } else if (location === "other") {
                                entity.update({ "data.location": "carried" }, {});
                            } else {
                                entity.update({ "data.location": "carried" }, {})
                            }
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
                        name: `Roll`,
                        icon: '<i class="fas fa-dice-d6"></i>',
                        condition: () => !isLabel && ["skill", "technique", "spell"].includes(entity.data.type),
                        callback() {
                            let skillike = entity.getGURPSObject();
                            if (skillike.isTechnique) {
                                ui.notifications.warn("Please roll from the skill list for now");
                                return false
                            }
                            entity.actor.rollSkill(
                                skillike.name,
                                skillike.calculateLevel()
                            )
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
                    break
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