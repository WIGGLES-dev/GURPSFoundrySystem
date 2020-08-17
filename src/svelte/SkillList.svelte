<script>
  import Input from "./form/Input";
  import { List, Row } from "./list/list.ts";
  import { getContext } from "svelte";

  const GURPS = getContext("GURPS");
  export let entity = getContext("entity") || null;
</script>

<style>
  th {
    padding: 0px 5px 0px 5px;
  }
  .skill-roll-ico:hover {
    box-shadow: 0 0 8px red;
  }
</style>

<List
  type="skill"
  buttonLabel="Add Skill"
  on:addlistitem={() => {
    $entity.createOwnedItem({ name: '???', type: 'skill' });
  }}>
  <thead name="header">
    <tr>
      <th />
      <th>Skills</th>
      <th>SL</th>
      <th>RSL</th>
      <th>Pts</th>
      <th>Ref</th>
      <th />
      <th />
    </tr>
  </thead>
  {#each window.game.gurps4e.indexSort($GURPS.skillList.iter()) as skill, i (skill.foundryID)}
    <Row
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
      <td style="width: 100%;">
        <Input
          entity={$entity.getOwnedItem(skill.foundryID)._entity}
          path="data.name"
          alsoUpdate={['name']}
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">{skill.toString()}</span>
        </Input>
      </td>
      <td>{skill.calculateLevel()}</td>
      <td />
      <td>
        <Input
          entity={$entity.getOwnedItem(skill.foundryID)._entity}
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
          entity={$entity.getOwnedItem(skill.foundryID)._entity}
          path="data.reference"
          config={{ clickToEdit: true }}
          let:value>
          <span slot="no-edit">{value}</span>
        </Input>
      </td>
      <td slot="row-after" style="min-width: 21px;">
        <img
          class="skill-roll-ico"
          on:click={(e) => {
            $entity.rollSkill(skill);
          }}
          src="systems/GURPS/icons/roll-ico.png"
          alt="roll"
          height="21px"
          width="auto" />
      </td>
      <div slot="notes">{skill.notes}</div>
    </Row>
  {/each}
</List>
