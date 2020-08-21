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
  import Totals from "./Totals";
  import Armor from "./Armor";

  import Input from "./form/Input.svelte";
  import FilePicker from "./form/FilePicker.svelte";

  export let entity = null;
  const GURPS = $entity._GURPS;

  setContext("GURPS", GURPS);
  setContext("entity", entity);

  $: totals = $GURPS.pointTotals();
</script>

<style>
  .flex {
    display: flex;
  }

  .attributes {
  }

  .column {
    display: flex;
    flex-direction: column;
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
    <div class="attributes flex">
      <div class="column">
        <Input
          config={{ width: '50px' }}
          on:update={() => $entity.setPools()}
          path="data.attributes.strength"
          min="0"
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('ST').pointsSpent()}] ST:
          </span>
        </Input>
        <Input
          config={{ width: '50px' }}
          path="data.attributes.dexterity"
          min="0"
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('DX').pointsSpent()}] DX:
          </span>
        </Input>
        <Input
          config={{ width: '50px' }}
          path="data.attributes.intelligence"
          min="0"
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('IQ').pointsSpent()}] IQ
          </span>
        </Input>
        <Input
          config={{ width: '50px' }}
          on:update={() => $entity.setPools()}
          path="data.attributes.health"
          min="0"
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('HT').pointsSpent()}] HT:
          </span>
        </Input>
      </div>
      <div class="column">
        <Input
          config={{ width: '50px' }}
          let:value
          path="data.attributes.will"
          min={-$entity.getProperty('data.attributes.intelligence')}
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('Will').pointsSpent()}] Will: {$entity.getProperty('data.attributes.intelligence')}
            +
          </span>
        </Input>
        <Input
          config={{ width: '50px' }}
          path="data.attributes.perception"
          min={-$entity.getProperty('data.attributes.intelligence')}
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('Per').pointsSpent()}] Per: {$entity.getProperty('data.attributes.intelligence')}
            +
          </span>
        </Input>

        <div class="flex">
          <Input
            config={{ width: '50px' }}
            on:update={() => $entity.setPools()}
            path="data.attributes.hit_points"
            min={-$entity.getProperty('data.attributes.strength')}
            type="number">
            <span slot="label-text">
              [{$GURPS.getAttribute('HP').pointsSpent()}] HP: {$entity.getProperty('data.attributes.strength')}
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
            min={-$entity.getProperty('data.attributes.health')}
            type="number">
            <span slot="label-text">
              [{$GURPS.getAttribute('FP').pointsSpent()}] FP: {$entity.getProperty('data.attributes.health')}
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
      </div>
      <Totals />
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
    <Armor />
    <Encumbrance />
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
