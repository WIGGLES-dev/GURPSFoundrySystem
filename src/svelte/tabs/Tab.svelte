<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";
  export let index = null;
  const tab = { index };
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  registerTab(tab);
</script>

<style>
  button {
    background: none;
    border: none;
    margin: 0;
    color: black;
    flex: 1;
  }

  .selected {
    background-color: black;
    color: white;
  }
</style>

<button
  type="button"
  class:selected={$selectedTab === tab}
  on:click={() => selectTab(tab)}>
  <slot />
</button>
