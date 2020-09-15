<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";

  export let entity = getContext("entity") || null;
</script>

<style>
</style>

<Input {entity} path="data.name" type="text" label="Name" />
{#if $entity.enabled}
  <Checkbox {entity} path="data.enabled" label="Enabled" />
{/if}
<Input {entity} path="data.cost" type="number" label="Cost" />
<Select {entity} path="" />
<Select {entity} path="data.cost_type" label="Type">
  <option value="percentage">%</option>
  <option value="points">points</option>
  <option value="total">X</option>
</Select>
<Select {entity} path="data.affects" label="Affects">
  <option value="base_only">to base cost only</option>
  <option value="levels_only">to leveled cost only</option>
  <option value="total">to cost</option>
</Select>
<Textarea {entity} path="data.notes" label="Notes" cols="30" rows="1" />
<Input {entity} path="data.reference" label="Reference" />
