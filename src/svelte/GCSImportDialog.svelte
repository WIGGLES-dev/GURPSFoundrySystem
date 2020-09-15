<script>
  import Dialog from "./Dialog";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let files;

  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: "Load",
      callback: () => dispatch("Load", files),
    },
  };
</script>

<style>
</style>

<Dialog width={350} height={200} {buttons} on:close title="GCS Import">
  <input type="file" bind:files />
</Dialog>
