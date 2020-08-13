<script>
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
</script>

<style>

</style>

<List buttonLabel="Add Weapon">
  <thead name="head">
    <tr>
      <th />
      <th>Name</th>
      <th>#</th>
      <th />
    </tr>
  </thead>
  {#each getWeapons($GURPS.featureList.weapons.values()) as weapon, i (weapon[0])}
    <Row {i} colspan="4">
      <td>{$GURPS.getElementById('foundryID', weapon[0]).name}</td>
      <td>{weapon[1].length}</td>
      <table slot="notes">
        <thead>
          <tr>
            <th>type</th>
            <th>usage</th>
            <th>damage</th>
          </tr>
        </thead>
        <tbody>
          {#each weapon[1] as weapon, i (weapon.foundryID)}
            <tr>
              <td>{weapon.getType()}</td>
              <td>{weapon.usage}</td>
              <td>{weapon.damage}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </Row>
  {/each}
  <!-- <tbody class="wild">
    {#each entity.getWildWeapons() as weapon, i (weapon.foundryID)}
      <tr>

      </tr>
    {/each}
  </tbody> -->
</List>
