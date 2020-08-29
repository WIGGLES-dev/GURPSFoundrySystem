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

<List
  title="Techniques"
  type="technique"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'technique' });
  }}>
  <th
    slot="header"
    on:dblclick={(e) => {
      $entity.sortList('technique', 'data.name');
    }}>
    Techniques
    <i class="fas fa-sort" />
  </th>
  <th slot="header">SL</th>
  <th slot="header">RSL</th>
  <th slot="header">Mod</th>
  <th slot="header">Pts</th>
  <th slot="header">Ref</th>
  {#each window.game.gurps4e.indexSort($GURPS.techniqueList.iter()) as technique, i (technique.foundryID)}
    <Row
      let:hovered
      let:ownedItem
      on:delete={(e) => {
        $entity.getOwnedItem(e.detail.id).delete();
      }}
      colspan="6"
      {i}
      draggable={true}
      id={technique.foundryID}
      on:middleclick={(e) => {
        $entity.rollSkill(technique);
      }}>
      <td class="main-list-col">
        <span
          class:no-show={!hovered || ownedItem.isLabel()}
          class="fas fa-dice d6 roll-ico"
          on:contextmenu|capture={(e) => {
            $entity.rollSkill({
              level: technique.calculateLevel(
                $entity.getSkillLevelForTechnique(ownedItem)
              ),
              trait: technique.name,
              modifiers: 'none',
            });
            e.stopImmediatePropagation();
            e.preventDefault();
          }}
          on:click={(e) => {
            $entity.rollSkill({
              level: technique.calculateLevel(
                $entity.getSkillLevelForTechnique(ownedItem)
              ),
              trait: technique.name,
            });
          }} />
        <Input
          entity={ownedItem._entity}
          path="data.name"
          alsoUpdate={['name']}
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">
            {technique.name}{technique.techLevel ? `/TL${technique.techLevel}` : ''}
            {technique.specialization ? `(${technique.specialization})` : ``}
          </span>
        </Input>
      </td>
      <td>
        {Math.floor(technique.calculateLevel($entity.getSkillLevelForTechnique(ownedItem)))}
      </td>
      <td>
        {technique.getRelativeLevel($entity.getSkillLevelForTechnique(ownedItem)) >= 0 ? '+' : ''}{technique.getRelativeLevel($entity.getSkillLevelForTechnique(ownedItem))}
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
      <div slot="notes">{technique.notes}</div>
    </Row>
  {/each}
</List>

<List
  title="Skills"
  type="skill"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'skill' });
  }}>
  <th
    slot="header"
    on:dblclick={(e) => {
      $entity.sortList('skill', 'data.name');
    }}>
    Skills
    <i class="fas fa-sort" />
  </th>
  <th slot="header">SL</th>
  <th slot="header">RSL</th>
  <th slot="header">Mod</th>
  <th slot="header">Pts</th>
  <th slot="header">Ref</th>
  {#each window.game.gurps4e.indexSort($GURPS.skillList.iter()) as skill, i (skill.foundryID)}
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
