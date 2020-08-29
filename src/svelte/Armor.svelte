<script>
  import { getContext } from "svelte";

  import { Input } from "./form/form.ts";

  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;
</script>

<style>
  table {
    white-space: nowrap;
  }

  table :global(.GURPS-label) {
    padding: 0px !important;
  }

  .grow {
    width: 100%;
  }
  .armor {
    text-align: center;
  }
  .armor td {
    padding: 0;
  }
</style>

<table class="armor">
  <thead>
    <tr>
      <th>Roll</th>
      <th class="grow">Where</th>
      <th>Penalty</th>
      <th style="min-width: 75px;">DR</th>
      <th>
        <i
          class="fas fa-plus-square"
          on:click={() => {
            let locations = $entity.getProperty('data.locations.custom') || [];
            locations.push({ roll: '-', where: '???', penalty: 'N/A', dr: '' });
            $entity.update({ 'data.locations.custom': duplicate(locations) });
          }} />
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>-</td>
      <td>Eye</td>
      <td>-9</td>
      <td>
        <Input path="data.locations.eye" />
      </td>
      <td />
    </tr>
    <tr>
      <td>3-4</td>
      <td>Skull</td>
      <td>-7</td>
      <td>
        <Input path="data.locations.skull" />
      </td>
      <td />
    </tr>
    <tr>
      <td>5</td>
      <td>Face</td>
      <td>-5</td>
      <td>
        <Input path="data.locations.face" />
      </td>
      <td />
    </tr>
    <tr>
      <td>6-7</td>
      <td>Right Leg</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.right_leg" />
      </td>
      <td />
    </tr>
    <tr>
      <td>8</td>
      <td>Right Arm</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.right_arm" />
      </td>
      <td />
    </tr>
    <tr>
      <td>9-10</td>
      <td>Torso</td>
      <td>0</td>
      <td>
        <Input path="data.locations.torso" />
      </td>
      <td />
    </tr>
    <tr>
      <td>11</td>
      <td>Groin</td>
      <td>-3</td>
      <td>
        <Input path="data.locations.groin" />
      </td>
      <td />
    </tr>
    <tr>
      <td>12</td>
      <td>Left Arm</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.left_arm" />
      </td>
      <td />
    </tr>
    <tr>
      <td>13-14</td>
      <td>Left Leg</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.left_leg" />
      </td>
      <td />
    </tr>
    <tr>
      <td>15</td>
      <td>Hand</td>
      <td>-4</td>
      <td>
        <Input path="data.locations.hand" />
      </td>
      <td />
    </tr>
    <tr>
      <td>16</td>
      <td>Foot</td>
      <td>-4</td>
      <td>
        <Input path="data.locations.foot" />
      </td>
      <td />
    </tr>
    <tr>
      <td>17-18</td>
      <td>Neck</td>
      <td>-5</td>
      <td>
        <Input path="data.locations.neck" />
      </td>
      <td />
    </tr>
    <tr>
      <td>-</td>
      <td>Vitals</td>
      <td>-3</td>
      <td>
        <Input path="data.locations.vitals" />
      </td>
      <td />
    </tr>
    <tr>
      <td>-</td>
      <td>Area</td>
      <td>N/A</td>
      <td>
        <Input path="data.locations.area" />
      </td>
      <td />
    </tr>
  </tbody>
  <tbody>
    {#each $entity.getProperty('data.locations.custom') || [] as location, i}
      <tr>
        <td>
          <Input
            defaultValue="-"
            path="data.locations.custom"
            array={{ index: i, property: 'roll' }} />
        </td>
        <td>
          <Input
            path="data.locations.custom"
            array={{ index: i, property: 'where' }} />
        </td>
        <td>
          <Input
            path="data.locations.custom"
            array={{ index: i, property: 'penalty' }}
            type="number" />
        </td>
        <td>
          <Input
            path="data.locations.custom"
            array={{ index: i, property: 'dr' }} />
        </td>
        <td>
          <i
            class="fas fa-trash"
            on:click={() => {
              let locations = $entity.getProperty('data.locations.custom');
              locations.splice(i, 1);
              $entity.update({ 'data.loadFont.custom': duplicate(locations) });
            }} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
