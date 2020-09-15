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
    position: relative;
    left: 10;
  }
  td {
    position: relative;
  }
</style>

<List config={{ addListItemButton: false }}>
  <th slot="header">Melee Weapons</th>
  <th slot="header">Usage</th>
  <th slot="header">Lvl</th>
  <th slot="header">Parry</th>
  <th slot="header">Block</th>
  <th slot="header">Damage</th>
  <th slot="header">Reach</th>
  <th slot="header">ST</th>
  {#each $entity.getWeapons().melee as weapon, i}
    <Row
      disabled={!weapon.owner.isActive()}
      menuItems={() => weaponMenuItems(weapon, i, weapon.owner.foundryID)}
      config={{ highlightHover: false, deleteButton: false, focusable: false }}>
      <td>{weapon.owner.name}</td>
      <td>{weapon.usage}</td>
      <td>
        {#if weapon.skillLevel()}
          <span
            class="fas fa-dice d6 roll-ico"
            on:click={() => weapon.rollSkill()} />
          {weapon.skillLevel() || ''}
        {/if}
      </td>
      <td>
        {#if typeof weapon.parry === 'number'}
          <span class="fas fa-shield-alt" on:click={() => weapon.rollParry()} />
          {weapon.parry || ''}
        {/if}
      </td>
      <td>
        {#if typeof weapon.block === 'number'}
          <span class="fas fa-shield-alt" on:click={() => weapon.rollBlock()} />
          {weapon.block || ''}
        {/if}
      </td>
      <td>
        {#if weapon.damage}
          <span
            class="fas fa-dice d6 roll-ico"
            on:click={() => weapon.rollDamage()} />
          {weapon.damage || ''}
        {/if}
      </td>
      <td>{weapon.reach || ''}</td>
      <td>{weapon.strength || ''}</td>
    </Row>
  {/each}
</List>
