<script>
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  import Input from "./form/Input";
  import { List, Row } from "./list/list.ts";

  let list;

  const createContextMenu = $entity.constructor.createContextMenu;
</script>

<style>
  th {
    padding: 0px 5px 0px 5px;
  }
</style>

<List
  buttonLabel="Add Trait"
  type="trait"
  bind:this={list}
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'trait' });
  }}>
  <thead slot="header">
    <tr>
      <th />
      <th>Advantages & Disadvantages</th>
      <th>Pts</th>
      <th>Ref</th>
      <th />
    </tr>
  </thead>
  {#each window.game.gurps4e.indexSort($GURPS.traitList.iter()) as trait, i (trait.foundryID)}
    <Row
      disabled={trait.disabled}
      colspan="5"
      {i}
      id={trait.foundryID}
      draggable={true}
      on:delete={(e) => {
        $entity.getOwnedItem(e.detail.id).delete();
      }}>
      <td>
        <Input
          config={{ clickToEdit: true }}
          entity={$entity.getOwnedItem(trait.foundryID)._entity}
          path="data.name"
          alsoUpdate={['name']}
          let:value>
          <span slot="no-edit">{trait.toString()}</span>
        </Input>
      </td>
      <td>{trait.adjustedPoints()}</td>
      <td>
        <Input
          config={{ clickToEdit: true }}
          entity={$entity.getOwnedItem(trait.foundryID)._entity}
          path="data.reference"
          let:value>
          <span slot="no-edit">{value}</span>
        </Input>
      </td>
      <div slot="notes">{trait.notes}</div>
    </Row>
  {/each}
</List>
