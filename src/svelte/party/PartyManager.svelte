<script>
  import { getContext, setContext } from "svelte";
  import { Tabs, TabList, Tab, TabPanel } from "../tabs/tabs";
  import Calendar from "./Calendar";

  export let entity = null;

  setContext("entity", entity);

  $: getPartyMembers = () => {
    return $entity
      .getProperty("data.members")
      .map((member) => game.actors.find((actor) => actor.id === member));
  };

  async function attemptToRemovePartyMember(id) {
    let roster = $entity.getProperty("data.members") || [];
    if (roster.includes(id)) {
      roster = roster.filter((member) => member !== id);
      return $entity.update({ "data.members": duplicate(roster) });
    }
  }
</script>

<style>
  .members .party-member {
    display: flex;
    border: 1px solid black;
    border-radius: 3px;
    margin: 3px;
  }
  .members .party-member .profile {
    max-width: 75px;
    position: relative;
  }
  .members .party-member .profile img {
    border: none;
  }
  .remove-member {
    position: absolute;
    top: 0px;
    right: 0px;
  }
</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'tab') || 0}
  onTabChange={(e) => $entity.setFlag('GURPS', 'tab', e.detail)}>
  <TabList>
    <Tab index={0}>Member Management</Tab>
    <Tab index={1}>Control Panel</Tab>
    <Tab index={2}>The Clock</Tab>
  </TabList>
  <TabPanel>
    <div class="party-view">
      <div class="members flex-col">
        {#each getPartyMembers() as member, i (member.id)}
          <div class="party-member">
            <div class="profile">
              <img src={member.getProperty('img')} alt="profile" />
              <span
                class="fas fa-minus-square remove-member"
                on:click={() => attemptToRemovePartyMember(member.id)} />
            </div>
          </div>
        {/each}
      </div>
    </div>
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
  <TabPanel>
    <Calendar />
  </TabPanel>
</Tabs>
