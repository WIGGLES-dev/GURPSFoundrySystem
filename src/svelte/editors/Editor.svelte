<script>
  import { setContext } from "svelte";
  import Trait from "./Trait";
  import Skill from "./Skill";
  import Technique from "./Technique";
  import Equipment from "./Equipment";
  import Modifier from "./Modifier";
  import EquipmentModifier from "./EquipmentModifier";
  import Spell from "./Spell";

  export let entity = null;
  setContext("entity", entity);

  function getEditorComponent(entity) {
    switch (entity.data.type) {
      case "skill":
        return Skill;
      case "trait":
        return Trait;
      case "item":
        return Equipment;
      case "modifier":
        return Modifier;
      case "eqp_modifier":
        return EquipmentModifier;
      case "spell":
        return Spell;
      case "technique":
        return Technique
      default:
        return false;
    }
  }
</script>

<style>
  
</style>

<svelte:component this={getEditorComponent($entity)} />
