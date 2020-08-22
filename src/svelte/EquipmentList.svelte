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
<!-- <button
  type="button"
  on:click={(e) => $entity.createOwnedItem({
      name: '???',
      type: 'item',
      data: { type: 'equipment_container' },
    })}>
  Add Container
</button> -->
<List
  type="item"
  buttonLabel="Add Item"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'item' });
  }}>
  <thead name="header">
    <tr>
      <th />
      <th>Equipped</th>
      <th>Qty</th>
      <th>Description</th>
      <th>Uses</th>
      <th>$</th>
      <th>Weight</th>
      <th>Total Weight</th>
      <th>Total $</th>
      <th>Ref</th>
      <th />
    </tr>
  </thead>
  {#each window.game.gurps4e.indexSort($GURPS.equipmentList.iterTop()) as item, i (item.foundryID)}
    <Row
      let:GURPS
      let:id
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
        {item.equipped ? 'yes' : 'no'}
      </td>
      <td>
        <Input
          entity={$entity.getOwnedItem(id)._entity}
          config={{ clickToEdit: true }}
          path="data.quantity"
          type="number"
          min="0"
          let:value>
          <span class="no-edit" slot="no-edit">{value}</span>
        </Input>
      </td>
      <td style="width: 100%; padding-left: {item.getListDepth() * 30}px">
        <Input
          entity={$entity.getOwnedItem(id)._entity}
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
