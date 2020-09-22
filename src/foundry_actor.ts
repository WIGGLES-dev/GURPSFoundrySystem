import {
    Weapon,
    Serializer,
    Trait,
    Equipment,
    Spell,
    Technique,
    Skill,
    List,
    SkillLike,
    FeatureType,
    Difficulty,
    Signature,
    SkillDefault,
    TehchniqueDifficulty,
    EquipmentModifier,
    TraitModifier,
    Character,
    Feature,
    Featurable,
    isArray,
    json,
    ListItem,
    AttributeBonus,
    DRBonus,
    SkillBonus,
    RangedWeapon,
    MeleeWeapon
} from "g4elogic";
import { _Actor as FoundryActor } from "./foundry-GURPS/sheet";
import { _Item } from "./foundry-GURPS/item";
import { getContainedBy } from "./modules/lists/container";

export class FoundryEntity extends Serializer {
    static scope = "foundry"
    constructor() {
        super();
    }
    init() {
        this.
            register(SkillDefault, {
                save: FoundryEntity.saveSkillDefault,
                load: FoundryEntity.mapSkillDefault
            })
            .register(Skill, {
                save: this.saveSkill,
                load: this.mapSkill
            })
            .register(Technique, {
                save: this.saveTechnique,
                load: this.mapTechnique
            })
            .register(Spell, {
                save: this.saveSpell,
                load: this.mapSpell
            })
            .register(Equipment, {
                save: this.saveEquipment,
                load: this.mapEquipment
            })
            .register(Trait, {
                save: this.saveTrait,
                load: this.mapTrait
            })
            .register("feature", {
                save: this.saveFeature,
                load: this.mapFeature
            })
            .register(TraitModifier, {
                save: this.saveModifier,
                load: this.mapModifier
            })
            .register(EquipmentModifier, {
                save: this.saveModifier,
                load: this.mapModifier
            })
            .register("weapon", {
                save: this.saveWeapon,
                load: this.mapWeapon
            })
    }
    private static mapListItem(listItem: ListItem<any>, entity?: _Item) {
        listItem.foundryID = entity.id;
        listItem.listIndex = entity.getIndex() || listItem.list.length + 1
    }
    private static saveListItem(listItem: ListItem<any>) {
        try {
            return {

            }
        } catch (err) {

        }
    }
    private static mapSkillLike(skillLike: SkillLike<any>, entity?: _Item) {
        const data = entity.data;
        skillLike.foundryID = entity.id;
        skillLike.name = getProperty(data, "data.name");
        skillLike.difficulty = getProperty(data, "data.difficulty") as Difficulty;
        skillLike.points = getProperty(data, "data.points");
        skillLike.reference = getProperty(data, "data.reference");
        skillLike.gMod = getProperty(data, "data.global_mod");
    }
    private static saveSkillLike(skillLike: SkillLike<any>) {
        try {
            return {
                name: skillLike.name,
                difficulty: skillLike.difficulty,
                points: skillLike.points,
                reference: skillLike.reference,
                global_mod: skillLike.gMod
            }
        } catch (err) {

        }
    }
    static mapSkillDefault(skillDefault: SkillDefault<any>, data: any) {
        skillDefault.foundryID = data._id;
        //@ts-ignore
        skillDefault._id = data._id;

        skillDefault.type = data.type;
        skillDefault.modifier = data.modifier;
        skillDefault.specialization = data.specialization;
        skillDefault.name = data.name;
    }
    static saveSkillDefault(skillDefault: SkillDefault<any>) {
        return {
            _id: randomID(),
            type: skillDefault.type,
            modifier: skillDefault.modifier,
            specialization: skillDefault.specialization,
            name: skillDefault.name
        }
    }
    mapSkill(skill: Skill, entity?: _Item) {
        const data = entity.data;
        FoundryEntity.mapListItem(skill, entity);
        FoundryEntity.mapSkillLike(skill, entity);

        skill.signature = getProperty(data, "data.signature") as Signature;
        skill.techLevel = getProperty(data, "data.tech_level");
        skill.specialization = getProperty(data, "data.specialization");
        skill.encumbrancePenaltyMultiple = getProperty(data, "data.encumbrance_penalty_multiplier");
        // skill.defaultedFrom = new SkillDefault<Skill>(skill).load(getProperty(data, "data.defaulted_from"));
        skill.reference = getProperty(data, "data.reference");
        skill.notes = getProperty(data, "data.notes");

        getProperty(data, "data.defaults")?.forEach(skillDefault => {
            skill.addDefault().load(skillDefault);
        });

        getProperty(data, "data.weapons")?.forEach((weapon: any) => {
            let tWeapon = skill.addWeapon(weapon.type);
            tWeapon.load(weapon, entity);
        });

        if (!entity.GURPSUpdater) {
            entity.GURPSUpdater = skill.subscribe(async (skill) => {
                entity.update(skill.save(), { diff: false });
            }).unsubscribe;
        }

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveSkill(skill: Skill) {
        try {
            return {
                type: "skill",
                name: skill.name || "Skill",
                flags: {},
                data: Object.assign(FoundryEntity.saveSkillLike(skill), {
                    type: skill.tag,
                    difficulty: skill.difficulty,
                    signature: skill.signature,
                    tech_level: skill.techLevel,
                    encumbrance_penalty_multiplier: skill.encumbrancePenaltyMultiple,
                    reference: skill.reference,
                    notes: skill.notes,
                    defaults: Array.from(skill.defaults).map(skillDefault => skillDefault.save({}))
                })
            }
        } catch (err) {

        }
    }
    mapTechnique(technique: Technique, entity?: _Item) {
        const data = entity.data;
        FoundryEntity.mapListItem(technique, entity);
        FoundryEntity.mapSkillLike(technique, entity);

        technique.name = getProperty(data, "data.name");
        technique.points = getProperty(data, "data.points");
        technique.gMod = getProperty(data, "data.global_mod");
        technique.difficulty = getProperty(data, "data.difficulty");
        technique.limit = getProperty(data, "data.limit");
        FoundryEntity.mapSkillDefault(technique.default, getProperty(data, "data.default") || {})
        technique.techLevel = getProperty(data, "data.tech_level");

        getProperty(data, "data.weapons")?.forEach((weapon: any) => {
            let tWeapon = technique.addWeapon(weapon.type);
            tWeapon.load(weapon, entity);
        });
    }
    saveTechnique(technique: Technique) {
        return {
            name: technique.name || "Technique",
            flags: {},
            data: {
                points: technique.points,
                difficulty: technique.difficulty,
                limit: technique.limit,
                global_mod: technique.gMod,
                tech_level: technique.techLevel,
                default: technique.default.save()
            }
        }
    }
    mapSpell(spell: Spell, entity?: _Item) {
        const data = entity.data
        FoundryEntity.mapListItem(spell, entity);
        FoundryEntity.mapSkillLike(spell, entity);

        spell.college = getProperty(data, "data.college");
        spell.powerSource = getProperty(data, "data.power_source");
        spell.spellClass = getProperty(data, "data.class");
        spell.castingCost = getProperty(data, "data.casting_cost");
        spell.maintenanceCost = getProperty(data, "data.maintenance_cost");
        spell.castingTime = getProperty(data, "data.casting_time");
        spell.reference = getProperty(data, "data.reference");
        //resisted by
        spell.duration = getProperty(data, "data.duration");

        getProperty(data, "data.weapons")?.forEach((weapon: any) => {
            let tWeapon = spell.addWeapon(weapon.type);
            tWeapon.load(weapon, entity);
        });

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveSpell(spell: Spell) {
        try {
            return {
                name: spell.name || "Spell",
                type: "spell",
                flags: {},
                data: {
                    name: spell.name,
                    college: spell.college,
                    power_source: spell.powerSource,
                    class: spell.spellClass,
                    casting_cost: spell.castingCost,
                    maintenance_cost: spell.maintenanceCost,
                    casting_time: spell.castingTime,
                    duration: spell.duration,
                    reference: spell.reference,

                    points: spell.points,
                    difficulty: spell.difficulty,
                    signature: spell.signature
                }
            }
        } catch (err) {

        }
    }
    mapEquipment(equipment: Equipment, entity?: _Item) {
        try {
            const data = entity.data;
            FoundryEntity.mapListItem(equipment, entity);

            equipment.foundryID = entity.id;
            equipment.canContainChildren = getProperty(data, "data.type")?.includes("_container") ?? false

            // isArray(getProperty(data, "data.modifiers"))?.forEach(
            //     (modifier: any) => equipment.modifiers.add(new EquipmentModifier(equipment).load(modifier))
            // );

            equipment.equipped = getProperty(data, "data.equipped");
            equipment.isAmmunition = getProperty(data, "data.is_ammunition");
            equipment.description = getProperty(data, "data.description");
            equipment.quantity = getProperty(data, "data.quantity");
            equipment.value = +(getProperty(data, "data.value"));
            equipment.weight = +(getProperty(data, "data.weight"));
            equipment.techLevel = getProperty(data, "data.tech_level");
            equipment.legalityClass = getProperty(data, "data.legality_class");
            equipment.reference = getProperty(data, "data.reference");
            // equipment.containedWeightReduction = isArray(getProperty(data, "data.features"))?.find((feature: json) => feature.type === "contained_weight_reduction")?.reduction ?? null;

            getProperty(data, "data.weapons")?.forEach((weapon: any) => {
                let tWeapon = equipment.addWeapon(weapon.type);
                tWeapon.load(weapon, entity);
            });

            getProperty(data, "data.features")?.forEach((feature: json) => {
                if (!feature) return
                Feature.loadFeature<Equipment>(equipment, feature.type)?.load(feature)
            });

            if (!entity.GURPSUpdater) {
                entity.GURPSUpdater = equipment.subscribe(async (item: Equipment) => {
                    //let update = await entity.update(item.save({}), {});
                    //console.log(update);
                    // console.log(item);
                }).unsubscribe;
            }

            if (getProperty(data, "data.type")?.includes("_container") || entity.getFlag("GURPS", "children")?.length > 0) {
                const children = entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID))?.filter(item => Boolean(item)) as Item[]
                equipment.canContainChildren = true;
                return children
            }

        } catch (err) {
            console.log(entity, equipment);
            console.log(err);
        }
    }
    saveEquipment(equipment: Equipment) {
        try {
            return {
                name: equipment.description || "Item",
                type: "item",
                flags: {
                    // GURPS: {
                    //     contained_by: equipment?.containedBy?.foundryID ?? null,
                    //     children: (Array.from(equipment.children) || []).map(child => child.foundryID)
                    // }
                },
                data: {
                    type: equipment.tag,
                    equipped: equipment.equipped,
                    description: equipment.description,
                    quantity: equipment.quantity,
                    value: equipment.value,
                    weight: equipment.weight,
                    tech_level: equipment.techLevel,
                    legality_class: equipment.legalityClass,
                    reference: equipment.reference,

                    weapons: Array.from(equipment.weapons).map(weapon => weapon.save({})),
                    features: Array.from(equipment.features).map(feature => feature.save({}))
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    mapTrait(trait: Trait, entity?: _Item) {
        const data = entity.data;
        FoundryEntity.mapListItem(trait, entity);

        trait.name = getProperty(data, "data.name");
        trait.disabled = !getProperty(data, "data.enabled");
        getProperty(data, "data.modifiers")?.forEach((modifier: any) => trait.modifiers.add(new TraitModifier(trait).load(modifier)));
        trait.basePoints = parseInt(getProperty(data, "data.base_points"));
        trait.hasLevels = getProperty(data, "data.has_levels");
        trait.levels = parseInt(getProperty(data, "data.levels")) ?? null;
        trait.allowHalfLevels = getProperty(data, "data.allow_half_levels");
        trait.hasHalfLevel = getProperty(data, "data.has_half_level");
        trait.roundDown = getProperty(data, "data.round_down");
        trait.controlRating = getProperty(data, "data.cr").toString();
        trait.pointsPerLevel = parseInt(getProperty(data, "data.points_per_level"));
        trait.reference = getProperty(data, "data.reference");
        trait.notes = getProperty(data, "data.notes");

        getProperty(data, "data.categories")?.forEach((category) => {
            trait.categories.add(category);
        });

        getProperty(data, "data.features")?.forEach((feature: json) => {
            if (!feature) return
            Feature.loadFeature<Trait>(trait, feature.type)?.load(feature)
        });

        getProperty(data, "data.weapons")?.forEach((weapon: any) => {
            let tWeapon = trait.addWeapon(weapon.type);
            tWeapon.load(weapon);
        });

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveTrait(trait: Trait) {
        try {
            return {
                name: trait.name || "Trait",
                type: "trait",
                flags: {},
                data: {
                    type: trait.tag,
                    name: trait.name,
                    enabled: !trait.disabled,
                    base_points: trait.basePoints,
                    has_levels: trait.hasLevels,
                    levels: trait.levels,
                    allow_half_levels: trait.allowHalfLevels,
                    has_half_level: trait.hasHalfLevel,
                    round_down: trait.roundDown,
                    cr: trait.controlRating,
                    points_per_level: trait.pointsPerLevel,

                    reference: trait.reference,
                    categories: Array.from(trait.categories),
                    notes: trait.notes,

                    features: Array.from(trait.features).map(feature => feature.save({})),
                    weapons: Array.from(trait.weapons).map(weapon => weapon.save({}))
                }
            }
        } catch (err) {

        }
    }
    mapFeature(feature: Feature<Featurable>, data: any) {
        feature.type = data.type;
        feature.leveled = data.per_level;
        feature.limitation = data.limitation;
        feature.amount = data.amount;
        switch (data.type) {
            case FeatureType.attributeBonus:
                if (feature instanceof AttributeBonus) {
                    feature.attribute = data.attribute;
                }
                break
            case FeatureType.damageResistanceBonus:
                if (feature instanceof DRBonus) {
                    feature.location = data.location;
                }
                break
            case FeatureType.reactionBonus:
                break
            case FeatureType.skillBonus:
                if (feature instanceof SkillBonus) {
                    feature.selectionType = data.selection_type;
                    feature.nameCompareType = data.name_compare_type;
                    feature.name = data.name;
                    feature.specializationCompareType = data.specialization_compare_type;
                    feature.specialization = data.specialization;
                    feature.categoryCompareType = data?.category_compare_type;
                    feature.category = data.category;
                }
                break
            case FeatureType.spellBonus:
                break
            case FeatureType.weaponDamageBonus:
                break
            default:
        }
        return feature
    }
    saveFeature(feature: Feature<Featurable>) {
        let base = {
            per_level: feature.leveled,
            type: feature.type,
            leveled: feature.leveled,
            limitation: feature.limitation,
            amount: feature.amount
        }
        switch (feature.type) {
            case FeatureType.attributeBonus:
                return Object.assign(base, {
                    attribute: feature.attribute
                })
            case FeatureType.damageResistanceBonus:
                break
            case FeatureType.skillBonus:
                return Object.assign(base, {
                    selection_type: feature.selectionType,
                    name_compare_type: feature.nameCompareType,
                    name: feature.name,
                    specialization_compare_type: feature.specializationCompareType,
                    specialization: feature.specialization
                })
            default:
                return {}
        }
    }
    mapModifier(modifier: any, entity?: _Item) {

    }
    saveModifier() {

    }
    mapWeapon(weapon: (RangedWeapon | MeleeWeapon), data: any, owner: Item) {
        weapon.foundryID = data._id;
        weapon.attackBonus = +data.weapon_skill_mod || 0;

        weapon.strength = getProperty(data, "strength_requirement") || "10";
        weapon.usage = getProperty(data, "usage");
        weapon.damage = getProperty(data, "damage");

        weapon.damageType = getProperty(data, "damage_type");
        switch (weapon.getType()) {
            case "melee_weapon":
                weapon.reach = getProperty(data, "reach");
                weapon.parry = getProperty(data, "parry");
                weapon.block = getProperty(data, "block");
                break
            case "ranged_weapon":
                weapon.accuracy = getProperty(data, "accuracy");
                weapon.range = getProperty(data, "range");
                weapon.rateOfFire = getProperty(data, "rate_of_fire");
                weapon.bulk = getProperty(data, "bulk");
                weapon.shots = getProperty(data, "shots");
                break
            default:
        }
        getProperty(data, "defaults")?.forEach(weaponDefault => {
            let proxy = weapon.addDefault();
            FoundryEntity.mapSkillDefault(proxy, weaponDefault);
        });
        weapon.subscribe((weapon) => {
            //owner.update({ "data.weapons": [] }, {})
        });
        return weapon
    }
    saveWeapon(weapon: Weapon) {
        let damageBase = weapon?.damageBase?.replaceAll(new RegExp(/\d+d/, "g"), (match) => `${match}6`) ?? "";
        damageBase = damageBase?.replace(/dx/, "d*") ?? "";
        const getDamage = () => {
            const base = (weapon.damageStrength === "sw" || weapon.damageStrength === "thr") ?
                `(@${weapon.damageStrength})${damageBase}` :
                damageBase || "";
            return base
        }
        try {
            return {
                type: weapon.getType(),
                _id: randomID(),
                strength_requirement: weapon.strength,
                usage: weapon.usage,
                damage: getDamage(),
                damage_type: weapon.damageType,
                reach: weapon.reach,
                parry: weapon.parry,
                block: weapon.block,
                accuracy: weapon.accuracy,
                range: weapon.range,
                rate_of_fire: weapon.rateOfFire,
                bulk: weapon.bulk,
                shots: weapon.shots,
                defaults: Array.from(weapon.defaults).map((weaponDefault: SkillDefault<any>) => FoundryEntity.saveSkillDefault(weaponDefault))
            }
        } catch (err) {
            console.log(err);
        }
    }
    loadList(list: List<any>, data: Item[]) {
        data.forEach(listItem => {
            const ownedBy = listItem.getFlag("GURPS", "contained_by");
            const children = listItem.getFlag("GURPS", "children");
            try {
                if (!ownedBy) {
                    const item = list.addListItem();
                    item.load(listItem);
                }
            } catch (err) {
                console.log(list, err);
            }
        });
        return list
    }
    saveList() {

    }

    load(character: Character, actor: FoundryActor, config: any): Character {
        const data = actor.data;
        character.getAttribute(Signature.DX).setLevel(getProperty(data, "data.attributes.dexterity"));
        const ST = character.getAttribute(Signature.ST).setLevel(getProperty(data, "data.attributes.strength"));
        const HT = character.getAttribute(Signature.HT).setLevel(getProperty(data, "data.attributes.health"));
        character.getAttribute(Signature.IQ).setLevel(getProperty(data, "data.attributes.intelligence"));

        character.getAttribute(Signature.Will).setLevel(getProperty(data, "data.attributes.will"));
        character.getAttribute(Signature.Per).setLevel(getProperty(data, "data.attributes.perception"));
        character.getAttribute(Signature.Move).setLevel(getProperty(data, "data.attributes.move"));
        character.getAttribute(Signature.Speed).setLevel(getProperty(data, "data.attributes.speed"));

        character.getAttribute(Signature.FP).setLevel(
            getProperty(data, "data.attributes.fatigue_points")
        );
        character.getAttribute(Signature.HP).setLevel(
            getProperty(data, "data.attributes.hit_points")
        );

        const items = actor.ownedItemsByType("item").filter(item => !getContainedBy(item) && item.getProperty("data.location") !== "other");
        character.equipmentList.load(items);

        const otherItems = actor.ownedItemsByType("item").filter(item => !getContainedBy(item) && item.getProperty("data.location") === "other");
        character.otherEquipmentList.load(otherItems);

        const skills = actor.ownedItemsByType("skill");
        character.skillList.load(skills);

        const techniques = actor.ownedItemsByType("technique");
        character.techniqueList.load(techniques);

        const traits = actor.ownedItemsByType("trait");
        character.traitList.load(traits);

        const spells = actor.ownedItemsByType("spell");
        character.spellList.load(spells);

        return character
    }
    async save(character: Character, actor: FoundryActor) {
        const remove: string[] = actor.items.map(item => item._id);
        await actor.deleteEmbeddedEntity("OwnedItem", remove)

        const create = [
            ...character.equipmentList.iter().map(item => {
                return Object.assign(item.save({}))
            }),
            ...character.otherEquipmentList.iter().map(item => {
                return Object.assign(item.save({}))
            }),
            ...[
                ...character.skillList.iter(),
                ...character.techniqueList.iter(),
                ...character.traitList.iter(),
                ...character.spellList.iter()
            ].map((item: ListItem<any>) => {
                return Object.assign(item.save({}))
            })];
        let creations = await actor.createEmbeddedEntity("OwnedItem", duplicate(create));
        console.log(character.profile.portrait);
        await actor.update({
            "name": character?.profile?.name || "???",
            "img": this.prependBase64(character?.profile?.portrait),
            "data.point_total": character.totalPoints,
            "data.pools.hit_points.value": character.getAttribute(Signature.ST).calculateLevel() - character.missingHP,
            "data.pools.fatigue_points.value": character.getAttribute(Signature.FP).calculateLevel() - character.missingFP,
            "data.attributes": {
                strength: character.getAttribute(Signature.ST).level,
                dexterity: character.getAttribute(Signature.DX).level,
                intelligence: character.getAttribute(Signature.IQ).level,
                health: character.getAttribute(Signature.HT).level,
                will: character.getAttribute(Signature.Will).level,
                speed: character.getAttribute(Signature.Speed).level,
                move: character.getAttribute(Signature.Move).level,
                perception: character.getAttribute(Signature.Per).level,
                fatigue_points: character.getAttribute(Signature.FP).level,
                hit_points: character.getAttribute(Signature.HP).level
            }
        });

        return actor
    }

    private prependBase64(base64: string) {
        if (!base64) return null
        if (base64.startsWith("data:image/png;base64")) return base64
        return "data:image/png;base64," + base64
    }
}