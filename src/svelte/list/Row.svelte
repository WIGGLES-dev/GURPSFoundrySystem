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
    tick,
  } from "svelte";

  const dispatch = createEventDispatcher();
  const { setFocused, hovered, focused, type } = getContext(ROWS);

  export let entity = getContext("entity") || null;

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
    focusable: true,
  };

  export let children = [];

  const getItem = (entity) => {
    return entity.getOwnedItem ? entity.getOwnedItem(id) : entity;
  };

  $: isRowLabel = getItem($entity)
    ? getItem($entity).getFlag("GURPS", "is_label") || false
    : false;

  $: colors = {
    textColor: getItem($entity)
      ? getItem($entity).getFlag("GURPS", "text_color") || ""
      : "",
    backgroundColor: getItem($entity)
      ? getItem($entity).getFlag("GURPS", "background_color") || ""
      : "",
  };

  export let menuItems = (() => {
    let item = getItem($entity);
    return item && item.getMenuItems ? item.getMenuItems() : () => [];
  })();

  export let selector = "contextmenu";

  let GURPS = {};

  // $: GURPS = ($entity.getOwnedItem(id) || $entity).getGURPSObject();

  let rowHTMLElement;
</script>

<style>
  .hovered {
    background-color: rgba(0, 0, 0, 0.25);
  }
  .notes {
    padding: 0px;
  }
  .container {
    color: rgb(240, 240, 224);
    background-color: black;
  }
  .focused {
    background-color: #ff6400;
  }
  tr > :global(td) {
    padding: 3px 0px 3px 0px;
    border-bottom: 1px solid black;
  }
</style>

<tr
  class:is-row-label={isRowLabel}
  bind:this={rowHTMLElement}
  style="background-color: {colors.backgroundColor}; color: {colors.textColor}"
  class:strikethrough={disabled}
  data-container={container}
  data-index={i}
  data-entity-id={id}
  data-listtype={type}
  data-contextmenu={selector}
  use:createContextMenu={{ menuItems, selector }}
  class:hovered={$hovered === i && config.highlightHover}
  class:focused={$focused.includes(i) && config.focusable}
  class:container
  on:mouseover={(e) => {
    dispatch('mouseover');
  }}
  on:mouseenter={(e) => {
    hovered.set(i);
    if (e.which == 1 && e.shiftKey && config.focusable) {
      setFocused(i);
    }
    dispatch('mouseenter');
  }}
  on:mousedown={(e) => {
    if (e.which == 1 && e.shiftKey && config.focusable) {
      setFocused(i, true, e.timestamp);
    } else if (e.which == 1 && e.shiftKey && config) {
      focused.set([i]);
    }
    dispatch('mousedown');
  }}
  on:click={(e) => {
    dispatch('click');
  }}
  on:mouseout={(e) => {
    dispatch('mouseout');
  }}
  on:mouseleave={(e) => {
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
    dispatch('dragleave');
  }}
  on:dragover={(e) => {
    hovered.set(i);
    dispatch('dragover');
  }}
  on:dragend={(e) => {
    hovered.set(null);
    dispatch('dragend');
  }}>
  <td
    on:dragenter={(e) => (hideNotes = false)}
    on:click={(e) => {
      if (!config.toggle) return;
      hideNotes = !hideNotes;
    }}>
    {#if config.toggle}{hideNotes ? '>' : '∨'}{/if}
  </td>
  <slot {id} ownedItem={getItem($entity)} hovered={$hovered === i} />
  <td class="show-when-label">
    <i
      class:no-show={!($hovered === i && config.deleteButton)}
      class="fas fa-trash"
      on:click={() => dispatch('delete', { id })} />
  </td>
</tr>

{#if !hideNotes}
  <td class="notes" {colspan}>
    <slot name="notes" {GURPS} {id} />
  </td>
{/if}

<!-- <tr>
  <slot name="row-after" {GURPS} {id} />
</tr> -->

<!-- {#each $entity.getOwnedItem(id).getChildren() as child, i (child.id)}
  <svelte:self {entity} {config} {menuItems} {colspan} {container}>
    <slot {GURPS} {id} />
    <slot name="row-after" {GURPS} {id} />
    <slot name="notes" {GURPS} {id} />
  </svelte:self>
{/each} -->
