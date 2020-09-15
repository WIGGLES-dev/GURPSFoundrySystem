<script>
  import { Row } from "../list/list";
  import { fixed6 } from "../../helpers.ts";
  export let item = null;
  console.log(item);
  import { writable } from "svelte/store";
  // $: itemIsOpen = $item.getFlag("ui", "open");
  let itemIsOpen;
</script>

<Row let:depth>
  <td>
    <span
      on:click={($item.equipped = !$item.equipped)}
      style="left:{15 + depth * 30}px;"
      class="toggle fas"
      class:fa-angle-down={itemIsOpen && $item.canContainChildren}
      class:fa-angle-right={!itemIsOpen && $item.canContainChildren} />
  </td>
  <td><input type="number" bind:value={$item.quantity} /></td>
  <td><input type="text" bind:value={$item.description} /></td>
  <td />
  <td><input type="number" bind:value={$item.weight} /></td>
  <td>{fixed6($item.extendedWeight())}</td>
  <td>{fixed6($item.extendedValue())}</td>
  <td>{$item.reference}</td>
</Row>
