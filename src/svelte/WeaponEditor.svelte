<script>
  import Dialog from "./Dialog";

  import { Select, Option, Input } from "./form/form";

  export let entity = null;
  export let weapon = null;
  export let i = null;
</script>

<style>

</style>

<Dialog on:close>
  <Select
    {entity}
    path="data.weapons"
    array={{ index: i, property: 'type' }}
    label="Type">
    <Option value="melee_weapon">Melee</Option>
    <Option value="ranged_weapon">Ranged</Option>
  </Select>
  <Input
    {entity}
    path="data.weapons"
    array={{ index: i, property: 'usage' }}
    label="Usage" />
  <Input
    {entity}
    path="data.weapons"
    array={{ index: i, property: 'minimum_strength' }}
    label="Minimum Strength" />
  <div class="flex">
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'damage' }}
      label="Damage" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'damage_type' }}
      label="Type" />
  </div>
  {#if (weapon.type || weapon.getType()) === 'melee_weapon'}
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'reach' }}
      label="Reach" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'parry' }}
      label="Parry" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'block' }}
      label="Block" />
  {:else if (weapon.type || weapon.getType()) === 'ranged_weapon'}
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'accuracy' }}
      label="Accuracy" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'range' }}
      label="Range" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'rate_of_fire' }}
      label="Rate of Fire" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'shots' }}
      label="Shots" />
    <Input
      {entity}
      path="data.weapons"
      array={{ index: i, property: 'bulk' }}
      label="Bulk" />
  {/if}
</Dialog>
