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
  import { noop } from "svelte/internal";
  const dispatch = createEventDispatcher();

  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;

  let tableHTMLElement;
  let lastTimestamp = Number.NEGATIVE_INFINITY;

  function bind(element) {
    if (config.dragDrop) {
      GURPSDragDrop.dropOnList(type).bind(element);
    }
  }

  function getEntityFromIndex(table) {}

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
    setFocused(i, toggle, timestamp) {
      if (timestamp) lastTimestamp = timestamp;
      focused.update((focused) => {
        if (focused.includes(i) && toggle) {
          focused.splice(focused.indexOf(i), 1);
        } else if (timestamp) {
          let lastFocused = focused[focused.length - 1];
          if (timestamp - lastTimestamp < 100) {
            console.log(timestamp - lastTimestamp);
            for (let i = 0; i < Math.abs(lastFocused - i); ++i) {
              let toInclude = lastFocused + i + 1;
              if (!focused.includes(toIncludes)) focused.push(i);
            }
          }
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
    try {
      if (tableHTMLElement.contains(e.target)) {
      } else {
        hovered.set(null);
        focused.set([]);
      }
    } catch (err) {}
  }}
  on:keydown={(e) => {
    if (e.code == 46) {
      $focused.forEach((focusedItem, i) => {});
    }
  }} />

<table bind:this={tableHTMLElement} on:drop={(e) => {}}>
  <slot name="colgroups" />
  <slot name="header" />
  <slot />
  <slot name="footer" />
</table>
