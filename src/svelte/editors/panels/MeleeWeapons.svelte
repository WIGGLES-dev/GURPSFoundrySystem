<script>
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
