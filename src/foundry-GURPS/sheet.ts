import _Sheet from "../svelte/Sheet.svelte";
import GCSImportDialog from "../svelte/GCSImportDialog.svelte";
import { _Item } from "./item";
import { Character as GURPSCharacter, Skill, Weapon, Signature } from "g4elogic";
import { writable, Writable } from "svelte/store";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";
import { injectHelpers, svelte, ownedItemsByType, formatModList } from "../helpers";
import WeaponEditor from "../svelte/editors/WeaponEditor.svelte";
import AttackDialog from "../svelte/dialogs/AttackDialog.svelte";
import ModifierPrompt from "../svelte/dialogs/ModifierPrompt.svelte";
import { getDragContext } from "../dragdrop";

import { Roller } from "@GURPSFoundry/rolling";

@svelte(_Sheet)
export class _ActorSheet extends ActorSheet {
    //@ts-ignore
    actor: _Actor;
    svelteApp: _Sheet

    static get defaultOptions() {
        return mergeObject(ActorSheet.defaultOptions, {
            classes: ["GURPSActor"],
            template: "systems/GURPS/assets/templates/holder.html",
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
        dialog.$on("Load", async (e) => {
            const files = e.detail;
            if (files.length > 0) {
                let file = files[0];
                let character;
                try {
                    character = new GURPSCharacter().load(JSON.parse(await file.text()), "GCSJSON");
                    console.log(character);
                    character.save("foundry", this.actor);
                } catch (err) {
                    ui.notifications.warn("Your GCS File was unable to load, check the logs for more information");
                    console.log(err);
                }
            } else {
                ui.notifications.warn("Please upload a valid GCS File in JSON format.")
            }
        });
    }
    customHeaderButtons() {
        return [{
            label: "LoadGCS",
            class: "load",
            icon: "fas fa-file-import",
            onclick: (e: Event) => this.loadGCSFile()
        }]
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
        this.GURPS.State = {
            addState: () => { }
        }
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

        const hpValue = this.getProperty("data.pools.hit_points.value") || 10;
        const fpValue = this.getProperty("data.pools.fatigue_points.value") || 10;

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
    setupSheet() {
        const {
            useMultiplicateModifiers = false,
            showTooltips = true,
            useModifyingDiceAdds = false,
            baseWillAndPerceptionOn10 = false,
            useKYOS = false,
            useReducedSwing = false,
            useThrustEqualsSwingMinus2 = false,
            diceIcon = "fas fa-dice d6 roll-ico",

        } = this.getProperty("data.config");
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
        const weapons = [...this.GURPS.featureList.weapons].map(([id, weapon]) => Object.assign(weapon, {
            skillLevel() {
                return this.getBestAttackLevel();
            },
            rollParry() {
                Roller.customRoll(entity, weapon.getParryLevel(), `Parry With ${weapon.owner.name}`, [{ modifier: `+${weapon.parry}`, description: "Parry bonus" }]);
            },
            rollBlock() {
                Roller.customRoll(entity, weapon.getBlockLevel(), `Block With ${weapon.name}`, [{ modifier: `+${weapon.block}`, description: "DB" }]);
            },
            rollSkill() {
                Roller.customRoll(entity, weapon.getBestAttackLevel(), `${weapon.usage} with ${weapon.owner.name}`, [], {
                    dialog: "attack", props: {
                        weapon
                    }
                });
            },
            rollDamage: () => {
                Roller.rollDamage(entity, weapon);
            },
        }));
        return {
            ranged: weapons.filter(weapon => weapon.getType() === "ranged_weapon"),
            melee: weapons.filter(weapon => weapon.getType() === "melee_weapon")
        }
    }
    dodge() {
        let dodgeScore = Math.floor(this.GURPS.getAttribute(Signature.Speed).calculateLevel() + this.GURPS.encumbranceLevel() + 3);
        Roller.customRoll(this, dodgeScore, "Dodge", []);
    }
}