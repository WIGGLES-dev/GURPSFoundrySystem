<script>
  import { createEventDispatcher, getContext } from "svelte";
  const dispatch = createEventDispatcher();
  export let on = true;
  export let off = false;
  export let path = null;
  export let entity = getContext("entity") || null;
  export let disabled = null;
  export let name = null;
  export let label = "";
  
  let value = window.getProperty($entity.data, path);

  async function update(e) {
    let target = e.target;
    $entity.update({ [path]: target.checked ? on : off });
    dispatch("toggle");
  }
</script>

<style>

</style>

<label class="GURPS-label" for={name}>
  {label}
  <input
    {name}
    type="checkbox"
    {disabled}
    on:change={update}
    checked={value == on} />
</label>
