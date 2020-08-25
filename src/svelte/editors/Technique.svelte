<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";

  export let entity = getContext("entity") || null;

  let basedOnSelect;
</script>

<style>

</style>

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
<Input
  tooltipText="Modifier applied to base technique level"
  {entity}
  path="data.default"
  label="Default"
  type="number" />

<Select
  {entity}
  path="data.based_on"
  label="Based On"
  bind:selected={basedOnSelect}>
  <Option value="attribute">Attribute</Option>
  <Option value="skill">Skill</Option>
</Select>

{#if basedOnSelect === 'attribute'}
  <Select {entity} path="data.signature" label="Signature">
    <Option value="ST">ST</Option>
    <Option value="IQ">IQ</Option>
    <Option value="DX">DX</Option>
    <Option value="HT">HT</Option>
    <Option value="Per">Per</Option>
    <Option value="Will">Will</Option>
    <Option value="10">10</Option>
  </Select>
{:else if basedOnSelect === 'skill'}
  <Input {entity} path="data.skill_id" label="Skill ID" />
{/if}

<Textarea {entity} path="data.notes" cols="15" rows="1" label="Notes" />
<Input {entity} path="data.categories" label="categories" />
<Input {entity} path="data.reference" label="Page Reference" />
