<script>
  import { createEventDispatcher, setContext, getContext } from "svelte";
  const dispatch = createEventDispatcher();

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

  export let value = getProperty($entity.data, path);

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
      game.gurps4e.customUpdate({
        entity: $entity,
        value: targetValue,
        path,
        array,
        alsoUpdate,
      });
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
      console.log(select, value);
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

<label class="GURPS-label" for={name}>
  {label}
  <select {name} on:blur={update} use:setDefault>
    <slot />
  </select>
</label>
