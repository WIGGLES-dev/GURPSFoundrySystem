<script>
  import { Tabs, TabList, TabPanel, Tab } from "../../tabs/tabs";
  import { List, Row } from "../../list/list";
  import { getContext } from "svelte";
  export let entity = getContext("entity") || null;

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
</style>

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
      config={{ highlightHover: false, focusable: false }}
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
