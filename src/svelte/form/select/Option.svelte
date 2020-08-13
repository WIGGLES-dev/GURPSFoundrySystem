<script>
  import {
    onMount,
    onDestroy,
    getContext,
    createEventDispatcher,
  } from "svelte";
  const dispatch = createEventDispatcher();

  const { registerOption } = getContext("select");

  let registration;

  export let path = null;
  export let callback = null;
  export let value = null;
  export let disabled = null;

  const onSelect = () => {
    dispatch("select", value);
    return { callback, path };
  };
</script>

<style>

</style>

<option use:registerOption={{ onSelect }} {value} {disabled}>
  <slot />
</option>
