<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";

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

<Tabs tabIndex={0}>
  <TabList>
    <Tab index={0}>Spell Data</Tab>
    <Tab index={1}>Prerequisites</Tab>
    <Tab index={2}>Melee Weapon</Tab>
    <Tab index={3}>Ranged Weapon</Tab>
  </TabList>
  <TabPanel>
    <Input {entity} path="data.name" label="name" type="text" />
    <Input
      {entity}
      path="data.specialization"
      label="specialization"
      type="text" />
    <Input {entity} path="data.tech_level" label="Tech Level" type="text" />
    <Input {entity} path="data.college" label="College" />
    <Input {entity} path="data.power_source" label="Power Source" />
    <Input {entity} path="data.class" label="Class" />
    <Input {entity} path="data.casting_cost" label="Casting Cost" />
    <Input {entity} path="data.maintenance_cost" label="Mainenance Cost" />
    <Input {entity} path="data.casting_time" label="Casting Time" />
    <Input {entity} path="data.resist" label="Resist" />
    <Input {entity} path="data.duration" label="Duration" />
    <Input {entity} path="data.points" label="points" type="number" min="0" />
    <Select {entity} path="data.signature" label="Signature">
      <option value="IQ">IQ</option>
      <option value="DX">DX</option>
      <option value="HT">HT</option>
    </Select>
    <Select {entity} path="data.difficulty" label="Difficulty">
      <option value="E">E</option>
      <option value="A">A</option>
      <option value="H">H</option>
      <option value="VH">VH</option>
      <option value="W">W</option>
    </Select>
    <Select {entity} path="data.encumbrance_penalty_multiplier">
      <option value="0">No Penalty Due To Encumbrance</option>
    </Select>
    <Textarea {entity} path="data.notes" cols="15" rows="1" label="Notes" />
    <Input {entity} path="data.categories" label="categories" />
    <Input {entity} path="data.reference" label="Page Reference" />
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
  <TabPanel>
    <MeleeWeapons />
  </TabPanel>
  <TabPanel>
    <RangedWeapons />
  </TabPanel>
</Tabs>
