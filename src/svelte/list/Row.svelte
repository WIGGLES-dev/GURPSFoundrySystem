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

  const getItem = (id) => {
    return $entity.getOwnedItem ? $entity.getOwnedItem(id) || $entity : $entity;
  };

  $: isRowLabel = getItem(id)
    ? getItem(id).getFlag("GURPS", "is_label") || false
    : false;

  $: colors = {
    textColor: getItem(id)
      ? getItem(id).getFlag("GURPS", "text_color") || ""
      : "",
    backgroundColor: getItem(id)
      ? getItem(id).getFlag("GURPS", "background_color") || ""
      : "",
  };

  let menuItems = getItem(id)
    ? getItem(id).getMenuItems
      ? getItem(id).getMenuItems()
      : () => []
    : () => [];

  export let selector = "contextmenu";

  let GURPS = {};

  // $: GURPS = ($entity.getOwnedItem(id) || $entity).getGURPSObject();

  let rowHTMLElement;
</script>

<style>
  .hovered,
  tr:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
  .notes {
    padding: 0px;
  }
  .container {
    color: black;
    background-color: white;
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
  <slot depth={0} {id} ownedItem={getItem(id)} hovered={$hovered === i} />
  <td class="show-when-label">
    <i
      class:no-show={!($hovered === i && config.deleteButton)}
      class="fas fa-trash"
      on:click={() => {
        getItem(id).delete();
      }} />
  </td>
</tr>

{#if !hideNotes}
  <td class="notes" {colspan}>
    <slot name="notes" {GURPS} {id} />
  </td>
{/if}

{#if container}
  {#each children as child, i (child.foundryID)}
    <svelte:self
      i={i + 1}
      id={child.foundryID}
      {entity}
      {config}
      {menuItems}
      {colspan}
      children={Array.from(child.children)}
      container={child.canContainChildren}>
      <slot
        depth={child.getListDepth()}
        id={child.foundryID}
        ownedItem={getItem(child.foundryID)}
        hovered={$hovered === i} />
      <slot name="notes" {GURPS} {id} />
    </svelte:self>
  {/each}
{/if}
