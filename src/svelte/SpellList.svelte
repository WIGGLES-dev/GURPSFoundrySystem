<script>
  import { List, Row } from "./list/list.ts";
  import { getContext } from "svelte";
  import { Input } from "./form/form";

  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  $: spellBonus = $entity.getProperty("data.bonuses.spell_bonus");
  $: spellOnPenalty = $entity.getProperty("data.penalties.spells_on");
  $: spellConcentrationPenalty =
    $entity.getProperty("data.penalties.concentration_spells") * 3;

  const getRollMod = () =>
    spellBonus - spellOnPenalty - spellConcentrationPenalty;
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
    min="0"
    label="Spells On" />
  <Input
    type="number"
    path={'data.penalties.concentration_spells'}
    {entity}
    min="0"
    label="Spell Concentrating On" />
</div>

<List
  type="spell"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'spell' });
  }}>
  <th
    slot="header"
    on:dblclick={(e) => {
      $entity.sortList('spell', 'data.name');
    }}>
    Spells
    <i class="fas fa-sort" />
  </th>
  <th slot="header">Resist</th>
  <th slot="header">Class</th>
  <th slot="header">Cost</th>
  <th slot="header">Maintain</th>
  <th slot="header">Time</th>
  <th slot="header">Duration</th>
  <th slot="header">SL</th>
  <th slot="header">RSL</th>
  <th slot="header">Pts</th>
  <th slot="header">Ref</th>
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
              level: spell.calculateLevel() + getRollMod(),
              trait: spell.name,
              modifiers: 'none',
            });
            e.stopImmediatePropagation();
            e.preventDefault();
          }}
          on:click={(e) => {
            $entity.rollSkill({
              level: spell.calculateLevel() + getRollMod(),
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
