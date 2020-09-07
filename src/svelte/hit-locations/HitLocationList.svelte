<script>
  import HitLocation from "./HitLocation";
  import { getContext } from "svelte";
  const entity = getContext("entity");
  const GURPS = getContext("GURPS");
</script>

<style>
</style>

{#each $GURPS.locationList.locations as location, i (location.uuid)}
  <HitLocation {location} maxHP={$GURPS.getAttribute('HP').calculateLevel()} />
{/each}
