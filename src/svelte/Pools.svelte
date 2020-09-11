<script>
  import { Input } from "./form/form";
  import { getContext } from "svelte";
  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;
</script>

<style>
  .pools :global(input) {
    max-width: 50px;
  }
  .pools :global(.pool-name) {
    flex-grow: 1;
  }
  .pools :global(.pool-name input) {
    max-width: initial;
    min-width: 50px;
    width: 100%;
  }
  .pools :global(.GURPS-label) {
    padding: 0px;
    margin: 0px 5px 0px 5px;
  }
  .pools {
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.05);
  }
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
  <div class="pools">
    {#each $entity.getProperty('data.pools.custom') || [] as pool, i (pool._id)}
      <div class="flex pool">
        <Input
          classList="pool-name"
          path="data.pools.custom"
          array={{ index: i, property: 'name' }} />
        <Input
          path="data.pools.custom"
          array={{ index: i, property: 'value' }}
          type="number" />
        <span>/</span>
        <Input
          path="data.pools.custom"
          array={{ index: i, property: 'max' }}
          type="number" />
        <i
          style="margin-left: auto;"
          class="fas fa-trash"
          on:click={(e) => {
            let update = $entity.getProperty('data.pools.custom');
            update.length === 1 ? (update = []) : update.splice(i, 1);
            $entity.update({ 'data.pools.custom': duplicate(update) });
          }} />
      </div>
    {/each}
  </div>
  <button
    type="button"
    on:click={(e) => $entity.update({ 'data.pools.custom': false })}>
    Reset
  </button>
</div>
