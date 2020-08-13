<script>
  import { List, Row } from "./list/list.ts";
  import { getContext } from "svelte";

  const GURPS = getContext("GURPS");
  const entity = getContext("entity");
</script>

<style>
  th {
    padding: 0px 5px 0px 5px;
  }
</style>

<List
  type="spell"
  buttonLabel="Add Spell"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'spell' });
  }}>
  <thead name="header">
    <tr>
      <th>Spells</th>
      <th>Resist</th>
      <th>Class</th>
      <th>Cost</th>
      <th>Maintain</th>
      <th>Time</th>
      <th>Duration</th>
      <th>SL</th>
      <th>RSL</th>
      <th>Pts</th>
      <th>Ref</th>
    </tr>
  </thead>
  {#each $GURPS.spellList.iter() as spell, i (spell.foundryID)}
    <Row {i} draggable={true} id={spell.foundryID}>
      <td style="width: 100%;">{spell.name}</td>
      <td />
      <td>{spell.spellClass}</td>
      <td>{spell.castingCost}</td>
      <td>{spell.maintenanceCost}</td>
      <td>{spell.castingTime}</td>
      <td>{spell.duration}</td>
      <td>{spell.calculateLevel()}</td>
      <td />
      <td>{spell.points}</td>
      <td>{spell.reference}</td>
    </Row>
  {/each}
</List>
