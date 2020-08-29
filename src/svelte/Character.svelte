<script>
  import { Character } from "../sheet";
  import { setContext } from "svelte";
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/tabs";

  import EquipmentList from "./EquipmentList";
  import TraitList from "./TraitList";
  import SkillList from "./SkillList";
  import SpellList from "./SpellList";
  import Encumbrance from "./Encumbrance";
  import Totals from "./Totals";
  import Armor from "./Armor";
  import Pools from "./Pools";
  import Biography from "./Biography";
  import CharacterCombat from "./CharacterCombat";

  import { RichTextEditor, Input, FilePicker } from "./form/form";

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

  .attributes :global(.GURPS-label input) {
    max-width: 50px;
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
    <Tab index={7}>
      <i class="fas fa-cogs" />
    </Tab>
  </TabList>
  <TabPanel>
    <div class="attributes flex">
      <div class="column">
        <Input path="data.attributes.strength" min="0" type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('ST').pointsSpent()}] ST:
          </span>
        </Input>
        <Input path="data.attributes.dexterity" min="0" type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('DX').pointsSpent()}] DX:
          </span>
        </Input>
        <Input path="data.attributes.intelligence" min="0" type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('IQ').pointsSpent()}] IQ:
          </span>
        </Input>
        <Input path="data.attributes.health" min="0" type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('HT').pointsSpent()}] HT:
          </span>
        </Input>
        <Input
          path="data.attributes.move"
          type="number"
          basedOn={$GURPS
            .getAttribute('Move')
            .calculateLevel() - $entity.getProperty('data.attributes.move')}>
          <span slot="label-text">
            [{$GURPS.getAttribute('Move').pointsSpent()}] Move:
          </span>
        </Input>
        <Input
          path="data.attributes.speed"
          step="0.25"
          min={0}
          basedOn={$GURPS
            .getAttribute('Speed')
            .calculateLevel() - $entity.getProperty('data.attributes.speed')}
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('Speed').pointsSpent()}] Speed:
          </span>
        </Input>
      </div>
      <div class="column">
        <Input
          let:value
          path="data.attributes.will"
          basedOn={$entity.getProperty('data.attributes.intelligence')}
          min={0}
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('Will').pointsSpent()}] Will:
          </span>
        </Input>
        <Input
          path="data.attributes.perception"
          min={0}
          basedOn={$entity.getProperty('data.attributes.intelligence')}
          type="number">
          <span slot="label-text">
            [{$GURPS.getAttribute('Per').pointsSpent()}] Per:
          </span>
        </Input>

        <div class="flex">
          <Input
            path="data.attributes.hit_points"
            min={0}
            basedOn={$entity.getProperty('data.attributes.strength')}
            type="number">
            <span slot="label-text">
              [{$GURPS.getAttribute('HP').pointsSpent()}] HP:
            </span>
          </Input>
        </div>

        <div class="flex">
          <Input
            path="data.attributes.fatigue_points"
            min={0}
            basedOn={$entity.getProperty('data.attributes.health')}
            type="number">
            <span slot="label-text">
              [{$GURPS.getAttribute('FP').pointsSpent()}] FP:
            </span>
          </Input>
        </div>
      </div>
      <Totals />
      <Pools />
    </div>

    <div style="max-width: 50%;">
      <Encumbrance />
    </div>
    <RichTextEditor path="data.notes" title="Notes" />
  </TabPanel>
  <TabPanel>
    <TraitList />
  </TabPanel>
  <TabPanel>
    <Biography />
  </TabPanel>
  <TabPanel>
    <SkillList />
  </TabPanel>
  <TabPanel>
    <CharacterCombat />
  </TabPanel>
  <TabPanel>
    <Tabs
      tabIndex={$entity.getFlag('GURPS', 'inventory-tab') || 0}
      on:tabchange={(e) => {
        $entity.setFlag('GURPS', 'inventory-tab', e.detail);
      }}>
      <TabList>
        <Tab index={0}>Main</Tab>
        <Tab index={1}>Other</Tab>
      </TabList>
      <TabPanel>
        <EquipmentList />
      </TabPanel>
      <TabPanel>
        <h1>Under Construction</h1>
      </TabPanel>
    </Tabs>
  </TabPanel>
  <TabPanel>
    <SpellList />
  </TabPanel>
  <TabPanel>
    <Tabs
      tabIndex={$entity.getFlag('GURPS', 'config-tab') || 0}
      on:tabchange={(e) => {
        $entity.setFlag('GURPS', 'config-tab', e.detail);
      }}>
      <TabList>
        <Tab index={0}>Attributes</Tab>
        <Tab index={1}>Options</Tab>
      </TabList>
      <TabPanel>
        <ul>
          {#each Object.entries($entity.getProperty('data.attributes')) as attribute, i}
            <li>{attribute[0]} ~ {attribute[1]}</li>
          {/each}
        </ul>
      </TabPanel>
      <TabPanel>
        <h1>Under Construction</h1>
      </TabPanel>
    </Tabs>
  </TabPanel>
</Tabs>
