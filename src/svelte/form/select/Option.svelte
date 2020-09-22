<script>
  import {
    onMount,
    onDestroy,
    getContext,
    createEventDispatcher,
  } from "svelte";

  const dispatch = createEventDispatcher();

  const { registerOption, optionPreface } = getContext("select");

  let registration;

  export let path = null;
  export let callback = null;
  export let value = null;
  export let disabled = null;
  export let selected = null;

  const onSelect = () => {
    dispatch("select", value);
    return { callback, path };
  };
</script>

<style>

</style>

<option use:registerOption={{ onSelect }} {value} {disabled} {selected}>
  {$optionPreface}
  <slot />
</option>
