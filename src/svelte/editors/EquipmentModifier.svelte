<script>
  import {Input, Select, Option, Checkbox, Textarea} from "../form/form";

  export let entity = null;
</script>

<style>

</style>

<Input {entity} path="data.name" type="text" label="Name" />
<Input {entity} path="data.tech_level" type="text" label="Tech Level" />
<Checkbox {entity} path="data.enabled" label="Enabled" />
<Input {entity} path="data.cost" type="number" label="Cost" />
<Select {entity} path="data.cost_type" label="Weight Type">
  <option value="to_original_cost">
    to original cost (e.g '+5', '-5', '+10%', '-10%', 'x3.2')
  </option>
  <option value="to_base_cost">
    to base cost (e.g '+5 lb', '-5 lb', 'x10%', 'x3', 'x2/3')
  </option>
  <option value="to_final_base_cost">
    to final base cost (e.g '+5 lb', '-5 lb', 'x10%', 'x3', 'x2/3')
  </option>
  <option value="to_final_cost">
    to final cost (e.g '+5 lb', '-5 lb', 'x10%', 'x3', 'x2/3')
  </option>
</Select>
<Input {entity} path="data.weight" type="number" label="Weight" />
<Select {entity} path="data.weight_type" label="Weight Type">
  <option value="to_original_weight">
    to original weight (e.g '+5', '-5', '+10%', '-10%', 'x3.2')
  </option>
  <option value="to_base_weight">
    to base weight (e.g '+5 lb', '-5 lb', 'x10%', 'x3', 'x2/3')
  </option>
  <option value="to_final_base_weight">
    to final base weight (e.g '+5 lb', '-5 lb', 'x10%', 'x3', 'x2/3')
  </option>
  <option value="to_final_weight">
    to final weight (e.g '+5 lb', '-5 lb', 'x10%', 'x3', 'x2/3')
  </option>
</Select>
<Select {entity} path="data.affects" label="Affects">
  <option value="base_only">to base cost only</option>
  <option value="levels_only">to leveled cost only</option>
  <option value="total">to cost</option>
</Select>
<Textarea {entity} path="data.notes" label="Notes" cols="30" rows="1" />
<Input {entity} path="data.reference" label="Reference" />
