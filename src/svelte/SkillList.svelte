<script>
  import Input from "./form/Input";
  import { List, Row } from "./list/list.ts";
  import { getContext } from "svelte";
  import { Skill } from "g4elogic";

  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;
</script>

<style>
  th {
    padding: 0px 5px 0px 5px;
  }
</style>

<List type="skill technique">
  <button
    type="button"
    slot="button"
    on:click={(e) => {
      $entity.createOwnedItem({ name: '???', type: 'technique' });
    }}>
    Add Technique
  </button>
  <button
    type="button"
    slot="button"
    on:click={() => $entity.createOwnedItem({ name: '???', type: 'skill' })}>
    Add Skill
  </button>
  <thead name="header">
    <tr>
      <th />
      <th
        on:dblclick={(e) => {
          $entity.sortList('skill', 'data.name');
        }}>
        Skills
        <i class="fas fa-sort" />
      </th>
      <th>SL</th>
      <th>RSL</th>
      <th>Mod</th>
      <th>Pts</th>
      <th>Ref</th>
      <th />
    </tr>
  </thead>
  {#each window.game.gurps4e.indexSort([].concat($GURPS.skillList.iter(), $GURPS.techniqueList.iter())) as skill, i (skill.foundryID)}
    <Row
      let:hovered
      let:ownedItem
      on:delete={(e) => {
        $entity.getOwnedItem(e.detail.id).delete();
      }}
      colspan="6"
      {i}
      draggable={true}
      id={skill.foundryID}
      on:middleclick={(e) => {
        $entity.rollSkill(skill);
      }}>
      <td class="main-list-col">
        <span
          class:no-show={!hovered || ownedItem.isLabel()}
          class="fas fa-dice d6 roll-ico"
          on:contextmenu|capture={(e) => {
            $entity.rollSkill({
              level: skill.calculateLevel(
                $entity.getSkillLevelForTechnique(ownedItem)
              ),
              trait: skill.name,
              modifiers: 'none',
            });
            e.stopImmediatePropagation();
            e.preventDefault();
          }}
          on:click={(e) => {
            $entity.rollSkill({
              level: skill.calculateLevel(
                $entity.getSkillLevelForTechnique(ownedItem)
              ),
              trait: skill.name,
            });
          }} />
        <Input
          entity={ownedItem._entity}
          path="data.name"
          alsoUpdate={['name']}
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">
            {skill.name}{skill.techLevel ? `/TL${skill.techLevel}` : ''} {skill.specialization ? `(${skill.specialization})` : ``}
          </span>
        </Input>
      </td>
      <td>
        {Math.floor(skill.calculateLevel($entity.getSkillLevelForTechnique(ownedItem)))}
      </td>
      <td>
        {!skill.isTechnique ? skill.signature : ''}{skill.getRelativeLevel($entity.getSkillLevelForTechnique(ownedItem)) >= 0 ? '+' : ''}{skill.getRelativeLevel($entity.getSkillLevelForTechnique(ownedItem))}
      </td>
      <td>
        <Input
          entity={ownedItem._entity}
          type="number"
          path="data.global_mod"
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">{value}</span>
        </Input>
      </td>
      <td>
        <Input
          entity={ownedItem._entity}
          type="number"
          min="0"
          path="data.points"
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">{value}</span>
        </Input>
      </td>
      <td>
        <Input
          entity={ownedItem._entity}
          path="data.reference"
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">{value}</span>
        </Input>
      </td>
      <div slot="notes">{skill.notes}</div>
    </Row>
  {/each}
</List>
