<script>
  import Character from "./Character";
  import Monster from "./monster/Monster";

  export let entity = null;

  function getSheetComponent(entity) {
    switch (entity.data.type) {
      case "character":
        return Character;
      case "monster":
        return Monster;
    }
  }
</script>

<style>

</style>

<svelte:component this={getSheetComponent($entity)} {entity} />