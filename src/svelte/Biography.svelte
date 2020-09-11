<script>
  import { RichTextEditor, Input, FilePicker, Textarea } from "./form/form";
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/tabs";
  import { getContext } from "svelte";
  export let entity = getContext("entity") || null;
  const GURPS = $entity._GURPS;
</script>

<style>
  .biography {
    white-space: nowrap;
  }
  .biography :global(label) {
    display: flex;
  }
  .biography :global(input) {
    margin-left: 5px;
  }
  .flex :global(img) {
    width: 50%;
  }
</style>

<div class="biography">
  <Tabs
    tabIndex={$entity.getFlag('GURPS', 'bio_misc_tab') || 0}
    on:tabchange={(e) => {
      $entity.setFlag('GURPS', 'bio_misc_tab', e.detail);
    }}>
    <TabList>
      <Tab index={0}>General Info</Tab>
      <Tab index={1}>Physical Description</Tab>
      <Tab index={2}>Background</Tab>
      <Tab index={3}>Misc</Tab>
    </TabList>
    <TabPanel>
      <Input type="text" path="name" label="Name" />
      <div class="flex">
        <FilePicker type="image" />
        <RichTextEditor path="data.bio.general.reactions" title="Reactions" />
      </div>
      <Input path="data.bio.general.full_name" label="Full Name" />
      <Input path="data.bio.general.nickname" label="Nick Name" />
      <Input path="data.bio.general.race" label="Race" />
      <Input path="data.bio.general.gender" label="Gender" />
      <Input path="data.bio.general.size_modifier" type="number" label="SM" />
      <Input path="data.bio.general.main_hand" label="Main Hand" />
    </TabPanel>
    <TabPanel>
      <Input path="data.bio.physical_description.age" label="Age" />
      <Input path="data.bio.physical_description.height" label="Height" />
      <Input path="data.bio.physical_description.weight" label="Weight" />
      <Input path="data.bio.physical_description.eye_color" label="Eye Color" />
      <Input path="data.bio.physical_description.build" label="Build" />
      <Input path="data.bio.physical_description.hair" label="Hair Color" />
      <Input
        path="data.bio.physical_description.appearance"
        label="Appearance" />
      <Input
        path="data.blur.physical_description.misc"
        label="Tattoos, scars, etc." />
    </TabPanel>
    <TabPanel>
      <Input path="data.bio.background.birth_date" label="Birth Date" />
      <Input path="data.bio.background.birth_place" label="Birth Place" />
      <Input path="data.bio.Button.status" label="Status" />
      <Input path="data.bio.background.wealth" label="Wealth" />
      <Input path="data.bio.background.income" label="Income" />
      <Input path="data.bio.background.cost_of_living" label="Cost of Living" />
      <Input path="data.bio.background.stash" label="Stash" />
      <Input path="data.bio.background.affiliations" label="Affiliations" />
      <Input path="data.bio.background.home_base" label="Home Base" />
      <RichTextEditor path="data.bio.background.family" title="Family" />
    </TabPanel>
    <TabPanel>
      <RichTextEditor
        path="data.bio.misc"
        title="Background, History & Notes" />
      <RichTextEditor path="data.bio.training" title="Training" />
    </TabPanel>
  </Tabs>
</div>
