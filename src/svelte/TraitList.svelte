<script>
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  import Input from "./form/Input";
  import { List, Row } from "./list/list.ts";
  import { Trait } from "g4elogic";

  let list;

  const createContextMenu = $entity.constructor.createContextMenu;
</script>

<style>
  th {
    padding: 0px 5px 0px 5px;
  }
</style>

<List type="trait" bind:this={list}>
  <button
    on:click={() => $entity.createOwnedItem({ name: '???', type: 'trait' })}
    type="button"
    slot="button">
    Add Trait
  </button>
  <thead slot="header">
    <tr>
      <th />
      <th
        on:dblclick={(e) => {
          $entity.sortList('trait', 'data.name');
        }}>
        Advantages & Disadvantages
        <i class="fas fa-sort" />
      </th>
      <th>Pts</th>
      <th>Ref</th>
      <th />
    </tr>
  </thead>
  {#each window.game.gurps4e.indexSort($GURPS.traitList.iter()) as trait, i (trait.foundryID)}
    <Row
      disabled={trait.disabled}
      colspan="5"
      let:ownedItem
      {i}
      id={trait.foundryID}
      draggable={true}
      on:delete={(e) => {
        $entity.getOwnedItem(trait.foundryID).delete();
      }}>
      <td>
        <Input
          config={{ clickToEdit: true }}
          entity={ownedItem._entity}
          path="data.name"
          alsoUpdate={['name']}
          let:value>
          <span slot="no-edit">
            {trait.name} {trait.hasLevels ? trait.levels : ''}
          </span>
        </Input>
      </td>
      <td>{trait.adjustedPoints()}</td>
      <td>
        <Input
          config={{ clickToEdit: true }}
          entity={ownedItem._entity}
          path="data.reference"
          let:value>
          <span slot="no-edit">{value}</span>
        </Input>
      </td>
      <div slot="notes">{trait.notes}</div>
    </Row>
  {/each}
</List>
