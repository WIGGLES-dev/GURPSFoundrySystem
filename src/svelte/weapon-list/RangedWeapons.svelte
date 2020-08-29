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
        try {
          const skill = weapon.skill();
          $entity.rollSkill({
            trait: skill.name,
            level: skill.calculateLevel(),
            modifiers: weaponEntityData.weapon_skill_mod || "",
          });
        } catch (err) {
          ui.notifications.warn(
            "The ID reference you have provided cannot find the skill on your character sheet"
          );
        }
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
      <td>{weapon.skill() ? weapon.skill().calculateLevel() : ''}</td>
      <td>{weapon.accuracy || ''}</td>
      <td>{weapon.damage || ''}</td>
      <td>{weapon.range || ''}</td>
      <td>{weapon.rateOfFire || ''}</td>
      <td>{weapon.shots || ''}</td>
      <td>{weapon.bulk || ''}</td>
      <td>{weapon.recoil || ''}</td>
      <td>{weapon.strength || ''}</td>
    </Row>
  {/each}
</List>
