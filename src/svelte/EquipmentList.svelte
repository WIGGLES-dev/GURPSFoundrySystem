<script>
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;

  import Input from "./form/Input";

  import { List, Row } from "./list/list.ts";
  import { create } from "domain";
</script>

<style>
  th {
    padding: 0 5px 0 5px;
  }
  .no-edit {
    height: 100%;
    float: left;
  }
</style>

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
  {#each $GURPS.equipmentList.iter() as item, i (item.foundryID)}
    <Row
      {i}
      draggable={true}
      id={item.foundryID}
      colspan={10}
      container={item.canContainChildren}>
      <td
        on:dblclick={(e) => {
          $entity
            .getOwnedItem(item.foundryID)
            .update({ 'data.equipped': !Boolean(item.equipped) });
        }}>
        {item.equipped ? 'yes' : 'no'}
      </td>
      <td>
        <Input
          entity={$entity.getOwnedItem(item.foundryID)._entity}
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
          entity={$entity.getOwnedItem(item.foundryID)._entity}
          config={{ clickToEdit: true }}
          path="data.description"
          let:value>
          <span class="no-edit" slot="no-edit">{value}</span>
        </Input>
      </td>
      <td />
      <td>{item.value}</td>
      <td>{item.weight}</td>
      <td>{item.extendedWeight()}</td>
      <td>{item.extendedValue()}</td>
      <td>{item.reference}</td>
    </Row>
  {/each}
</List>
