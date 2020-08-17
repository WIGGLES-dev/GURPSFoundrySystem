<script>
  import Character from "./Character";
  import Monster from "./monster/Monster";
  import PartyManager from "./party/PartyManager";

  export let entity = null;

  function getSheetComponent(entity) {
    switch (entity.data.type) {
      case "character":
        return Character;
      case "monster":
        return Monster;
      case "party":
        return PartyManager;
    }
  }
</script>

<style>

</style>

<svelte:component this={getSheetComponent($entity)} {entity} />
