<script>
  import {
    createEventDispatcher,
    setContext,
    getContext,
    onMount,
  } from "svelte";
  import { getValue, createTooltip } from "../../../helpers.ts";
  import { readable } from "svelte/store";
  const dispatch = createEventDispatcher();

  export let tooltipText = null;
  export let noop = false;
  export let defaultIndex = null;
  export let defaultValue = null;
  export let path = null;
  export let array = false;
  export let entity = getContext("entity") || null;
  export let name = null;
  export let label = "";
  export let alsoUpdate = null;
  export let disabled = null;
  export let optionPreface = "";

  const options = [];

  setContext("select", {
    registerOption(option, parameters) {
      options[option.index] = parameters.onSelect;

      return {
        update(parameters) {
          options[option.index] = parameters.onSelect;
        },
        destroy() {
          options.splice(option.index, 1);
        },
      };
    },
    optionPreface: readable(optionPreface),
  });

  export let value = getValue($entity, path, array);

  function update(e) {
    let target = e.target;
    let targetIndex = target.selectedIndex;
    let targetValue = target.options[targetIndex].value;

    let option = options[targetIndex];

    if (option) {
      option = option();
      if (option.callback) targetValue = option.callback();
      if (option.path) path = option.path;
    }

    if (noop) {
      $entity.update({ [path]: targetValue });
    } else {
      game.gurps4e.customUpdate({
        entity: $entity,
        value: targetValue,
        path,
        array,
        alsoUpdate,
      });
    }

    dispatch("change", { index: targetIndex });
  }

  function setDefault(select) {
    if (typeof defaultIndex === "number") {
      select.selectedIndex = defaultIndex;
    } else {
      Array.from(select.options).forEach((option, i) => {
        if (option.value == value) {
          select.selectedIndex = i;
        }
      });
    }
  }
</script>

<style>
</style>

<!-- svelte-ignore a11y-no-onchange -->
<label class="GURPS-label" for={name} use:createTooltip={{ tooltipText }}>
  {label}
  <select {name} on:change={update} use:setDefault {disabled}>
    <slot />
  </select>
</label>
