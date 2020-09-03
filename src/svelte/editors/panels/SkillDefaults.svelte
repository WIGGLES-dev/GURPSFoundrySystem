<script>
  import { getContext, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { Select, Option, Input } from "../../form/form";

  export let entity = getContext("entity") || null;
  console.log($entity);

  export let path = "data.defaults";

  $: getDefaults = () => {
    return $entity.getProperty(path) || [];
  };
</script>

<style>
  .defaults-list {
    position: relative;
  }
  .default {
    position: relative;
  }
  .list-interface {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  .defaults-list :global(input[type="number"]) {
    width: 50px;
  }
  .default-detail {
    max-width: 90%;
  }
  .default-detail :global(label.grow) {
    flex: 1;
  }
</style>

<div class="defaults-list">
  {#if getDefaults().length === 0}
    <span
      class="fas fa-plus-square list-interface"
      on:click={() => dispatch('adddefault')} />
  {/if}
  {#each getDefaults() as skillikeDefault, i (skillikeDefault._id)}
    <div class="default">
      <div class="list-interface">
        <span
          class="fas fa-minus-square"
          on:click={() => dispatch('removedefault', {
              id: skillikeDefault._id,
            })} />
        <span
          class="fas fa-plus-square"
          on:click={() => dispatch('adddefault')} />
      </div>
      <div class="flex">
        <Select {path} array={{ index: i, property: 'type' }}>
          <Option value="DX">DX</Option>
          <Option value="ST">ST</Option>
          <Option value="IQ">IQ</Option>
          <Option value="HT">HT</Option>
          <Option value="Will">Will</Option>
          <Option value="Perception">Perception</Option>
          <Option value="Skill">Skill Named</Option>
          <Option disabled={true}>Parrying Skill Named</Option>
          <Option disabled={true}>Blocking Skill Named</Option>
          <Option disabled={true}>10</Option>
        </Select>
        {#if skillikeDefault.type !== 'Skill'}
          <Input
            {path}
            type="number"
            array={{ index: i, property: 'modifier' }} />
        {/if}
      </div>
      {#if skillikeDefault.type === 'Skill'}
        <div class="flex default-detail">
          <Input
            classList={'grow'}
            {path}
            array={{ index: i, property: 'name' }} />
          <Input
            classList={'grow'}
            {path}
            array={{ index: i, property: 'specialization' }}
            placeholder="Optional Specialization" />
          <Input
            type="number"
            {path}
            array={{ index: i, property: 'modifier' }} />
        </div>
      {/if}
    </div>
  {/each}
</div>
