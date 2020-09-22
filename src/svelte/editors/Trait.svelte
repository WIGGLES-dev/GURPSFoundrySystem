<script>
  import { getContext } from "svelte";
  import {
    Input,
    Select,
    Option,
    Checkbox,
    Textarea,
    ChipList,
    RichTextEditor,
  } from "../form/form";
  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";
  import Features from "./panels/Features";
  import RangedWeapons from "./panels/RangedWeapons";
  import MeleeWeapons from "./panels/MeleeWeapons";

  export let entity = getContext("entity") || null;

  $: traitIsLeveled = getProperty($entity.data, "data.has_levels");
  $: traitHasHalfLevels = getProperty($entity.data, "data.has_half_level");

  async function handleLevelSetting(index) {
    switch (index) {
      case 0:
        traitIsLeveled = false;
        traitHasHalfLevels = false;
        await $entity.update({ "data.has_levels": false });
        await $entity.update({ "data.has_half_level": false });

        break;
      case 1:
        traitIsLeveled = true;
        traitHasHalfLevels = false;
        await $entity.update({ "data.has_levels": true });
        await $entity.update({ "data.has_half_level": false });

        break;
      case 2:
        traitIsLeveled = true;
        traitHasHalfLevels = true;
        await $entity.update({ "data.has_levels": true });
        await $entity.update({ "data.has_half_level": true });

        break;
    }
  }

  function setLevelType() {
    if (traitHasHalfLevels) return 2;
    if (traitIsLeveled) {
      return 1;
    } else if (!traitIsLeveled) {
      return 0;
    }
  }
</script>

<style>
</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>Trait Data</Tab>
    <Tab index={1}>Prerequisites</Tab>
    <Tab index={2}>Features</Tab>
    <Tab index={3}>Modifiers</Tab>
    <Tab index={4}>Melee Weapons</Tab>
    <Tab index={5}>Ranged Weapons</Tab>
    <Tab index={6}>User Description</Tab>
  </TabList>
  <TabPanel>
    {#if $entity.actor}
      <Checkbox {entity} path="data.enabled" label="Enabled" />
    {/if}
    <Input
      label="Name"
      {entity}
      path="data.name"
      type="text"
      alsoUpdate={['name']} />
    <Input
      label="Base Point Cost"
      width="50px"
      {entity}
      path="data.base_points"
      type="number" />

    <Select
      on:change={(e) => handleLevelSetting(e.detail.index)}
      noop={true}
      defaultIndex={setLevelType()}
      label="Levels">
      <Option selected={setLevelType() === 0}>Has No Levels</Option>
      <Option selected={setLevelType() === 1}>Has Levels</Option>
      <Option selected={setLevelType() === 2} disabled>Has Half Levels</Option>
    </Select>

    {#if traitIsLeveled}
      <Input
        label="Level"
        width="50px"
        {entity}
        path="data.levels"
        type="number"
        min="0"
        disabled={!traitIsLeveled} />
    {/if}

    {#if traitHasHalfLevels}
      <Checkbox
        {entity}
        on="true"
        off="false"
        path="data.has_half_level"
        label="+1/2"
        disabled={!traitHasHalfLevels} />
    {/if}

    {#if traitIsLeveled}
      <Input
        label="Point Cost Per Level"
        width="50px"
        {entity}
        path="data.points_per_level"
        type="number"
        disabled={!traitIsLeveled}
        min="0" />
    {/if}

    <Checkbox
      label="Round Down"
      {entity}
      on="true"
      off="false"
      disabled={true}
      path="data.round_down" />

    <Textarea {entity} path="data.notes" label="Notes" cols="30" rows="1" />
    <ChipList {entity} path="data.categories" label="Categories" />

    <Select
      tooltipText={/disad|quirk/i.test($entity
          .getProperty(`data.categories`)
          .toString()) ? null : `
          Control Rating only available on disadvantages or quirks,
          <br /> if still disabled add category Disadvantage/Quirk to the trait.
          <br /> make CR roll icon go away by setting CR to none required`}
      {entity}
      path="data.cr"
      label="Self-Control Roll"
      disabled={!/disad|quirk/i.test($entity
          .getProperty(`data.categories`)
          .toString())}>
      <option value="none">CR: N/A (Cannot Resist)</option>
      <option value="6">CR: 6 (Resist Rarely)</option>
      <option value="9">CR: 9 (Resist Fairly Often)</option>
      <option value="12">CR: 12 (Resist Often)</option>
      <option value="15">CR: 15 (Resist Almost All The Time)</option>
      <option value="n/a">None Required</option>
    </Select>
    <div class="flex">
      <Checkbox
        {entity}
        on="true"
        off="false"
        path="data.mental"
        label="Mental" />
      <Checkbox
        {entity}
        on="true"
        off="false"
        path="data.Physical"
        label="Physical" />
      <Checkbox
        {entity}
        on="true"
        off="false"
        path="data.social"
        label="Social" />
      <Checkbox
        {entity}
        on="true"
        off="false"
        path="data.exotic"
        label="Exotic" />
      <Checkbox
        {entity}
        on="true"
        off="false"
        path="data.supernatural"
        label="Supernatural" />
    </div>
    <Input {entity} path="data.reference" type="text" label="Reference" />
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
  <TabPanel>
    <Features />
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
  <TabPanel>
    <RichTextEditor path="data.user_description" title="User Description" />
  </TabPanel>
</Tabs>
