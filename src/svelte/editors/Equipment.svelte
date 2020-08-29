<script>
  import { getContext } from "svelte";

  import {
    Select,
    Option,
    Checkbox,
    Textarea,
    RichTextEditor,
    Input,
  } from "../form/form";
  import { Tabs, TabList, TabPanel, Tab } from "../tabs/tabs";

  import { List, Row } from "../list/list";
  export let entity = getContext("entity") || null;

  let editing = false;

  const weaponMenuItems = (id, weapon, i) => [
    {
      name: "Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: () => true,
      callback() {
        weapon.edit();
      },
    },
    {
      name: "Roll",
      icon: '<i class="fas fa-dice-d6"></i>',
      condition: () => true,
      callback() {
        if ($entity.actor) $entity.actor.rollDamage(weapon);
      },
    },
    {
      name: "Delete",
      icon: '<i class="fas fa-trash"></i>',
      condition: () => true,
      callback() {
        $entity.removeByPath("data.weapons", id);
      },
    },
  ];
</script>

<style>
  :global(label) {
    display: block;
  }
</style>

{#if $entity.actor}
  <Checkbox path="data.equipped" label="Equipped" />
{/if}
<Input path="data.description" alsoUpdate={['name']} type="text" label="Name" />
<Input path="data.quantity" min="0" type="number" label="Quantity" />
<Input path="data.tech_level" type="text" label="Tech Level" />
<Input path="data.legality_class" type="text" label="Legality Class" />
<Input path="data.value" type="number" min="0" label="Value" />
<Input path="data.weight" type="number" min="0" label="Weight" />

<Textarea path="data.notes" label="Notes" cols="30" rows="1" />
<Input type="text" path="data.categories" label="Categories" />
<Input path="data.reference" label="Reference" />
<RichTextEditor path="data.user_description" />

<Tabs tabIndex={0}>
  <TabList>
    <Tab index={0}>Defaults</Tab>
    <Tab index={1}>Prerequisites</Tab>
    <Tab index={2}>Features</Tab>
    <Tab index={3}>Melee Weapon</Tab>
    <Tab index={4}>Ranged Weapon</Tab>
  </TabList>
  <TabPanel />
  <TabPanel />
  <TabPanel />
  <TabPanel>
    <List
      {entity}
      on:addlistitem={(e) => {
        $entity.addWeapon({ type: 'melee_weapon' });
      }}>
      <th slot="header">type</th>
      <th slot="header">usage</th>
      <th slot="header">damage</th>
      {#each $entity.getWeapons().melee as weapon, i (weapon._id)}
        <!-- svelte-ignore missing-declaration -->
        <Row
          config={{ highlightHover: false, deleteButton: false, focusable: false }}
          on:delete={(e) => {
            $entity.removeByPath('data.weapons', weapon._id);
          }}
          colspan="4"
          {i}
          menuItems={() => weaponMenuItems(weapon._id, weapon, i)}>
          <td>{weapon.type}</td>
          <td>{weapon.usage}</td>
          <td>{weapon.damage}</td>
          <div slot="notes">{weapon.notes}</div>
        </Row>
      {/each}
    </List>
  </TabPanel>
  <TabPanel>
    <List
      {entity}
      on:addlistitem={(e) => {
        $entity.addWeapon({ type: 'ranged_weapon' });
      }}>

      <th slot="header">type</th>
      <th slot="header">usage</th>
      <th slot="header">damage</th>

      {#each $entity.getWeapons().ranged as weapon, i (weapon._id)}
        <!-- svelte-ignore missing-declaration -->
        <Row
          config={{ highlightHover: false, deleteButton: false, focusable: false }}
          on:delete={(e) => {
            $entity.removeByPath('data.weapons', weapon._id);
          }}
          id={weapon._id}
          colspan="5"
          {i}
          menuItems={() => weaponMenuItems(weapon._id, weapon, i)}>
          <td>{weapon.type}</td>
          <td>{weapon.usage}</td>
          <td>{weapon.damage}</td>
          <div slot="notes">{weapon.notes}</div>
        </Row>
      {/each}
    </List>

  </TabPanel>
</Tabs>
