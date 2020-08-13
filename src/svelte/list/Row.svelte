<script>
  import { ROWS } from "./List.svelte";
  import { createContextMenu } from "../../helpers";
  import { get_current_component } from "svelte/internal";
  import { slide, fade } from "svelte/transition";

  import {
    getContext,
    setContext,
    onDestroy,
    onMount,
    createEventDispatcher,
  } from "svelte";

  const dispatch = createEventDispatcher();
  const {
    registerRow,
    setDragover,
    setFocused,
    hovered,
    rows,
    type,
  } = getContext(ROWS);

  export let entity = getContext("entity");

  export let colspan;
  export let row;
  export let draggable = null;

  export let container = null;
  export let i = null;
  export let id = null;

  export let hideNotes = true;

  export let menuItems = (() => {
    if ($entity && $entity.entity === "Actor" && id) {
      return $entity.getOwnedItem(id).getMenuItems();
    } else if ($entity && $entity.entity === "Item") {
      return $entity.getMenuItems();
    } else {
      return () => [];
    }
  })();

  export let selector = "contextmenu";

  const self = get_current_component();

  onMount(() => {
    registerRow(self);
  });
</script>

<style>
  .drop-top {
    border-top: 1px solid red;
  }
  .drop-bottom {
    border-bottom: 1px solid red;
  }
  .hovered {
    border: 1px solid red;
  }
  .notes {
    min-height: 50px;
    text-align: left;
    border: 1px solid black;
  }
  .container {
    color: rgb(240, 240, 224);
    background-color: black;
  }
</style>

<tr
  data-container={container}
  data-index={i}
  data-entity-id={id}
  data-listtype={type}
  data-contextmenu={selector}
  use:createContextMenu={{ menuItems, selector }}
  class:hovered={$hovered && $hovered.i === i}
  class:container
  bind:this={row}
  on:auxclick={(e) => {
    if (e.button === 1) {
      dispatch('middleclick');
    }
  }}
  on:dblclick={(e) => {
    dispatch('dblclick');
  }}
  on:drop={(e) => {
    hovered.set(null);
    dispatch('drop');
  }}
  on:dragstart={(e) => {
    dispatch('dragstart');
  }}
  on:dragenter={(e) => {
    dispatch('dragenter');
  }}
  on:dragleave={(e) => {
    dispatch('dragleave');
  }}
  on:dragover={(e) => {
    setDragover(e, i);
    dispatch('dragover');
  }}
  on:dragend={(e) => {
    hovered.set(null);
    dispatch('dragend');
  }}>
  <td
    on:click={(e) => {
      hideNotes = !hideNotes;
    }}>
    {hideNotes ? '>' : '∨'}
  </td>
  <slot />
  <td>
    <i class="fas fa-trash" on:click={$entity.getOwnedItem(id).delete()} />
  </td>
</tr>
{#if !hideNotes}
  <td class="notes" {colspan}>
    <slot name="notes" />
  </td>
{/if}
