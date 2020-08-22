<script>
  import Dialog from "./Dialog";

  import { Select, Option, Input } from "./form/form";

  export let entity = null;
  export let weapon = null;
  export let i = null;

  $: weaponType = $entity.getProperty("data.weapons")[i].type;
</script>

<style>

</style>

<Dialog on:close title="Weapon Editor">
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
  {#if weaponType === 'melee_weapon'}
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
  {:else if weaponType === 'ranged_weapon'}
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

  <Input
    {entity}
    path="data.weapons"
    label="Skill ID"
    array={{ index: i, property: 'skill_id' }} />
  <Input
    {entity}
    label="Weapon Skill Bonus"
    path="data.weapons"
    array={{ index: i, property: 'weapon_skill_mod' }} />
</Dialog>
