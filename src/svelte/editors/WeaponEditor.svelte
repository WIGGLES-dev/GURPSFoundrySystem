<script>
  import Dialog from "../Dialog";
  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";
  import { Select, Option, Input } from "../form/form";
  import { getContext } from "svelte";
  import SkillDefaults from "./panels/SkillDefaults";
  export let entity = getContext("entity") || null;
  export let weapon = null;

  console.log(weapon, $entity);

  let i = $entity
    .getProperty("data.weapons")
    .findIndex((item) => item._id === weapon.foundryID);

  $: getWeaponType = () => {
    try {
      return $entity
        .getProperty("data.weapons")
        .find((item) => item._id === weapon.foundryID).type;
    } catch (err) {}
  };
</script>

<style>
</style>

<Dialog on:close title="Weapon Editor">
  <Tabs>
    <TabList>
      <Tab index={0}>Weapon Data</Tab>
      <Tab index={1}>Weapon Defaults</Tab>
    </TabList>
    <TabPanel>
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
      {#if getWeaponType() === 'melee_weapon'}
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
      {:else if getWeaponType() === 'ranged_weapon'}
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
        label="Weapon Skill Bonus"
        path="data.weapons"
        array={{ index: i, property: 'weapon_skill_mod' }} />
    </TabPanel>
    <TabPanel>
      <SkillDefaults
        on:adddefault={async (e) => {
          let weapon = $entity.getProperty(`data.weapons.${i}`);
          let defaults = weapon.defaults || [];
          defaults.push({
            _id: randomID(),
            type: 'DX',
            modifier: 0,
            name: '',
            specialization: '',
          });
          weapon.defaults = defaults;
          await $entity.update({ data: duplicate($entity.data.data) });
        }}
        on:removedefault={async (e) => {
          let weapon = $entity.getProperty(`data.weapons.${i}`);
          let defaults = weapon.defaults || [];
          defaults = defaults.filter((item) => item._id !== e.detail.id);
          weapon.defaults = defaults;
          $entity.update({ data: duplicate($entity.data.data) });
        }}
        {entity}
        path="data.weapons[{i}].defaults" />
    </TabPanel>
  </Tabs>
</Dialog>
