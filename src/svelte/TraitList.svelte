<script>
  import { getContext } from "svelte";

  export let entity = getContext("entity") || null;
  const GURPS = getContext("GURPS");

  import Input from "./form/Input";
  import { List, Row } from "./list/list.ts";
  import { Tabs, TabList, TabPanel, Tab } from "./tabs/tabs";

  $: disadvantages = window.game.gurps4e.indexSort(
    [].concat(
      $GURPS.traitList.splitByType().disadvantages,
      $GURPS.traitList.splitByType().quirks
    )
  );

  $: advantages = window.game.gurps4e.indexSort(
    [].concat(
      $GURPS.traitList.splitByType().advantages,
      $GURPS.traitList.splitByType().perks
    )
  );
</script>

<style>

</style>

<Tabs
  tabIndex={$entity.getFlag('GURPS', 'traits-tab') || 0}
  on:tabchange={(e) => {
    $entity.setFlag('GURPS', 'traits-tab', e.detail);
  }}>
  <TabList>
    <Tab index={0}>Disadvantages & Quirks</Tab>
    <Tab index={1}>Advantages & Perks</Tab>
    <Tab index={2}>Languages & Culture</Tab>
  </TabList>
  <TabPanel>
    <List
      type="trait"
      on:addlistitem={() => {
        $entity.createOwnedItem({
          name: '???',
          type: 'trait',
          data: {
            categories: ['Disadvantage'],
          },
        });
      }}>
      <th
        slot="header"
        on:dblclick={(e) => {
          $entity.sortList('trait', 'data.name');
        }}>
        Disadvantages & Quirks
        <i class="fas fa-sort" />
      </th>
      <th slot="header">Pts</th>
      <th slot="header">Ref</th>
      {#each disadvantages as trait, i (trait.foundryID)}
        <Row
          disabled={trait.disabled}
          colspan="5"
          let:ownedItem
          {i}
          id={trait.foundryID}
          draggable={true}
          on:delete={(e) => {
            $entity.getOwnedItem(trait.foundryID).delete();
          }}>
          <td class="main-list-col">
            <Input
              config={{ clickToEdit: true }}
              entity={ownedItem ? ownedItem._entity : null}
              path="data.name"
              alsoUpdate={['name']}
              let:value>
              <span slot="no-edit">
                {trait.name} {trait.hasLevels ? trait.levels : ''}
              </span>
            </Input>
          </td>
          <td>{trait.adjustedPoints()}</td>
          <td>
            <Input
              config={{ clickToEdit: true }}
              entity={ownedItem ? ownedItem._entity : null}
              path="data.reference"
              let:value>
              <span slot="no-edit">{value}</span>
            </Input>
          </td>
          <div slot="notes">{trait.notes}</div>
        </Row>
      {/each}
    </List>
  </TabPanel>
  <TabPanel>
    <List
      type="trait"
      on:addlistitem={() => {
        $entity.createOwnedItem({
          name: '???',
          type: 'trait',
          data: {
            categories: ['Advantage'],
          },
        });
      }}>
      <th
        slot="header"
        on:dblclick={(e) => {
          $entity.sortList('trait', 'data.name');
        }}>
        Advantages & Perks
        <i class="fas fa-sort" />
      </th>
      <th slot="header">Pts</th>
      <th slot="header">Ref</th>
      {#each advantages as trait, i (trait.foundryID)}
        <Row
          disabled={trait.disabled}
          colspan="5"
          let:ownedItem
          {i}
          id={trait.foundryID}
          draggable={true}
          on:delete={(e) => {
            $entity.getOwnedItem(trait.foundryID).delete();
          }}>
          <td class="main-list-col">
            <Input
              config={{ clickToEdit: true }}
              entity={ownedItem ? ownedItem._entity : null}
              path="data.name"
              alsoUpdate={['name']}
              let:value>
              <span slot="no-edit">
                {trait.name} {trait.hasLevels ? trait.levels : ''}
              </span>
            </Input>
          </td>
          <td>{trait.adjustedPoints()}</td>
          <td>
            <Input
              config={{ clickToEdit: true }}
              entity={ownedItem ? ownedItem._entity : null}
              path="data.reference"
              let:value>
              <span slot="no-edit">{value}</span>
            </Input>
          </td>
          <div slot="notes">{trait.notes}</div>
        </Row>
      {/each}
    </List>
  </TabPanel>
  <TabPanel>
    <h1>Under Construction</h1>
  </TabPanel>
</Tabs>
