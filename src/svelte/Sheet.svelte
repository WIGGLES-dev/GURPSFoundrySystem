<script>
  import Character from "./Character";
  import Monster from "./monster/Monster";
  import PartyManager from "./party/PartyManager";
  import { App } from "g4elogic";

  export let entity = null;
  export let character = null;
  export let appInstance;

  function getSheetComponent(entity) {
    switch (entity.data.type) {
      case "character":
        return App;
        return Character;
      case "monster":
        return Monster;
      case "party":
        return PartyManager;
    }
  }
</script>

<style>
  div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

<div class="GURPS">
  <svelte:component
    this={getSheetComponent($entity)}
    bind:this={appInstance}
    {entity}
    {character} />
</div>
