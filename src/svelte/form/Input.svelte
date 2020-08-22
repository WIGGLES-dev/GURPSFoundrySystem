<script>
  import { createEventDispatcher, getContext, tick } from "svelte";
  import { getValue, createTooltip } from "../../helpers.ts";
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
  export let defaultValue = type === "text" ? "" : type === "number" ? 0 : null;
  export let basedOn = 0;
  export let tooltipText = null;

  export let config = {
    clickToEdit: false,
  };

  let clickedToEdit = false;

  async function update(e) {
    let target = e.target;
    value = e.target.value;

    if (type === "number") {
      value = +target.value - basedOn;
      if (+target.value < min && min !== null) value = min - basedOn;
    }

    let update = await game.gurps4e.customUpdate({
      entity: $entity,
      value,
      path,
      array,
      alsoUpdate,
    });
    dispatch("update", { entity: update });
  }

  $: getDefaultValue = (entity) => {
    let value = getValue(entity, path, array);
    if (value === null) return defaultValue;
    if (type === "string") return value;
    if (type === "number") return value + basedOn;
    return value;
  };

  $: value = getDefaultValue($entity);
</script>

<style>
  .click-to-edit {
    display: inline-block;
    width: 100%;
  }
</style>

{#if !config.clickToEdit || clickedToEdit}
  <label
    use:createTooltip={{ tooltipText }}
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
