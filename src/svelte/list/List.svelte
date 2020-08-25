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

  let tableHTMLElement;

  function bind(element) {
    if (config.dragDrop) {
      GURPSDragDrop.dropOnList(type).bind(element);
    }
  }

  onMount(() => {
    bind(tableHTMLElement);
  });

  afterUpdate(() => {
    bind(tableHTMLElement);
  });

  export const hovered = writable(null);
  export const focused = writable([]);
  export const rows = writable(0);
  export let type = null;
  export let config = { dragDrop: true };

  setContext(ROWS, {
    setFocused(i, toggle) {
      focused.update((focused) => {
        if (focused.includes(i) && toggle) {
          focused.splice(focused.indexOf(i), 1);
        } else {
          focused.push(i);
        }
        dispatch("focus", { focused, newest: i });
        return focused;
      });
    },
    hovered,
    focused,
    type,
  });
</script>

<style>
  table {
    white-space: nowrap;
    text-align: center;
  }
  .flex {
    display: flex;
  }
  .toolbar {
    width: 100%;
  }
  .toolbar > :global(.tool) {
    color: white;
    background-color: black;
    padding: 5px;
  }
  .toolbar > :global(.tool):hover {
  }
</style>

<slot name="button" />

<div class="flex toolbar">
  <slot name="tool" />
</div>

<svelte:window
  on:click|capture={(e) => {
    if (tableHTMLElement.contains(e.target)) {
    } else {
      hovered.set(null);
      focused.set([]);
    }
  }} />

<table bind:this={tableHTMLElement} on:drop={(e) => {}}>
  <slot name="colgroups" />
  <slot name="header" />
  <slot />
  <slot name="footer" />
</table>
