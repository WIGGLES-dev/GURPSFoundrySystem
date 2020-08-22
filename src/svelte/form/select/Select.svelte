<script>
  import { createEventDispatcher, setContext, getContext } from "svelte";
  const dispatch = createEventDispatcher();

  import { getValue } from "../../../helpers.ts";

  export let noop = false;
  export let defaultIndex = null;
  export let path = null;
  export let array = false;
  export let entity = getContext("entity") || null;
  export let name = null;
  export let label = "";
  export let alsoUpdate = null;

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
    if (!defaultIndex) {
      Array.from(select.options).forEach((option, i) => {
        if (option.value == value) {
          select.selectedIndex = i;
        }
      });
    } else {
      select.selectedIndex = defaultIndex;
    }
  }
</script>

<style>

</style>

<!-- svelte-ignore a11y-no-onchange -->
<label class="GURPS-label" for={name}>
  {label}
  <select {name} on:change={update} use:setDefault>
    <slot />
  </select>
</label>
