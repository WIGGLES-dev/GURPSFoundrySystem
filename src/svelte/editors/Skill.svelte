<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";
  import { List, Row } from "../list/list";

  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";

  import Features from "./panels/Features";
  import RangedWeapons from "./panels/RangedWeapons";
  import MeleeWeapons from "./panels/MeleeWeapons";
  import SkillDefaults from "./panels/SkillDefaults";

  export let entity = getContext("entity") || null;
</script>

<style>
  .selectable {
    user-select: text;
  }
</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>Skill Data</Tab>
    <Tab index={1}>Defaults</Tab>
    <Tab index={2}>Prerequisites</Tab>
    <Tab index={3}>Features</Tab>
    <Tab index={4}>Melee Weapons</Tab>
    <Tab index={5}>Ranged Weapons</Tab>
  </TabList>
  <TabPanel>
    ID: <span class="selectable">{$entity.id}</span>
    <Input path="data.name" alsoUpdate={['name']} label="Name" />
    <Input
      {entity}
      path="data.specialization"
      label="specialization"
      type="text" />
    <Input {entity} path="data.tech_level" label="Tech Level" type="text" />
    <Input {entity} path="data.points" label="points" type="number" min="0" />
    <Select {entity} path="data.signature" label="Signature">
      <Option value="ST">ST</Option>
      <Option value="IQ">IQ</Option>
      <Option value="DX">DX</Option>
      <Option value="HT">HT</Option>
      <Option value="Per">Per</Option>
      <Option value="Will">Will</Option>
      <Option value="10" disabled={true}>10</Option>
    </Select>
    <Select {entity} path="data.difficulty" label="Difficulty">
      <Option value="E">E</Option>
      <Option value="A">A</Option>
      <Option value="H">H</Option>
      <Option value="VH">VH</Option>
      <Option value="W">W</Option>
    </Select>
    <Input
      {entity}
      tooltipText="Will apply a penalty equal to this number times your
      encumbrance level to skill level"
      label="Encumbrance Penalty Multiplier"
      path="data.encumbrance_penalty_multiplier"
      type="number"
      min="0" />
    <Textarea {entity} path="data.notes" cols="15" rows="1" label="Notes" />
    <Input {entity} path="data.categories" label="categories" />
    <Input {entity} path="data.reference" label="Page Reference" />
  </TabPanel>
  <TabPanel>
    <SkillDefaults
      on:removedefault={(e) => $entity.removeByPath('data.defaults', e.detail.id)}
      on:adddefault={(e) => {
        $entity.addDefault();
      }} />
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
