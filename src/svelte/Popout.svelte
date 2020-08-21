<script>
  import Character from "./Character";

  import { onDestroy } from "svelte";

  export const messenger = new BroadcastChannel("GURPS");

  export let type = null;
  export let entity = null;
  const GURPS = $entity.GURPS;

  messenger.onmessage = (e) => {};

  export let component = null;

  onDestroy(() => {
    messenger.close();
  });

  function getComponent() {
    switch ($entity.data.type) {
      case "character":
        return Character;
    }
  }
</script>

<style>

</style>

<div>
  <svelte:component this={getComponent()} {entity} />
</div>
