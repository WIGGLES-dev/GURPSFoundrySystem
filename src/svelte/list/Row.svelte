<script>
  import { ROWS } from "./List.svelte";
  import { createContextMenu, indexSort } from "../../helpers";
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
  const { setFocused, hovered, focused, dragover, type } = getContext(ROWS);

  export let entity = getContext("entity") || null;

  export let colspan;

  export let container = null;
  // export let i = null;
  export let depth = 0;
  export let id = null;

  export let hideNotes = true;
  export let disabled = false;

  export let config = {};

  const defaultConfig = {
    draggable: false,
    highlightHover: true,
    deleteButton: true,
    toggle: false,
    focusable: true,
  };

  $: config = Object.assign({}, defaultConfig, config);

  export let children = [];

  const getItem = (entity) => {
    return entity.getOwnedItem ? entity.getOwnedItem(id) || entity : entity;
  };

  $: itemIsOpen = (id) => {
    let ownedItem = $entity.getOwnedItem(id);
    if (!ownedItem) return true;
    return !ownedItem.getFlag("GURPS", "container_closed");
  };

  $: isRowLabel = getItem($entity, id)
    ? getItem($entity).getFlag("GURPS", "is_label") || false
    : false;

  $: colors = {
    textColor: getItem($entity, id)
      ? getItem($entity, id).getFlag("GURPS", "text_color") || ""
      : "",
    backgroundColor: getItem($entity, id)
      ? getItem($entity, id).getFlag("GURPS", "background_color") || ""
      : "",
  };

  export let menuItems = getItem($entity, id)
    ? getItem($entity, id).getMenuItems
      ? getItem($entity, id).getMenuItems()
      : () => []
    : () => [];

  export let selector = "contextmenu";

  $: GURPS = getItem($entity, id).getGURPSObject
    ? getItem($entity, id).getGURPSObject()
    : {};

  let rowHTMLElement;
  $: i = getItem($entity, id).getFlag("GURPS", "index");
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
  .dragover {
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
  class:container
  class:focused={$focused.includes(i) && config.focusable}
  class:dragover={$dragover === i}
  class:hovered={$hovered === i && config.highlightHover}
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
    dragover.set(i);
    dispatch('dragover');
  }}
  on:dragend={(e) => {
    dragover.set(null);
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
  <slot
    item={GURPS}
    open={itemIsOpen(id)}
    {depth}
    {id}
    ownedItem={getItem($entity, id)}
    hovered={$hovered === i} />
  <td class="show-when-label">
    {#if config.deleteButton}
      {#if container}
        <!-- <i class="fas fa-box" /> -->
      {/if}
      <i
        class:no-show={!($hovered === i && $dragover !== i)}
        class="fas fa-trash"
        on:click={() => {
          dispatch('delete', { entity: getItem($entity, id) });
        }} />
    {/if}
  </td>
</tr>

{#if !hideNotes}
  <td class="notes" {colspan}>
    <slot name="notes" {GURPS} {id} />
  </td>
{/if}

{#if container && itemIsOpen(id)}
  {#each game.gurps4e.indexSort(children) as child, i (child.foundryID)}
    <svelte:self
      let:id
      let:ownedItem
      let:depth
      let:open
      let:item={child}
      {entity}
      id={child.foundryID}
      i={i + 1}
      {config}
      {colspan}
      container={child.canContainChildren}
      children={Array.from(child.children)}
      open={itemIsOpen(id)}>
      <slot
        open={itemIsOpen(id)}
        item={child}
        depth={depth + 1}
        id={child.foundryID}
        ownedItem={$entity.getOwnedItem(child.foundryID)} />
    </svelte:self>
  {/each}
{/if}
