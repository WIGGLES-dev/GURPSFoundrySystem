<script>
  import { Character } from "../sheet";
  import { setContext } from "svelte";
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/tabs";

  import EquipmentList from "./EquipmentList";
  import TraitList from "./TraitList";
  import SkillList from "./SkillList";
  import SpellList from "./SpellList";
  import WeaponList from "./WeaponList";
  import Encumbrance from "./Encumbrance";

  import Input from "./form/Input.svelte";
  import FilePicker from "./form/FilePicker.svelte";

  export let entity = null;
  const GURPS = $entity._GURPS;

  setContext("GURPS", GURPS);
  setContext("entity", entity);

  $: totals = $GURPS.pointTotals();

  function loadCharacter(e) {
    let file = e.target;
    file.files[0].text().then((value) => {
      $entity.GURPS.load(JSON.parse(value), "GCSJSON");
    });
  }
</script>

<style>
  .flex {
    display: flex;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .point-total {
    display: flex;
  }

  .point-total .numbers {
    padding-right: 5px;
  }
</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>General</Tab>
    <Tab index={1}>Traits</Tab>
    <Tab index={2}>Bio/Misc</Tab>
    <Tab index={3}>Skills</Tab>
    <Tab index={4}>Combat</Tab>
    <Tab index={5}>Inventory</Tab>
    <Tab index={6}>Grimoire</Tab>
  </TabList>
  <TabPanel>
    <h1>General</h1>
    <!-- <button type="button" on:click={() => $entity.sheet.customPopout()}>
      Popout
    </button> -->
    <Input
      config={{ width: '50px' }}
      on:update={() => $entity.setPools()}
      path="data.attributes.strength"
      min="0"
      type="number"
      label="ST" />
    <Input
      config={{ width: '50px' }}
      path="data.attributes.dexterity"
      min="0"
      type="number"
      label="DX" />
    <Input
      config={{ width: '50px' }}
      path="data.attributes.intelligence"
      min="0"
      type="number"
      label="IQ" />
    <Input
      config={{ width: '50px' }}
      on:update={() => $entity.setPools()}
      path="data.attributes.health"
      min="0"
      type="number"
      label="HT" />
    <Input
      config={{ width: '50px' }}
      let:value
      path="data.attributes.will"
      min={-$entity.getData('data.attributes.intelligence')}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('Will').pointsSpent()}] Will: {$entity.getData('data.attributes.intelligence')}
        +
      </span>
    </Input>
    <Input
      config={{ width: '50px' }}
      path="data.attributes.perception"
      min={-$entity.getData('data.attributes.intelligence')}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('Per').pointsSpent()}] Per: {$entity.getData('data.attributes.intelligence')}
        +
      </span>
    </Input>

    <div class="flex">
      <Input
        config={{ width: '50px' }}
        on:update={() => $entity.setPools()}
        path="data.attributes.hit_points"
        min={-$entity.getData('data.attributes.strength')}
        type="number">
        <span slot="label-text">
          [{$GURPS.getAttribute('HP').pointsSpent()}] HP: {$entity.getData('data.attributes.strength')}
          +
        </span>
      </Input>
      <Input
        config={{ width: '50px' }}
        path="data.pools.hit_points.value"
        label="Current HP"
        min={-$GURPS.getAttribute('HP') * 10}
        type="number" />
    </div>

    <div class="flex">
      <Input
        config={{ width: '50px' }}
        on:update={() => $entity.setPools()}
        path="data.attributes.fatigue_points"
        min={-$entity.getData('data.attributes.health')}
        type="number">
        <span slot="label-text">
          [{$GURPS.getAttribute('FP').pointsSpent()}] FP: {$entity.getData('data.attributes.health')}
          +
        </span>
      </Input>
      <Input
        config={{ width: '50px' }}
        path="data.pools.fatigue_points.value"
        label="Current FP"
        min={-$GURPS.getAttribute('HP') * 10}
        type="number" />
    </div>

    <div class="point-total">
      <div class="numbers column">
        <div class="total">{totals.racialPoints}</div>
        <div class="total">{totals.attributePoints}</div>
        <div class="total">{totals.advantages}</div>
        <div class="total">{totals.disadvantages}</div>
        <div class="total">{totals.quirks}</div>
        <div class="totals">{totals.skills}</div>
        <div class="totals">{totals.spells}</div>
      </div>
      <div class="labels column">
        <div>Race</div>
        <div>Attributes</div>
        <div>Advantages</div>
        <div>Disadvantages</div>
        <div>Quirks</div>
        <div>Skills</div>
        <div>Spells</div>
      </div>
    </div>
    <div style="max-width: 50%;">
      <Encumbrance />
    </div>
  </TabPanel>
  <TabPanel>
    <h1>Traits</h1>
    <TraitList />
  </TabPanel>
  <TabPanel>
    <h1>Bio/Misc</h1>
    <Input {entity} type="text" path="name" label="Name" />
    <FilePicker type="image" />
  </TabPanel>
  <TabPanel>
    <h1>Skills</h1>
    <SkillList />
  </TabPanel>
  <TabPanel>
    <h1>Combat</h1>
    <WeaponList />
  </TabPanel>
  <TabPanel>
    <h1>Inventory</h1>
    <EquipmentList />
  </TabPanel>
  <TabPanel>
    <h1>Grimoire</h1>
    <SpellList />
  </TabPanel>
</Tabs>
