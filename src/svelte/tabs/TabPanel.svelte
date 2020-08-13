<script>
  import { getContext } from "svelte";
  import { TABS } from "./Tabs.svelte";
  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);
  registerPanel(panel);
</script>

<style>
  .panel {
    flex-grow: 1;
    padding-top: 10px;
  }
  .hide {
    display: none;
  }
</style>

<div class="panel" class:hide={!($selectedPanel === panel)}>
  <slot />
</div>
