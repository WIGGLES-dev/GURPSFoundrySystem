<script>
  import { List, Row } from "../list/list";
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  function rollSkill(weapon) {
    try {
      const skill = weapon.skill();
      $entity.rollSkill({
        trait: skill.name,
        level: skill.calculateLevel(),
        modifiers: weapon.skillMod,
      });
    } catch (err) {
      ui.notifications.warn(
        "The ID reference you have provided cannot find the skill on your character sheet"
      );
    }
  }

  const weaponMenuItems = (weapon, i, id) => [
    {
      name: "Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: () => true,
      callback() {
        weapon.edit($entity.getOwnedItem(weapon.owner.foundryID)._entity);
      },
    },
    {
      name: "Roll Skill",
      icon: '<i class="fas fa-dice-d6"></i>',
      condition: () => {
        try {
          if (weapon.skill()) {
            return true;
          }
        } catch (err) {
          return false;
        }
      },
      callback() {
        rollSkill(weapon);
      },
    },
    {
      name: "Roll Damage",
      icon: '<i class="fas fa-dice-d6"></i>',
      condition: () => true,
      callback() {
        $entity.rollDamage(weapon);
      },
    },
    {
      name: "Delete",
      icon: '<i class="fas fa-trash"></i>',
      condition: () => true,
      callback() {
        $entity
          .getOwnedItem(id)
          .removeByPath("data.weapons", weapon.foundryID || weapon._id);
      },
    },
  ];
</script>

<style>

</style>

<List>
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
      menuItems={() => weaponMenuItems(weapon, i, weapon.owner.foundryID)}
      config={{ highlightHover: false, deleteButton: false, focusable: false }}>
      <td>{weapon.owner.name}</td>
      <td>{weapon.usage}</td>
      <td>
        {#if weapon.skill()}
          <span class="fas fa-dice d6" on:click={() => rollSkill(weapon)} />
        {/if}
        <span>{weapon.skill() ? weapon.skill().calculateLevel() : ''}</span>
      </td>
      <td>{weapon.parry || ''}</td>
      <td>{weapon.block || ''}</td>
      <td>
        {#if weapon.damage}
          <span
            class="fas fa-dice d6"
            on:click={() => $entity.rollDamage(weapon)} />
        {/if}
        {weapon.damage || ''}
      </td>
      <td>{weapon.reach || ''}</td>
      <td>{weapon.strength || ''}</td>
    </Row>
  {/each}
</List>
