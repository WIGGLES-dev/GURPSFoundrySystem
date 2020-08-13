<script>
  import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";
  import SuccessRollRenderer from "gurps-foundry-roll-lib/src/js/Renderer/SuccessRollRenderer";

  import { setContext } from "svelte";

  import { List, Row } from "../list/list";

  import SkillList from "../SkillList.svelte";
  import TraitList from "../TraitList.svelte";
  import EquipmentList from "../EquipmentList.svelte";

  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";

  import Input from "../form/Input";
  import { Select, Option } from "../form/select/select";
  import Checkbox from "../form/Checkbox";
  import Textarea from "../form/Textarea";
  import RichTextEditor from "../form/RichTextEditor";
  import FilePicker from "../form/FilePicker.svelte";

  export let entity = null;
  const GURPS = $entity._GURPS;

  setContext("GURPS", GURPS);
  setContext("entity", entity);
</script>

<style>
  .flex {
    display: flex;
  }
  .to-bottom {
    margin: auto;
  }
  .statgrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: auto;
  }
  .stat {
  }
  .box {
    border: 2px solid grey;
    padding: 7px;
  }
  .box-title {
    display: flex;
  }
  .box-title > .grow {
    flex: 1;
  }
  .box-tools {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .box-tool {
    float: left;
    display: block;
    color: white;
    text-align: center;
  }
  .tool-ico:hover {
    box-shadow: 0 0 8px red;
  }
  .portrait-by-bio {
    display: flex;
  }
  .padding {
    width: 20px;
  }
</style>

<Input {entity} path="name" config={{ clickToEdit: true }} let:value>
  <h2 slot="no-edit">{value}</h2>
</Input>

<div class="portrait-by-bio">
  <FilePicker height="100px" type="image" />
  <div class="padding">&ThinSpace;</div>
  <RichTextEditor {entity} path="data.bio" />
</div>

<div class="statgrid">
  <div class="stat">
    <Input type="number" min="0" label="ST" path="data.attributes.strength" />
  </div>
  <div class="stat">
    <div class="flex">
      <Input
        config={{ width: '50px' }}
        type="number"
        min="0"
        label="HP"
        path="data.pools.hit_points.value" />
      <Input
        config={{ width: '50px' }}
        width="50px"
        type="number"
        min="0"
        path="data.pools.hit_points.max" />
    </div>
  </div>
  <div class="stat">
    <Input
      type="number"
      min="0"
      label="Speed"
      step="0.25"
      path="data.attributes.speed" />
  </div>
  <div class="stat">
    <Input type="number" min="0" label="DX" path="data.attributes.dexterity" />
  </div>
  <div class="stat">
    <Input
      {entity}
      type="number"
      min="0"
      label="Will"
      path="data.attributes.will" />
  </div>
  <div class="stat">
    <Input
      {entity}
      type="number"
      min="0"
      label="Move"
      path="data.attributes.move" />
  </div>
  <div class="stat">
    <Input
      {entity}
      type="number"
      min="0"
      label="IQ"
      path="data.attributes.intelligence" />
  </div>
  <div class="stat">
    <Input
      {entity}
      type="number"
      min="0"
      label="Per"
      path="data.attributes.perception" />
  </div>
  <div class="stat" />
  <div class="stat">
    <Input
      {entity}
      type="number"
      min="0"
      label="HT"
      path="data.attributes.health" />
  </div>
  <div class="stat">
    <span class="flex">
      <Input
        config={{ width: '50px' }}
        type="number"
        min="0"
        label="FP"
        path="data.pools.fatigue_points.value" />
      <Input
        config={{ width: '50px' }}
        type="number"
        min="0"
        path="data.pools.fatigue_points.max" />
    </span>
  </div>
  <div class="stat">
    <Input
      {entity}
      type="number"
      min="0"
      label="SM"
      path="data.size_modiifer" />
  </div>
  <div class="stat">Dodge</div>
  <div class="stat">Parry</div>
  <div class="stat">
    <Input type="number" min="0" label="DR" path="data.damage_resistance" />
  </div>
</div>

<Tabs tabIndex={0}>
  <TabList>
    <Tab index={0}>Attacks</Tab>
    <Tab index={1}>Traits</Tab>
    <Tab index={2}>Skills</Tab>
    <Tab index={3}>Items</Tab>
  </TabList>
  <TabPanel>
    <div>
      <button
        type="button"
        on:click={() => {
          $entity.createOwnedItem({ name: '???', type: 'melee attack' });
        }}>
        Add An Attack
      </button>
      {#each $entity.getWildWeapons() as attack, i (attack.id)}
        <div class="box">
          <div class="box-title">
            <div class="grow">
              <Input
                entity={attack._entity}
                path="name"
                alsoUpdate={['data.name']}
                config={{ clickToEdit: true }}
                let:value>
                <h2 slot="no-edit">{value}</h2>
              </Input>
            </div>
            <i class="fas fa-trash" on:click={attack.delete()} />
          </div>
          <RichTextEditor
            entity={attack._entity}
            path="data.user_description" />
          <ul class="box-tools">
            <li class="box-tool">
              <!-- svelte-ignore missing-declaration -->
              <img
                on:click={(e) => {
                  let roll = new SuccessRoll({
                    level: attack.getData('data.roll_against'),
                    trait: attack.getData('name'),
                    modifiers: prompt('Modifiers'),
                  });
                  roll.roll();
                  let renderer = new SuccessRollRenderer();
                  renderer.render(roll).then((html) => {
                    ChatMessage.create({
                      content: html,
                      user: game.user.i_id,
                      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                    });
                  });
                }}
                class="tool-ico"
                src="systems/GURPS/icons/attack-icon-png-3.png"
                alt="attack"
                height="21px" />
            </li>
          </ul>
          <Input
            entity={attack._entity}
            path="data.roll_against"
            type="number"
            label="Attack Target" />
        </div>
      {/each}
    </div>
  </TabPanel>
  <TabPanel>
    <div class="traits">
      <TraitList />
    </div>
  </TabPanel>
  <TabPanel>
    <div class="skills">
      <SkillList />
    </div>
  </TabPanel>
  <TabPanel>
    <div class="items">
      <EquipmentList />
    </div>
  </TabPanel>
</Tabs>

<div class="to-bottom">
  <Input path="data.class" let:value label="Class" />

  <div class="notes">
    <RichTextEditor {entity} path="data.notes" />
  </div>
</div>
