<script>
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;

  import Input from "./form/Input";
  import { fixed6 } from "../helpers.ts";

  import { List, Row } from "./list/list";
  import { EquipmentList } from "g4elogic";
</script>

<style>
  th {
    padding: 0 5px 0 5px;
  }
  .no-show {
    /* color: transparent; */
    visibility: hidden;
  }
</style>

<h3>
  Total Inventory Weight:
  <b>
    {fixed6($GURPS.equipmentList.totalWeight())} lb / {fixed6($GURPS.equipmentList.totalWeight(
        { carriedOnly: false }
      ))} lb
  </b>
</h3>
<h3>
  Total Inventory Value:
  <b>
    ${fixed6($GURPS.equipmentList.totalValue())} / ${fixed6($GURPS.equipmentList.totalValue({ carriedOnly: false }))}
  </b>
</h3>

<List
  title="Items"
  type="item"
  on:addlistitem={(e) => {
    $entity.createOwnedItem({ name: '???', type: 'item' });
  }}>
  <th slot="header">E</th>
  <th slot="header">Qty</th>
  <th
    slot="header"
    on:dblclick={(e) => {
      $entity.sortList('trait', 'data.description');
    }}>
    Description
    <i class="fas fa-sort" />
  </th>
  <th slot="header">Uses</th>
  <th slot="header">$</th>
  <th slot="header">Weight</th>
  <th slot="header">Total Weight</th>
  <th slot="header">Total $</th>
  <th slot="header">Ref</th>
  {#each window.game.gurps4e.indexSort($GURPS.equipmentList.iterTop()) as item, i (item.foundryID)}
    <Row
      let:id
      let:ownedItem
      let:hovered
      id={item.foundryID}
      on:delete={async (e) => {
        console.log($entity);
        await $entity.getOwnedItem(e.detail.id).delete();
      }}
      {i}
      draggable={true}
      colspan={10}
      container={item.canContainChildren}>
      <td
        on:dblclick={(e) => {
          $entity
            .getOwnedItem(id)
            .update({ 'data.equipped': !Boolean(item.equipped) });
        }}>
        {#if item.equipped}
          <i class="fas fa-check" />
        {/if}
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
      <td class="main-list-col">
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
