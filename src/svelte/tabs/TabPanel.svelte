<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";
  export let component = null;
  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
</script>

<style>
  .panel {
    height: 100%;
    padding-top: 10px;
  }
  .hide {
    display: none;
  }
</style>

<div class="panel" class:hide={!($selectedPanel === panel)}>
  {#if component}
    <svelte:component this={component} />
  {:else}
    <slot />
  {/if}
</div>
