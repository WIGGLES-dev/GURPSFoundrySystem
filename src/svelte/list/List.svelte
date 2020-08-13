<script context="module">
  export const ROWS = [];
</script>

<script>
  import { _DragDrop } from "../../item";
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

  const DD = new _DragDrop($entity);
  const dragDropBinder = DD.dragDropBinder();

  function bind() {
    dragDropBinder(table, {
      application: DD.onList(
        `[data-listtype='${type}']`,
        `[data-listtype='${type}']`,
        type
      ),
    });
  }

  function getTableColumns() {}

  onMount(() => {
    bind();
  });

  afterUpdate(() => {
    bind();
  });

  export const hovered = writable(null);
  export const focused = writable(null);
  export const rows = writable(0);
  export const columns = writable(0);
  export let buttonLabel = "Add New";
  export let type = null;

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
      const targetI = DD.dragover(e, i, length);
      hovered.set({ i, targetI });
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

<button type="button" on:click={addListItem}>{buttonLabel}</button>
<table bind:this={table} on:drop={(e) => {}}>
  <slot name="header" />
  <slot />
  <slot name="footer" />
</table>
