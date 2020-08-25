<script>
  import WeaponEditor from "./WeaponEditor";
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  import Input from "./form/Input";
  import { List, Row } from "./list/list.ts";

  function getWeapons(weapons) {
    let x = Array.from(weapons).reduce((prev, weapon) => {
      if (prev[weapon.owner.foundryID]) {
        prev[weapon.owner.foundryID].push(weapon);
      } else {
        prev[weapon.owner.foundryID] = [weapon];
      }
      return prev;
    }, {});
    return Object.entries(x);
  }

  let editing = false;

  $: weapons = [].concat($GURPS.featureList.weapons.values());

  function transformWeapon(weapon, name) {
    return {
      _id: weapon._id,
      type: weapon.type,
      getType() {
        return weapon.type;
      },
      damage: weapon.damage,
      damageType: weapon.damage_type,
      usage: weapon.usage,
      owner: { name },
    };
  }

  const weaponMenuItems = (id, weapon, i, weaponEntityData) => [
    {
      name: "Edit",
      icon: '<i class="fas fa-edit"></i>',
      condition: () => true,
      callback() {
        if (!editing) {
          editing = {
            entity: $entity.getOwnedItem(id)._entity,
            i,
            weapon,
          };
        }
      },
    },
    {
      name: "Roll Skill",
      icon: '<i class="fas fa-dice-d6"></i>',
      condition: () => {
        try {
          if (weaponEntityData.skill_id) {
            return true;
          }
        } catch (err) {
          return false;
        }
      },
      callback() {
        try {
          const skill = $GURPS.getElementById(
            "foundryID",
            weaponEntityData.skill_id
          );
          $entity.rollSkill(skill, weaponEntityData.weapon_skill_mod || "");
        } catch (err) {
          console.log(err);
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
  .weapon-tools {
  }
  .weapon-tools > .tool {
    float: left;
  }
  .weapon-list {
    margin: 0px;
    border: none;
  }
</style>

<button
  type="button"
  on:click={(e) => {
    $entity.createOwnedItem({ type: 'weapon', name: '???', data: {} });
  }}>
  Add Weapon
</button>

<!-- <List buttonLabel="Add Weapon" config={{button: false}} >
  <thead name="head">
    <tr>
      <th />
      <th>Name</th>
      <th>#</th>
      <th />
    </tr>
  </thead>
</List> -->

<List buttonLabel="Add Weapon" config={{ button: false }}>
  <thead name="head">
    <tr>
      <th />
      <th>Name</th>
      <th>#</th>
      <th />
    </tr>
  </thead>
  <tbody>
    {#each getWeapons($GURPS.featureList.weapons.values()) as weapon, i (weapon[0])}
      <Row {i} colspan="4" id={weapon[0]} config={{ toggle: true }}>
        <td class="weapon-tools">
          <span class="tool fas fa-dice d6" />
          {$GURPS.getElementById('foundryID', weapon[0]).name}
        </td>
        <td>{weapon[1].length}</td>
        <table slot="notes" class="weapon-list">
          <thead>
            <tr>
              <th />
              <th>type</th>
              <th>usage</th>
              <th>damage</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each weapon[1] as weapon, i (weapon.foundryID)}
              <Row
                config={{ highlightHover: false, deleteButton: false }}
                menuItems={() => weaponMenuItems(weapon.owner.foundryID, weapon, i, $entity
                      .getOwnedItem(weapon.owner.foundryID)
                      .getProperty('data.weapons')[i])}>
                <td>{weapon.getType()}</td>
                <td>{weapon.usage}</td>
                <td>
                  <span
                    class="fas fa-dice d6 roll-ico"
                    on:click={(e) => {
                      $entity.rollDamage(weapon);
                    }} />
                  {weapon.damage} {weapon.damageType}
                </td>
              </Row>
            {/each}
          </tbody>
        </table>
      </Row>
    {/each}
  </tbody>
  <tbody class="wild">
    {#each $entity.ownedItemsByType('weapon') as weaponEntity, i (weaponEntity.id)}
      <Row colspan="4" id={weaponEntity.id} {i} config={{ toggle: true }}>
        <td>
          <Input
            config={{ clickToEdit: true }}
            let:value
            path="name"
            entity={weaponEntity._entity}>
            <span slot="no-edit">{value}</span>
          </Input>
        </td>
        <td>{weaponEntity.getProperty('data.weapons').length}</td>
        <table slot="notes" class="weapon-list">
          <thead>
            <tr>
              <th />
              <th>type</th>
              <th>usage</th>
              <th>damage</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each weaponEntity.getProperty('data.weapons') as weapon, i (weapon._id)}
              <Row
                config={{ highlightHover: false, deleteButton: false }}
                menuItems={() => weaponMenuItems(weaponEntity.id, transformWeapon(weapon, weaponEntity.getProperty('name')), i, weapon)}>
                <td>{weapon.type}</td>
                <td>{weapon.usage}</td>
                <td>
                  <span
                    class="fas fa-dice d6 roll-ico"
                    on:click={(e) => {
                      $entity.rollDamage(transformWeapon(weapon, weaponEntity.getProperty('name')));
                    }} />
                  {weapon.damage} {weapon.damage_type}
                </td>
              </Row>
            {/each}
          </tbody>
        </table>
      </Row>
    {/each}
  </tbody>
</List>

<svelte:component
  this={editing ? WeaponEditor : false}
  on:close={() => (editing = false)}
  entity={editing.entity}
  i={editing.i}
  weapon={editing.weapon} />
