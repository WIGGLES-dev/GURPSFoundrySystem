<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import Dialog from "@components/Dialog";

  let timerName;

  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: "roll",
      callback: () => dispatch("submit", timerName),
    },
  };
</script>

<Dialog
  on:close
  title="Timer Setup"
  {buttons}
  overrideSubmit={true}
  height={300}
  width={200}>
  <label>Timer Name: <input type="text" bind:value={timerName} /></label>
</Dialog>
