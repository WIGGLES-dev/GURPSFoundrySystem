<script>
  import Dialog from "./Dialog";
  import { Tabs, TabList, TabPanel, Tab } from "@components/tabs/tabs";
  import ChangeLog from "../../CHANGELOG.md";
  import Info from "../../INFO.md";

  let preference;

  function setPreference(e) {
    game.settings.set("GURPS", "welcome_dialog", preference);
  }
</script>

<style>
</style>

<Dialog
  on:close={setPreference}
  title={'GURPS4e Foundry System Welcome Dialog'}
  height={800}
  width={800}>
  <Tabs>
    <TabList>
      <Tab>Changelog</Tab>
      <Tab>Project Info</Tab>
    </TabList>
    <TabPanel>
      {@html ChangeLog}
    </TabPanel>
    <TabPanel>
      {@html Info}
    </TabPanel>
  </Tabs>
  <label>Don't show me this until next update <input type="checkbox" bind:checked={preference} /></label>
</Dialog>
