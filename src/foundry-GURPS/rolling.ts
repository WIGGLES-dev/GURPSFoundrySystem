import AttackDialog from "@components/dialogs/AttackDialog.svelte";
import ModifierPrompt from "@components/dialogs/ModifierPrompt.svelte";
import { Skill, Weapon } from "g4elogic";
import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";
import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";

type mod = { modifier: string, description: string }

export class Roller {
    static async customRoll(actor: Actor, level: number, trait: string, mods: mod[] = [], { dialog = "default", props = {} } = {}) {
        Roller.launchModifierDialog(dialog, (modList) => {
            modList = purgeNullMods([...modList, ...mods]);
            let roll = new SuccessRoll({
                level,
                trait,
                modList
            });
            Roller.rollAndRender(actor, roll);
        }, props);
    }

    static async rollSkill(actor: Actor, skill: Skill, mods: mod[] = [], { dialog = "skill", props = {} } = {}) {
        Roller.launchModifierDialog(dialog, (modList: mod[]) => {
            modList = purgeNullMods([...modList, ...mods]);
            let roll = new SuccessRoll({
                level: skill.calculateLevel(),
                trait: formatSkillName(skill),
                modList
            });
            Roller.rollAndRender(actor, roll, "skill")
        });
    }

    static async rollDamage(actor: Actor, weapon: Weapon) {
        const swing = weapon.owner.getCharacter().getSwingDamage();
        const thrust = weapon.owner.getCharacter().getThrustDamage();
        let roll = new Roll(weapon.damage, {
            swing,
            sw: swing,
            thrust,
            thr: thrust
        });
        roll.toMessage({
            speaker: {
                alias: actor.name
            },
            flags: {
                GURPS: {
                    message_type: "attack",
                    message_data: {
                        type: weapon.getType(),
                        damageType: weapon.damageType,
                        weaponUsage: weapon.usage,
                        weaponName: weapon.owner.name
                    }
                }
            }
        })
    }

    private static launchModifierDialog(dialog: string, callback: (modList: mod[]) => void, props: any = {}) {
        const instanceData = {
            target: document.body,
            props
        }
        let instance;
        switch (dialog) {
            case "attack":
                instance = new AttackDialog(instanceData)
                break
            default:
                instance = new ModifierPrompt(instanceData)
        }
        let mods: mod[]
        instance.$on("roll", (e) => {
            callback(e.detail);
        });
    }

    private static async rollAndRender(actor: Actor, roll: SuccessRoll, message_type: string = "skill", message_data?: any) {
        let content = await new SuccessRollRenderer().render(roll.roll(), { template: "systems/GURPS/assets/templates/templates_roll.html" })
        await ChatMessage.create({
            flags: {
                CHAT: {
                    associated_entity_id: ""
                },
                GURPS: {
                    message_type,
                    message_data,
                    is_roll: true
                }
            },
            speaker: {
                alias: actor.name
            },
            content,
            user: game.user._id,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER
        });
    }
}

function purgeNullMods(mods: mod[]) {
    return mods.reduce((prev, mod) => {
        if (+mod.modifier === 0) { } else {
            prev.push(mod);
        }
        return prev
    }, []);
}

function formatModList(mods: number[]): string {
    return mods.reduce((prev, cur, i) => {
        if (cur > 0) {
            prev += `+${cur}`
        } else if (cur < 0) {
            prev += cur
        }
        return prev
    }, "")
}

export function formatSkillName(skill: { name: string, specialization: string, techLevel: string }) {
    let name = skill.name
    name += skill.techLevel ? ` TL/${skill.techLevel}` : '';
    name += skill.specialization ? ` (${skill.specialization})` : '';
    return name
}

export function formatTraitName() { }
export function formatEquipmentDescription() { }