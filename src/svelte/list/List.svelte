<script context="module">
  export const ROWS = [];
</script>

<script>
  import { GURPSDragDrop } from "../../dragdrop";
  import { writable } from "svelte/store";
  import {
    onMount,
    afterUpdate,
    getContext,
    setContext,
    onDestroy,
    createEventDispatcher,
  } from "svelte";
  const dispatch = createEventDispatcher();

  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;

  let table;

  function bind(element) {
    if (config.dragDrop) {
      GURPSDragDrop.dropOnList(type).bind(element);
    }
  }

  function getTableColumns() {}

  onMount(() => {
    bind(table);
  });

  afterUpdate(() => {
    bind(table);
  });

  export const hovered = writable(null);
  export const focused = writable(null);
  export const rows = writable(0);
  export const columns = writable(0);
  export let buttonLabel = "Add New";
  export let type = null;
  export let config = { dragDrop: true, button: true };

  setContext(ROWS, {
    registerRow(rowElement) {
      ROWS.push(rowElement);
      rows.update((store) => store++);
    },
    setFocused(i) {
      focused.set(i);
      dispatch("focused");
    },
    setDragover(e, i, length) {
      hovered.set(i);
      dispatch("hovered", i);
    },
    hovered,
    focused,
    rows,
    type,
    columns,
  });

  onDestroy(() => {});

  function addListItem(e) {
    dispatch("addlistitem");
  }
</script>

<style>
  table {
    white-space: nowrap;
    text-align: center;
  }
</style>

<svelte:window />

<div bind:this={table}>
  {#if config.button}
    <button type="button" on:click={addListItem}>{buttonLabel}</button>
  {/if}
  <table on:drop={(e) => {}}>
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </table>
</div>
