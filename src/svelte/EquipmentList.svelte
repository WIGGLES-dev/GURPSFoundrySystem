<script>
  import { getContext, onMount } from "svelte";
  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;
  export let location = "carried";

  import Input from "./form/Input";
  import { fixed6 } from "../helpers.ts";
  import { fixIndexes } from "../container.ts";
  import { List, Row } from "./list/list";

  onMount(() => {
    fixIndexes($entity, ["item"]);
  });

  async function toggleItemOpen(id) {
    let ownedItem = $entity.getOwnedItem(id);
    if (ownedItem) {
      ownedItem.setFlag(
        "GURPS",
        "container_closed",
        !ownedItem.getFlag("GURPS", "container_closed")
      );
    }
  }

  const menuItems = () => [
    {
      name: "Add Item",
      icon: "",
      condition: () => true,
      callback: async () => {
        let update = await $entity.createOwnedItem({
          name: "???",
          type: "item",
        });
        $entity.getOwnedItem(update._id).update({ "data.location": location });
      },
    },
    {
      name: "Add Container",
      icon: "",
      condition: () => true,
      callback: async () => {
        let update = await $entity.createOwnedItem({
          name: "???",
          type: "item",
          data: {
            type: "equipment_container",
          },
        });
        $entity.getOwnedItem(update._id).update({ "data.location": location });
      },
    },
  ];
</script>

<style>
  th {
    padding: 0 5px 0 5px;
  }
  .no-show {
    /* color: transparent; */
    visibility: hidden;
  }
  .main-list-col {
    text-align: left;
  }
  .container-toggle {
    position: relative;
  }
  .toggle {
    position: absolute;
  }
</style>

{#if location === 'carried'}
  <h3>
    Total Inventory Weight: <b> {fixed6($GURPS.equipmentList.totalWeight())} lb /
      {fixed6($GURPS.equipmentList.totalWeight({ carriedOnly: false }))} lb </b>
  </h3>
  <h3>
    Total Inventory Value: <b> ${fixed6($GURPS.equipmentList.totalValue())} / ${fixed6($GURPS.equipmentList.totalValue({ carriedOnly: false }))} </b>
  </h3>
{/if}
<List title="{location} Items" type="item" addListItemMenu={menuItems}>
  <th slot="header">E</th>
  <th slot="header">Qty</th>
  <th
    slot="header"
    on:dblclick={(e) => {
      $entity.sortList('item', 'data.description');
    }}>
    Description <i class="fas fa-sort" />
  </th>
  <th slot="header">Uses</th>
  <th slot="header">$</th>
  <th slot="header">Weight</th>
  <th slot="header">Total Weight</th>
  <th slot="header">Total $</th>
  <th slot="header">Ref</th>
  {#each window.game.gurps4e.indexSort(location === 'other' ? $GURPS.otherEquipmentList.iterTop() : $GURPS.equipmentList.iterTop()) as equipment, i (equipment.foundryID)}
    <Row
      let:item
      let:depth
      let:id
      let:ownedItem
      let:hovered
      let:open
      id={equipment.foundryID}
      on:delete={async (e) => {
        await e.detail.entity.delete();
      }}
      {i}
      draggable={true}
      colspan={10}
      children={Array.from(equipment.children)}
      container={equipment.canContainChildren}>
      <td
        on:dblclick={(e) => {
          $entity
            .getOwnedItem(id)
            .update({ 'data.equipped': !Boolean(item.equipped) });
        }}>
        {#if item.equipped}<i class="fas fa-check" />{/if}
      </td>
      <td>
        <Input
          entity={ownedItem._entity}
          config={{ clickToEdit: true }}
          path="data.quantity"
          type="number"
          min="0"
          let:value>
          <span class="no-edit" slot="no-edit">{value}</span>
        </Input>
      </td>
      <td
        class="main-list-col container-toggle"
        style="padding-left:{depth * 30 + 30}px">
        <span
          style="left:{15 + depth * 30}px;"
          on:click={() => toggleItemOpen(id)}
          class="toggle fas"
          class:fa-angle-down={open && item.canContainChildren}
          class:fa-angle-right={!open && item.canContainChildren} />
        <Input
          entity={ownedItem._entity}
          config={{ clickToEdit: true }}
          path="data.description"
          let:value>
          <span class="no-edit" slot="no-edit">{value}</span>
        </Input>
      </td>
      <td />
      <td>{fixed6(item.value)}</td>
      <td>{fixed6(item.weight)}</td>
      <td>{fixed6(item.extendedWeight())}</td>
      <td>{fixed6(item.extendedValue())}</td>
      <td>{item.reference}</td>
    </Row>
  {/each}
</List>
