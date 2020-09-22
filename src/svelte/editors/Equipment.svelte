<script>
  import { getContext } from "svelte";

  import {
    Select,
    Option,
    Checkbox,
    Textarea,
    RichTextEditor,
    Input,
  } from "../form/form";
  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";

  import Features from "./panels/Features";
  import RangedWeapons from "./panels/RangedWeapons";
  import MeleeWeapons from "./panels/MeleeWeapons";

  export let entity = getContext("entity") || null;
</script>

<style>
  :global(label) {
    display: block;
  }
</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>Equipment Data</Tab>
    <Tab index={1}>Features</Tab>
    <Tab index={2}>Melee Weapons</Tab>
    <Tab index={3}>Ranged Weapons</Tab>
    <Tab index={4}>User Description</Tab>
  </TabList>
  <TabPanel>
    {#if $entity.actor}
      <Checkbox path="data.equipped" label="Equipped" />
    {/if}
    <Checkbox path="data.is_ammunition" label="Treat As Ammunition?" />
    <Input
      path="data.description"
      alsoUpdate={['name']}
      type="text"
      label="Name" />
    <Input path="data.quantity" min="0" type="number" label="Quantity" />
    <Input path="data.tech_level" type="text" label="Tech Level" />
    <Input path="data.legality_class" type="text" label="Legality Class" />
    <Input path="data.value" type="number" min="0" label="Value" />
    <Input path="data.weight" type="number" min="0" label="Weight" />

    <Textarea path="data.notes" label="Notes" cols="30" rows="1" />
    <Input type="text" path="data.categories" label="Categories" />
    <Input path="data.reference" label="Reference" />
  </TabPanel>
  <TabPanel>
    <Features />
  </TabPanel>
  <TabPanel>
    <MeleeWeapons />
  </TabPanel>
  <TabPanel>
    <RangedWeapons />
  </TabPanel>
  <TabPanel>
    <RichTextEditor path="data.user_description" title="User Description" />
  </TabPanel>
</Tabs>
