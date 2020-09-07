<script context="module">
  export const ROWS = [];
</script>

<script>
  import { createContextMenu } from "../../helpers";
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

  onMount(() => {
    bind(tableHTMLElement);
  });

  afterUpdate(() => {
    bind(tableHTMLElement);
  });

  export const hovered = writable(null);
  export const focused = writable([]);
  export const dragover = writable(null);
  export const rows = writable(0);
  export let type = null;
  export let title = "";
  export let addListItemMenu = () => [];
  export let config = { dragDrop: true };

  async function deleteAllFocused() {
    let focusedIds = $focused.map(
      (index) =>
        tableHTMLElement.querySelector(`[data-index='${index}']`).dataset
          .entityId
    );
    $entity.deleteEmbeddedEntity("OwnedItem", focusedIds);
  }

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
    dragover,
    focused,
    type,
  });
</script>

<style>
  table {
    white-space: nowrap;
    text-align: center;
    margin-top: 0px;
  }
  table > thead :global(th) {
    padding: 0px 5px 0px 5px;
  }
  table caption {
    background: rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    color: white;
  }
  .flex {
    display: flex;
  }
  .toolbar {
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    padding: 3px;
    color: white;
  }
  .toolbar > :global(.tool) {
    color: white;
    background-color: black;
    padding: 5px;
  }
  .toolbar > :global(.tool):hover {
  }
</style>

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
    if (e.key === 'Delete') {
      deleteAllFocused();
    }
  }} />

<slot name="button" />

<!-- <div class="flex toolbar">
  <slot name="tool" />
</div> -->

<table
  bind:this={tableHTMLElement}
  on:drop={(e) => {}}
  on:dragleave={() => dragover.set(null)}>
  <caption>{title}</caption>
  <slot name="colgroups" />
  <thead>
    <tr>
      <th>
        <!-- <i
          class="fas fa-cogs"
          on:click={(e) => {
            dispatch('settingchange');
          }} /> -->
      </th>
      <slot name="header" />
      <th>
        <i
          class="fas fa-plus-square"
          style="margin-left: auto;"
          use:createContextMenu={{ menuItems: addListItemMenu, event: 'click' }}
          on:click={(e) => {
            dispatch('addlistitem');
          }} />
      </th>
    </tr>
  </thead>
  <slot />
  <tfoot>
    <slot name="footer" />
  </tfoot>
</table>
