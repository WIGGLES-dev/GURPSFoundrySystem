<script context="module">
  export const TABS = {};
</script>

<script>
  export let tabIndex = $selectedTab || 0;
  import { setContext, onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const tabs = [];
  const panels = [];
  const selectedTab = writable(null);
  const selectedPanel = writable(null);

  onMount(() => {
    selectedTab.set(tabs[tabIndex]);
    selectedPanel.set(panels[tabIndex]);
  });

  setContext(TABS, {
    registerTab: (tab) => {
      tabs.push(tab);
      selectedTab.update((current) => current || tab);

      onDestroy(() => {
        const i = tabs.indexOf(tab);
        tabs.splice(i, 1);
        selectedTab.update((current) =>
          current === tab ? tabs[i] || tabs[tabs.length - 1] : current
        );
      });
    },

    registerPanel: (panel) => {
      panels.push(panel);
      selectedPanel.update((current) => current || panel);

      onDestroy(() => {
        const i = panels.indexOf(panel);
        panels.splice(i, 1);
        selectedPanel.update((current) =>
          current === panel ? panels[i] || panels[panels.length - 1] : current
        );
      });
    },

    selectTab: (tab) => {
      const i = tabs.indexOf(tab);
      selectedTab.set(tab);
      selectedPanel.set(panels[i]);
      dispatch("tabchange", tab.index);
    },

    selectedTab,
    selectedPanel,
  });
</script>

<style>
  .flex-column {
    display: flex;
    flex-direction: column;
  }
</style>

<div class="flex-column">
  <slot />
</div>
