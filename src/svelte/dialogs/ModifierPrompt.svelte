<script>
  import Dialog from "../Dialog";
  import { Input } from "../form/form";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let modifier = [];
  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: "Roll",
      callback: () => dispatch("roll", modifier),
    },
  };
</script>

<Dialog
  on:close
  title="Modifiers"
  {buttons}
  height={300}
  width={200}
  overrideSubmit={true}>
  <label>Modifiers: <input type="number" bind:value={modifier} /></label>
</Dialog>
