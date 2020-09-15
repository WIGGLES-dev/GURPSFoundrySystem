<script>
  import Dialog from "./Dialog";
  import { Tabs, TabList, TabPanel, Tab } from "@components/tabs/tabs";
  import ChangeLog from "../../CHANGELOG.md";
  import Info from "../../INFO.md";

  const buttons = {};
</script>

<style>
</style>

<Dialog
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
</Dialog>
