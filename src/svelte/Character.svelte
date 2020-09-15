<script>
  import { Character } from "../foundry-GURPS/sheet";
  import { setContext } from "svelte";
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/tabs";

  import EquipmentList from "./EquipmentList";
  import TraitList from "./TraitList";
  import SkillList from "./SkillList";
  import SpellList from "./SpellList";
  import Encumbrance from "./Encumbrance";
  import Totals from "./Totals";
  import Armor from "./Armor";
  import Attributes from "./Attributes";
  import Pools from "./Pools";
  import Biography from "./Biography";
  import CharacterCombat from "./CharacterCombat";

  import ChangeLog from "../../CHANGELOG.md";
  import Info from "../../INFO.md";

  import { RichTextEditor, Input, FilePicker, Textarea } from "./form/form";

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
  .column {
    display: flex;
    flex-direction: column;
  }
  .general {
    position: relative;
    height: 100%;
  }
  .general-page {
    margin-left: 100px;
  }
  .attribute-sidebar {
    background-color: rgba(0, 0, 0, 0.05);
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
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
    <Tab index={7}><i class="fas fa-cogs" /></Tab>
  </TabList>
  <TabPanel>
    <div class="general">
      <div class="attribute-sidebar">
        <Attributes />
      </div>
      <div class="general-page">
        <div class="flex" style="background-color: rgba(0, 0, 0, 0.05);">
          <div class="flex-col" />
          <div style="flex-grow: 1; padding: 0px 5px 0px 5px;">
            <Encumbrance />
            <Pools />
          </div>
          <div class="flex-col">
            <Totals />
          </div>
        </div>
        <div style="background-color: rgba(0, 0, 0, 0.05);">
          <Textarea path="data.notes" label="Notes" />
        </div>
      </div>
    </div>
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
        <EquipmentList location="other" />
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
        <Tab index={2}>Changelog</Tab>
        <Tab index={3}>Project Info</Tab>
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
      <TabPanel>
        {@html ChangeLog}
      </TabPanel>
      <TabPanel>
        {@html Info}
      </TabPanel>
    </Tabs>
  </TabPanel>
</Tabs>
