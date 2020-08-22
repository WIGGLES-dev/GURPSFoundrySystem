<script>
  import Sheet from "./Sheet";

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
</script>

<style>

</style>

<div>
  <svelte:component this={Sheet} {entity} />
</div>
