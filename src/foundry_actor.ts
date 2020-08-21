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
} from "g4elogic";
import { _Actor as FoundryActor } from "./sheet";
import { _Item } from "./item";

export class FoundryEntity extends Serializer {
    static scope = "foundry"

    constructor() {
        super();
    }

    init() {
        this.
            register(SkillDefault, {
                save: this.saveSkillDefault,
                load: this.mapSkillDefault
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

    mapSkillDefault(skillDefault: SkillDefault<any>, data: any) {

    }
    saveSkillDefault(skillDefault: SkillDefault<any>) {

    }

    mapSkill(skill: Skill, entity?: _Item) {
        const data = entity.data;
        skill.foundryID = entity.id;

        FoundryEntity.mapListItem(skill, entity);
        FoundryEntity.mapSkillLike(skill, entity);

        skill.difficulty = getProperty(data, "data.difficulty") as Difficulty;
        skill.signature = getProperty(data, "data.signature") as Signature;
        skill.techLevel = getProperty(data, "data.tech_level");
        skill.encumbrancePenaltyMultiple = getProperty(data, "data.encumbrance_penalty_multiplier");
        // skill.defaultedFrom = new SkillDefault<Skill>(skill).load(getProperty(data, "data.defaulted_from"));
        skill.reference = getProperty(data, "data.reference");
        skill.notes = getProperty(data, "data.notes");
        // isArray(getProperty(data, "data.defaults")?.forEach((skillDefault: json) => skill.defaults.add(new SkillDefault<Skill>(skill).load(skillDefault))));

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveSkill(skill: Skill) {
        try {
            return Object.assign(FoundryEntity.saveSkillLike(skill), {
                type: skill.tag,
                difficulty: skill.difficulty,
                signature: skill.signature,
                tech_level: skill.techLevel,
                encumbrance_penalty_multiplier: skill.encumbrancePenaltyMultiple,
                reference: skill.reference,
                notes: skill.notes
            })
        } catch (err) {

        }
    }
    mapTechnique(technique: Technique, entity?: _Item): null {
        const data = entity.data;
        FoundryEntity.mapListItem(technique, entity);
        this.mapSkill(technique, entity);
        technique.limit = getProperty(data, "data.limit");
        technique.difficulty = getProperty(data, "data.difficulty") as TehchniqueDifficulty;
        // technique.default = new SkillDefault<Technique>(technique).load(getProperty(data, "data.default"));
        return null
    }
    saveTechnique() {

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


        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveSpell(spell: Spell) {
        try {
            return Object.assign({}, {
                college: spell.college,
                power_source: spell.powerSource,
                class: spell.spellClass,
                casting_cost: spell.castingCost,
                maintenance_cost: spell.maintenanceCost,
                casting_time: spell.castingTime,
                reference: spell.reference
            })
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

            equipment.equipped = getProperty(data, "data.equipped")
            equipment.description = getProperty(data, "data.description");
            equipment.quantity = getProperty(data, "data.quantity");
            equipment.value = +(getProperty(data, "data.value"));
            equipment.weight = +(getProperty(data, "data.weight"));
            equipment.techLevel = getProperty(data, "data.tech_level");
            equipment.legalityClass = getProperty(data, "data.legality_class");
            // equipment.containedWeightReduction = isArray(getProperty(data, "data.features"))?.find((feature: json) => feature.type === "contained_weight_reduction")?.reduction ?? null;

            getProperty(data, "data.weapons")?.forEach((weapon: any, i: number, list: any[]) => {
                let tWeapon = equipment.addWeapon(weapon.type);
                tWeapon.load(weapon);
            });

            // getProperty(data, "data.features")?.forEach((feature: json) => {
            //     Feature.loadFeature<Equipment>(equipment, feature.type)?.load(feature)
            // });

            if (getProperty(data, "data.type")?.includes("_container") || entity.getFlag("GURPS", "children")?.length > 0) {
                const children = entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
                equipment.canContainChildren = true;
                console.log(children);
                return children
            }

        } catch (err) {
            console.log(err);
        }
    }
    saveEquipment(equipment: Equipment) {
        try {
            return Object.assign({}, {
                type: equipment.tag,
                equipped: equipment.equipped,
                description: equipment.description,
                quantity: equipment.quantity,
                value: equipment.value,
                weight: equipment.weight,
                tech_level: equipment.techLevel,
                legality_class: equipment.legalityClass,

                weapons: Array.from(equipment.weapons).map(weapon => weapon.save())
            })
        } catch (err) {
            console.log(err);
        }
    }
    mapTrait(trait: Trait, entity?: _Item) {
        const data = entity.data;
        trait.foundryID = entity.id;

        FoundryEntity.mapListItem(trait, entity);

        trait.name = getProperty(data, "data.name");

        trait.disabled = !getProperty(data, "data.enabled");

        getProperty(data, "data.modifiers")?.forEach((modifier: any) => trait.modifiers.add(new TraitModifier(trait).load(modifier)));
        trait.basePoints = parseInt(getProperty(data, "data.base_points"));
        trait.levels = parseInt(getProperty(data, "data.levels")) ?? null;
        trait.allowHalfLevels = getProperty(data, "data.allow_half_levels");
        trait.hasHalfLevel = getProperty(data, "data.has_half_level");
        trait.roundDown = getProperty(data, "data.round_down");
        trait.controlRating = getProperty(data, "data.cr");
        //data.types?.forEach((type: TraitType) => trait.types.add(type));
        trait.pointsPerLevel = parseInt(getProperty(data, "data.points_per_level"));
        trait.hasLevels = Boolean(getProperty(data, "data.levels")) ? true : false;
        trait.reference = getProperty(data, "data.reference");
        trait.notes = getProperty(data, "data.notes");

        getProperty(data, "data.features")?.forEach((feature: json) => {
            Feature.loadFeature<Trait>(trait, feature.type)?.load(feature)
        });

        getProperty(data, "data.weapons")?.forEach((weapon: json) => {

        });

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveTrait(trait: Trait) {
        try {
            return Object.assign({}, {
                type: trait.tag,
                name: trait.name,
                enabled: !trait.disabled,
                base_points: trait.basePoints,
                levels: trait.levels,
                allow_half_levels: trait.allowHalfLevels,
                has_half_level: trait.hasHalfLevel,
                round_down: trait.roundDown,
                cr: trait.controlRating,
                points_per_level: trait.pointsPerLevel,

                reference: trait.reference,
                notes: trait.notes,

                weapons: Array.from(trait.weapons).map(weapon => weapon.save())
            })
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
                    feature.nameCompareType = data.name?.compare;
                    feature.name = data.name?.qualifier;
                    feature.specializationCompareType = data.specialization?.compare;
                    feature.specialization = data.specialization?.qualifier;
                    feature.categoryCompareType = data?.category?.compare;
                    feature.category = data?.category?.qualifier;
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
    saveFeature() {

    }
    mapModifier(modifier: any, entity?: _Item) {

    }
    saveModifier() {

    }
    mapWeapon(weapon: Weapon, data: any) {
        weapon.foundryID = data._id;

        weapon.strength = getProperty(data, "strength_requirement")
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
        return weapon
    }
    saveWeapon(weapon: Weapon) {
        try {
            return {
                type: weapon.getType(),
                _id: randomID(),
                strength_requirement: weapon.strength,
                usage: weapon.usage,
                damage: weapon.damage,
                damage_type: weapon.damageType,
                reach: weapon.reach,
                parry: weapon.parry,
                block: weapon.block,
                accuracy: weapon.accuracy,
                range: weapon.range,
                rate_of_fire: weapon.rateOfFire,
                bulk: weapon.bulk,
                shots: weapon.shots
            }
        } catch (err) {
            console.log(err);
        }
    }
    loadList(list: List<any>, data: Item[]) {
        data.forEach(listItem => {
            const ownedBy = listItem.getFlag("GURPS", "containedBy");
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

    load(character: Character, actor: FoundryActor): Character {
        const data = actor.data;
        character.getAttribute(Signature.DX).setLevel(getProperty(data, "data.attributes.dexterity"));
        const ST = character.getAttribute(Signature.ST).setLevel(getProperty(data, "data.attributes.strength"));
        const HT = character.getAttribute(Signature.HT).setLevel(getProperty(data, "data.attributes.health"));
        character.getAttribute(Signature.IQ).setLevel(getProperty(data, "data.attributes.intelligence"));

        character.getAttribute(Signature.Will).setLevel(getProperty(data, "data.attributes.will"));
        character.getAttribute(Signature.Per).setLevel(getProperty(data, "data.attributes.perception"));
        character.getAttribute(Signature.Move).setLevel(getProperty(data, "data.attributes.move"));
        character.getAttribute(Signature.Speed).setLevel(getProperty(data, "data.attribtues.speed"));

        character.getAttribute(Signature.FP).setLevel(
            getProperty(data, "data.attributes.fatigue_points")
        );
        character.getAttribute(Signature.HP).setLevel(
            getProperty(data, "data.attributes.hit_points")
        );

        const items = actor.ownedItemsByType("item");
        character.equipmentList.load(items);

        const skills = actor.ownedItemsByType("skill");
        character.skillList.load(skills);

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
            ...character.skillList.iter(),
            ...character.traitList.iter(),
            ...character.equipmentList.iter(),
            ...character.otherEquipmentList.iter(),
            ...character.spellList.iter()
        ].map((item: ListItem<any>) => {
            return {
                name: item.name || "???",
                type: this.determineType(item.tag),
                data: item.save()
            }
        });

        await actor.createEmbeddedEntity("OwnedItem", duplicate(create));

        const weaponUpdates = create.map(item => {

        });

        // await actor.updateEmbeddedEntity("OwnedItem", weaponUpdates)

        await actor.update({
            "name": character?.profile?.name || "???",
            "img": character?.profile?.portrait ? this.prependBase64(character.profile.portrait) : null,
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
        })

        return actor
    }

    private prependBase64(base64: string) {
        if (base64.startsWith("data:image/png;base64")) return base64
        return "data:image/png;base64," + base64
    }

    private determineType(tag: string) {
        if (tag === "equipment") return "item"
        if (tag === "technique") return "skill"
        return tag
    }
}