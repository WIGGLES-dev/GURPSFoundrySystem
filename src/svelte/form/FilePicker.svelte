<script>
  import { getContext, onMount } from "svelte";

  export let entity = getContext("entity") || null;
  export let type = null;
  export let width = null;
  export let height = null;

  let field;
  let button;
  let picker;

  onMount(() => {
    //picker = FilePicker.fromButton(button);
  });

  function fetchInput(e) {
    window.game.gurps4e.customUpdate({
      entity: $entity,
      value: e.target.value,
      path: "img",
    });
  }
  function renderPicker(e) {
    if (picker && picker.rendered) {
    } else {
      picker = new FilePicker({
        type,
        field,
        current: field.value,
        button,
      });
      picker.render();
    }
  }
</script>

<style>

</style>

<img
  {width}
  {height}
  on:dblclick={renderPicker}
  alt="character profile"
  src={window.getProperty($entity.data, 'img') || 'icons/svg/mystery-man.svg'} />
<input type="hidden" bind:this={field} on:change={fetchInput} />
