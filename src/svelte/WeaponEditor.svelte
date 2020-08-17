<script>
  import Dialog from "./Dialog";

  import Input from "./form/Input";

  export let entity = null;
  export let weapon = null;
  export let i = null;
</script>

<style>

</style>

<Dialog on:close>
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
  <Input
    {entity}
    path="data.weapons"
    array={{ index: i, property: 'damage' }}
    label="Damage" />
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
  {:else if weapon.type === 'ranged_weapon'}
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
