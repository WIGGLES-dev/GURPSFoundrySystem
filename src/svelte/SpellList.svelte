<script>
  import { List, Row } from "./list/list.ts";
  import { getContext } from "svelte";
  import { Input } from "./form/form";

  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  $: spellBonus = $entity.getProperty("data.bonuses.spell_bonus");
</script>

<style>
  th {
    padding: 0px 5px 0px 5px;
  }
  .spell-tools {
    display: flex;
  }
</style>

<div class="spell-tools">
  <Input
    path={'data.bonuses.spell_bonus'}
    type="number"
    {entity}
    label="Spell Bonus" />
  <Input
    path={'data.penalties.spells_on'}
    type="number"
    {entity}
    label="Spells On" />
  <Input
    type="number"
    path={'data.penalties.concetration_spells'}
    {entity}
    label="Concentration Penalty" />
</div>

<List
  type="spell"
  buttonLabel="Add Spell"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'spell' });
  }}>
  <thead name="header">
    <tr>
      <td />
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
      <th />
    </tr>
  </thead>
  {#each window.game.gurps4e.indexSort($GURPS.spellList.iter()) as spell, i (spell.foundryID)}
    <Row
      let:hovered
      {i}
      draggable={true}
      id={spell.foundryID}
      on:delete={(e) => {
        $entity.getOwnedItem(e.detail.id).delete();
      }}>
      <td style="width: 100%;">
        {#if hovered}
          <span
            class="fas fa-dice d6 roll-ico"
            on:click={$entity.rollSkill(spell, spellBonus)} />
        {/if}
        {spell.name}
      </td>
      <td />
      <td>{spell.spellClass}</td>
      <td>{spell.castingCost}</td>
      <td>{spell.maintenanceCost}</td>
      <td>{spell.castingTime}</td>
      <td>{spell.duration}</td>
      <td>{spell.calculateLevel() + spellBonus}</td>
      <td />
      <td>{spell.points}</td>
      <td>{spell.reference}</td>
    </Row>
  {/each}
</List>
