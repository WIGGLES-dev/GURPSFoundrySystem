<script>
  import Dialog from "./Dialog";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>

</style>

<Dialog on:close title="GCS Import">
  <input
    type="file"
    on:change={(e) => {
      dispatch('File Loaded', e.target.files);
    }} />
</Dialog>
