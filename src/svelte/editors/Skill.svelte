<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";

  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";

  export let entity = getContext("entity") || null;
</script>

<style>

</style>

<div>
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
</div>

<Tabs tabIndex={0}>
  <TabList>
    <Tab index={0}>Defaults</Tab>
    <Tab index={1}>Prerequisites</Tab>
    <Tab index={2}>Features</Tab>
    <Tab index={3}>Melee Weapon</Tab>
    <Tab index={4}>Ranged Weapon</Tab>
  </TabList>
  <TabPanel />
  <TabPanel />
  <TabPanel />
  <TabPanel />
  <TabPanel />
</Tabs>
