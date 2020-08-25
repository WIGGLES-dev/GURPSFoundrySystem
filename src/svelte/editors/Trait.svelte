<script>
  import { getContext } from "svelte";
  import { Input, Select, Option, Checkbox, Textarea } from "../form/form";

  export let entity = getContext("entity") || null;

  let traitIsLeveled = getProperty($entity.data, "data.has_levels");
  let traitHasHalfLevels = getProperty($entity.data, "data.has_half_level");

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
    console.log(traitIsLeveled, traitHasHalfLevels);
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
  <Option>Has No Levels</Option>
  <Option>Has Levels</Option>
  <Option>Has Half Levels</Option>
</Select>

<Input
  label="Level"
  width="50px"
  {entity}
  path="data.levels"
  type="number"
  min="0"
  disabled={!traitIsLeveled} />

<Checkbox
  {entity}
  on="true"
  off="false"
  path="data.has_half_level"
  label="+1/2"
  disabled={!traitHasHalfLevels} />

<Input
  label="Point Cost Per Level"
  width="50px"
  {entity}
  path="data.points_per_level"
  type="number"
  disabled={!traitIsLeveled}
  min="0" />

<Checkbox
  label="Round Down"
  {entity}
  on="true"
  off="false"
  path="data.round_down" />
<Input disabled={true} label="Total" />
<Textarea {entity} path="data.notes" label="Notes" cols="30" rows="1" />
<Input {entity} type="text" path="data.categories" label="categories" />
<Select {entity} path="data.cr" label="Self-Control Roll">
  <option value="0">CR: N/A (Cannot Resist)</option>
  <option value="6">CR: 6 (Resist Rarely)</option>
  <option value="9">CR: 9 (Resist Fairly Often)</option>
  <option value="12">CR: 12 (Resist Often)</option>
  <option value="15">CR: 15 (Resist Almost All The Time)</option>
  <option value="null">None Required</option>
</Select>
<Checkbox {entity} on="true" off="false" path="data.mental" label="Mental" />
<Checkbox
  {entity}
  on="true"
  off="false"
  path="data.Physical"
  label="Physical" />
<Checkbox {entity} on="true" off="false" path="data.social" label="Social" />
<Checkbox {entity} on="true" off="false" path="data.exotic" label="Exotic" />
<Checkbox
  {entity}
  on="true"
  off="false"
  path="data.supernatural"
  label="Supernatural" />
<Input {entity} path="data.reference" type="text" label="Reference" />

<!-- <pre>{JSON.stringify(entity.data, null, 2)}</pre> -->
