<script>
  import { createEventDispatcher, getContext } from "svelte";
  const dispatch = createEventDispatcher();

  export let entity = getContext("entity") || null;
  export let path = null;
  export let cols = 30;
  export let rows = 10;
  export let name = null;
  export let disabled = null;
  export let label = "";

  function update(e) {
    let target = e.target;
    $entity.update({ [path]: target.value });
    dispatch("change");
  }
</script>

<style>

</style>

<label class="GURPS-label" for={name}>
  {label}
  <textarea
    {name}
    {cols}
    {disabled}
    {rows}
    on:change={update}
    value={$entity ? window.getProperty($entity.data, path) : null} />
</label>
