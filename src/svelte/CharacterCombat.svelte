<script>
  import { getContext } from "svelte";
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/tabs";

  import Armor from "./Armor";
  import Encumbrance from "./Encumbrance";
  import MeleeWeapons from "./weapon-list/MeleeWeapons.svelte";
  import RangedWeapons from "./weapon-list/RangedWeapons.svelte";

  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;
</script>

<style>

</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'combat-tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'combat-tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>Ranged Weapons</Tab>
    <Tab index={1}>Melee Weapons</Tab>
    <Tab index={2}>Tools</Tab>
    <Tab index={3}>Armor</Tab>
  </TabList>
  <TabPanel>
    <RangedWeapons />
  </TabPanel>
  <TabPanel>
    <MeleeWeapons />
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
  <TabPanel>
    <Armor />
  </TabPanel>
</Tabs>
<button
  type="button"
  on:click={() => {
    $entity.dodge();
  }}>
  Dodge
</button>
