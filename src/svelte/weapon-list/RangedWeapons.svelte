<script>
  import { List, Row } from "../list/list";
  import { getContext } from "svelte";

  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  const weaponMenuItems = (weapon, i, id) => [
    {
      name: "Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: () => true,
      callback() {
        $entity.getOwnedItem(weapon.owner.foundryID).sheet.render(true);
      },
    },
  ];
</script>

<style>
  .d6 {
    float: left;
  }
</style>

<List>
  <th slot="header">Ranged Weapons</th>
  <th slot="header">Usage</th>
  <th slot="header">Lvl</th>
  <th slot="header">Acc</th>
  <th slot="header">Damage</th>
  <th slot="header">Range</th>
  <th slot="header">RoF</th>
  <th slot="header">Shots</th>
  <th slot="header">Bulk</th>
  <th slot="header">Rcl</th>
  <th slot="header">ST</th>
  {#each $entity.getWeapons().ranged as weapon, i}
    <Row
      menuItems={() => weaponMenuItems(weapon, i, weapon.owner.foundryID)}
      config={{ highlightHover: false, deleteButton: false, focusable: false }}>
      <td>{weapon.owner.name || ''}</td>
      <td>{weapon.usage || ''}</td>
      <td>
        {#if weapon.skillLevel()}
          <span
            class="fas fa-dice d6 roll-ico"
            on:click={() => weapon.rollSkill()} />
        {/if}
        <span>{weapon.skillLevel() || ''}</span>
      </td>
      <td>{weapon.accuracy || ''}</td>
      <td>
        {#if weapon.damage}
          <span
            class="fas fa-dice d6 roll-ico"
            on:click={() => weapon.rollDamage()} />
        {/if}
        <span>{weapon.damage || ''}</span>
      </td>
      <td>{weapon.range || ''}</td>
      <td>{weapon.rateOfFire || ''}</td>
      <td>{weapon.shots || ''}</td>
      <td>{weapon.bulk || ''}</td>
      <td>{weapon.recoil || ''}</td>
      <td>{weapon.strength || ''}</td>
    </Row>
  {/each}
</List>
