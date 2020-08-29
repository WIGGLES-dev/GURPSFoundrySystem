<script>
  import { Input } from "./form/form";
  import { getContext } from "svelte";
  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;
</script>

<style>

</style>

<div>
  <button
    type="button"
    on:click={async () => {
      let currentPools = $entity.getProperty('data.pools.custom') || [];
      currentPools.push({ value: 10, max: 10, _id: randomID() });
      $entity.update({ 'data.pools.custom': duplicate(currentPools) });
    }}>
    Add Pool
  </button>
  {#each $entity.getProperty('data.pools.custom') || [] as pool, i (pool._id)}
    <div class="flex">
      <Input path="data.pools.custom" array={{ index: i, property: 'name' }} />
      <Input
        path="data.pools.custom"
        array={{ index: i, property: 'value' }}
        type="number" />
      <Input
        path="data.pools.custom"
        array={{ index: i, property: 'max' }}
        type="number" />
      <i
        class="fas fa-trash"
        on:click={(e) => {
          let update = $entity.getProperty('data.pools.custom');
          update.length === 1 ? (update = []) : update.splice(i, 1);
          $entity.update({ 'data.pools.custom': duplicate(update) });
        }} />
    </div>
  {/each}
  <button
    type="button"
    on:click={(e) => $entity.update({ 'data.pools.custom': false })}>
    Reset
  </button>
</div>
