<script>
  import { createEventDispatcher, getContext, tick } from "svelte";
  import { writable } from "svelte/store";
  import Character from "../Character.svelte";
  const dispatch = createEventDispatcher();

  let inputElem;

  export let entity = getContext("entity") || null;
  export let path = null;
  export let array = false;
  export let alsoUpdate = null;
  export let type = "text";
  export let min = null;
  export let disabled = null;
  export let name = null;
  export let autocomplete = "off";
  export let label = "";
  export let step = null;

  export let config = {
    clickToEdit: false,
    width: null,
    basedOn: null,
    delta: 0,
  };

  let clickedToEdit = false;

  async function update(e) {
    let target = e.target;
    let tValue = type === "number" ? +target.value : target.value;

    let update = await game.gurps4e.customUpdate({
      entity: $entity,
      value: tValue,
      path,
      array,
      alsoUpdate,
    });

    dispatch("update", { entity: update });
  }

  $: value = getValue($entity);

  function getValue(entity) {
    if (array) {
      const data = entity.getData(path);
      if (array.property) {
        return data[array.index][array.property];
      } else {
        return data[array.index];
      }
    } else {
      return entity.getData(path);
    }
  }
</script>

<style>
  .click-to-edit {
    display: inline-block;
    width: 100%;
  }
</style>

{#if !config.clickToEdit || clickedToEdit}
  <label
    class:click-to-edit={config.clickToEdit}
    for={name}
    class="GURPS-label"
    data-label={Boolean(label)}>

    {#if label}
      <span>{label}</span>
    {:else}
      <slot name="label-text" {value} />
    {/if}

    <input
      draggable={true}
      on:dragstart|preventDefault|stopPropagation
      bind:this={inputElem}
      {step}
      style={config.width ? `width:${config.width};` : ''}
      autocomplete={autocomplete === 'off' ? 'off' : null}
      {name}
      {disabled}
      {min}
      {type}
      on:blur={() => (clickedToEdit = false)}
      on:change={update}
      {value} />
  </label>
{:else}
  <div
    class="click-to-edit"
    on:dblclick={async () => {
      clickedToEdit = true;
      await tick();
      inputElem.focus();
    }}>
    {#if !value}&nbsp;{/if}
    <slot name="no-edit" {value} />
  </div>
{/if}
