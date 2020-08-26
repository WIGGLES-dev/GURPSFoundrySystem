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

<List type="spell">
  <button
    type="button"
    slot="button"
    on:click={() => $entity.createOwnedItem({ name: '???', type: 'spell' })}>
    Add Spell
  </button>
  <thead name="header">
    <tr>
      <td />
      <th
        on:dblclick={(e) => {
          $entity.sortList('spell', 'data.name');
        }}>
        Spells
        <i class="fas fa-sort" />
      </th>
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
      let:ownedItem
      let:isLabel
      let:hovered
      {i}
      draggable={true}
      id={spell.foundryID}
      on:delete={(e) => {
        $entity.getOwnedItem(e.detail.id).delete();
      }}>
      <td class="main-list-col">
        <span
          class:no-show={!hovered || isLabel}
          class="fas fa-dice d6 roll-ico"
          on:contextmenu|capture={(e) => {
            $entity.rollSkill({
              level: spell.calculateLevel() + spellBonus,
              trait: spell.name,
              modifiers: 'none',
            });
            e.stopImmediatePropagation();
            e.preventDefault();
          }}
          on:click={(e) => {
            $entity.rollSkill({
              level: spell.calculateLevel() + spellBonus,
              trait: spell.name,
            });
          }} />
        <Input
          entity={ownedItem._entity}
          path="data.name"
          alsoUpdate={['name']}
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">
            {spell.name}{spell.techLevel ? `/TL${spell.techLevel}` : ''} {spell.specialization ? `(${spell.specialization})` : ``}
          </span>
        </Input>
      </td>
      <td />
      <td>{spell.spellClass}</td>
      <td>{spell.castingCost}</td>
      <td>{spell.maintenanceCost}</td>
      <td>{spell.castingTime}</td>
      <td>{spell.duration}</td>
      <td>{spell.calculateLevel() + spellBonus}</td>
      <td>
        {spell.signature}{spell.getRelativeLevel() + spellBonus >= 0 ? '+' : ''}{spell.getRelativeLevel() + spellBonus}
      </td>
      <td>{spell.points}</td>
      <td>{spell.reference}</td>
    </Row>
  {/each}
</List>
