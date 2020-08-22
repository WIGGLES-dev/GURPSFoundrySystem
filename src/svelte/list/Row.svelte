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

  export let container = null;
  export let i = null;
  export let id = null;

  export let hideNotes = true;
  export let disabled = false;

  export let config = {
    draggable: false,
    highlightHover: true,
    deleteButton: true,
    toggle: false,
  };

  export let children = [];

  export let menuItems = (() => {
    let item = $entity.getOwnedItem(id) || $entity;
    return item && item.getMenuItems ? item.getMenuItems() : () => [];
  })();

  export let selector = "contextmenu";

  let GURPS = {};

  // $: GURPS = ($entity.getOwnedItem(id) || $entity).getGURPSObject();

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
    background-color: rgba(0, 0, 0, 0.25);
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
  .focus {
  }
</style>

<tr
  class:strikethrough={disabled}
  data-container={container}
  data-index={i}
  data-entity-id={id}
  data-listtype={type}
  data-contextmenu={selector}
  use:createContextMenu={{ menuItems, selector }}
  class:hovered={$hovered === i && config.highlightHover}
  class:container
  on:mouseover={(e) => {
    setDragover(e, i);
    dispatch('mouseover');
  }}
  on:mouseout={(e) => {
    dispatch('mouseout');
  }}
  on:mouseleave={(e) => {
    hovered.set(null);
    dispatch('mouseleave');
  }}
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
    hovered.set(null);
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
      if (!config.toggle) return;
      hideNotes = !hideNotes;
    }}>
    {#if config.toggle}{hideNotes ? '>' : '∨'}{/if}
  </td>
  <slot {GURPS} {id} hovered={$hovered === i} />
  <td>
    {#if config.deleteButton && $hovered === i}
      <i class="fas fa-trash" on:click={dispatch('delete', { id })} />
    {/if}
  </td>
  <slot name="row-after" {GURPS} {id} />
</tr>
{#if !hideNotes}
  <td class="notes" {colspan}>
    <slot name="notes" {GURPS} {id} />
  </td>
{/if}

<!-- {#each $entity.getOwnedItem(id).getChildren() as child, i (child.id)}
  <svelte:self {entity} {config} {menuItems} {colspan} {container}>
    <slot {GURPS} {id} />
    <slot name="row-after" {GURPS} {id} />
    <slot name="notes" {GURPS} {id} />
  </svelte:self>
{/each} -->
