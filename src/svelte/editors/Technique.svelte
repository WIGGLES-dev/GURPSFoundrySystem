<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";

  export let entity = getContext("entity") || null;

  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";
  import Features from "./panels/Features";
  import RangedWeapons from "./panels/RangedWeapons";
  import MeleeWeapons from "./panels/MeleeWeapons";

  let basedOnSelect;
</script>

<style>

</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>Technique Data</Tab>
    <Tab index={1}>Prerequisites</Tab>
    <Tab index={2}>Features</Tab>
    <Tab index={3}>Melee Weapon</Tab>
    <Tab index={4}>Ranged Weapon</Tab>
  </TabList>
  <TabPanel>
    <Input {entity} path="data.name" alsoUpdate={['name']} label="name" />

    <Select {entity} path="data.difficulty" label="Difficulty">
      <Option value="A">A</Option>
      <Option value="H">H</Option>
    </Select>

    <Input {entity} path="data.tech_level" label="Tech Level" type="text" />
    <Input {entity} path="data.points" label="Points" type="number" min="0" />
    <Input
      tooltipText="Maximum difference technique level can reach from base level"
      {entity}
      path="data.limit"
      label="Limit"
      type="number" />
    <div class="flex">
      <Select bind:selected={basedOnSelect} path="data.default.type">
        <Option value="DX">DX</Option>
        <Option value="ST">ST</Option>
        <Option value="IQ">IQ</Option>
        <Option value="HT">HT</Option>
        <Option value="Will">Will</Option>
        <Option value="Perception">Perception</Option>
        <Option value="Skill">Skill Named</Option>
        <Option disabled={true}>Parrying Skill Named</Option>
        <Option disabled={true}>Blocking Skill Named</Option>
        <Option disabled={true}>10</Option>
      </Select>
      {#if basedOnSelect === 'Skill'}
        <Input {entity} path="data.default.name" />
        <Input {entity} path="data.default.specialization" />
      {/if}
      <Input {entity} path="data.default.modifier" type="number" />
    </div>
    <Textarea {entity} path="data.notes" cols="15" rows="1" label="Notes" />
    <Input {entity} path="data.categories" label="categories" />
    <Input {entity} path="data.reference" label="Page Reference" />
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
    <!-- <Features /> -->
  </TabPanel>
  <TabPanel>
    <MeleeWeapons />
  </TabPanel>
  <TabPanel>
    <RangedWeapons />
  </TabPanel>
</Tabs>
