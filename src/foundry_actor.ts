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
    scope = "foundry"
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

    private static mapSkillLike(skillLike: SkillLike<any>, entity?: _Item) {
        const data = entity.data;
        skillLike.foundryID = entity.id;
        skillLike.name = getProperty(data, "data.name");
        skillLike.difficulty = getProperty(data, "data.difficulty") as Difficulty;
        skillLike.points = getProperty(data, "data.points");
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
        skill.defaultedFrom = new SkillDefault<Skill>(skill).load(getProperty(data, "data.defaulted_from"));
        skill.reference = getProperty(data, "data.reference");
        skill.notes = getProperty(data, "data.notes");
        isArray(getProperty(data, "data.defaults")?.forEach((skillDefault: json) => skill.defaults.add(new SkillDefault<Skill>(skill).load(skillDefault))));

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveSkill() {
        
    }
    mapTechnique(technique: Technique, entity?: _Item): null {
        const data = entity.data;
        FoundryEntity.mapListItem(technique, entity);
        this.mapSkill(technique, entity);
        technique.limit = getProperty(data, "data.limit");
        technique.difficulty = getProperty(data, "data.difficulty") as TehchniqueDifficulty;
        technique.default = new SkillDefault<Technique>(technique).load(getProperty(data, "data.default"));
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
        //resisted by

        spell.duration = getProperty(data, "data.duration");


        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveSpell() {

    }
    mapEquipment(equipment: Equipment, entity?: _Item) {
        try {
            const data = entity.data;

            FoundryEntity.mapListItem(equipment, entity);

            equipment.foundryID = entity.id;
            equipment.canContainChildren = getProperty(data, "data.type")?.includes("_container") ?? false

            isArray(getProperty(data, "data.modifiers"))?.forEach(
                (modifier: any) => equipment.modifiers.add(new EquipmentModifier(equipment).load(modifier))
            );

            equipment.equipped = getProperty(data, "data.equipped")
            equipment.description = getProperty(data, "data.description");
            equipment.equipped = getProperty(data, "data.equipped");
            equipment.quantity = getProperty(data, "data.quantity");
            equipment.value = parseFloat(getProperty(data, "data.value"));
            equipment.weight = parseFloat(getProperty(data, "data.weight"));
            equipment.techLevel = getProperty(data, "data.tech_level");
            equipment.legalityClass = getProperty(data, "data.legality_class");
            equipment.containedWeightReduction = isArray(getProperty(data, "data.features"))?.find((feature: json) => feature.type === "contained_weight_reduction")?.reduction ?? null;

            entity.getWeapons().forEach((weapon: any, i: number, list: any[]) => {
                let tWeapon = equipment.addWeapon(weapon.type);
                tWeapon.load(weapon);
            });

            getProperty(data, "data.features")?.forEach((feature: json) => {
                Feature.loadFeature<Equipment>(equipment, feature.type)?.load(feature)
            });

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
    saveEquipment() {

    }
    mapTrait(trait: Trait, entity?: _Item) {
        const data = entity.data;
        trait.foundryID = entity.id;

        FoundryEntity.mapListItem(trait, entity);

        trait.name = getProperty(data, "data.name");
        getProperty(data, "data.modifiers")?.forEach((modifier: any) => trait.modifiers.add(new TraitModifier(trait).load(modifier)));
        trait.basePoints = parseInt(getProperty(data, "data.base_points"));
        trait.levels = parseInt(getProperty(data, "data.levels")) ?? null;
        trait.allowHalfLevels = getProperty(data, "data.allow_half_levels");
        trait.hasHalfLevel = getProperty(data, "data.has_half_level");
        trait.roundDown = getProperty(data, "data.round_down");
        trait.controlRating = getProperty(data, "data.cr");
        //data.types?.forEach((type: TraitType) => trait.types.add(type));
        trait.pointsPerLevel = parseInt(getProperty(data, "data.points_per_level"));
        trait.disabled = !Boolean(getProperty(data, "data.enabled"));
        trait.hasLevels = Boolean(getProperty(data, "data.levels")) ? true : false;
        trait.reference = getProperty(data, "data.reference")
        trait.notes = getProperty(data, "data.notes");

        getProperty(data, "data.features")?.forEach((feature: json) => {
            Feature.loadFeature<Trait>(trait, feature.type)?.load(feature)
        });

        getProperty(data, "data.weapons")?.forEach((weapon: json) => {

        })

        if (getProperty(data, "data.type")?.includes("_container")) {
            return entity.getFlag("GURPS", "children")?.map((itemID: string) => entity?.actor?.getOwnedItem(itemID)) as Item[]
        }
    }
    saveTrait() {

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
        weapon.usage = getProperty(data, "usage");
        weapon.damage = getProperty(data, "damage");
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
                weapon.shots = getProperty(data, "shots");
                weapon.bulk = getProperty(data, "bulk");
                break
            default:
        }
        return weapon
    }
    saveWeapon() {

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
    save() {

    }
}