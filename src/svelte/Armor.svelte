<script>
  import { getContext } from "svelte";

  import { Input } from "./form/form.ts";

  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;
</script>

<style>
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
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>-</td>
      <td>Eye</td>
      <td>-9</td>
      <td>
        <Input path="data.locations.eye.armor" />
      </td>
    </tr>
    <tr>
      <td>3-4</td>
      <td>Skull</td>
      <td>-7</td>
      <td>
        <Input path="data.locations.eye.skull" />
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>Face</td>
      <td>-5</td>
      <td>
        <Input path="data.locations.eye.face" />
      </td>
    </tr>
    <tr>
      <td>6-7</td>
      <td>Right Leg</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.eye.right_leg" />
      </td>
    </tr>
    <tr>
      <td>8</td>
      <td>Right Arm</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.eye.right_arm" />
      </td>
    </tr>
    <tr>
      <td>9-10</td>
      <td>Torso</td>
      <td>0</td>
      <td>
        <Input path="data.locations.eye.torso" />
      </td>
    </tr>
    <tr>
      <td>11</td>
      <td>Groin</td>
      <td>-3</td>
      <td>
        <Input path="data.locations.eye.groin" />
      </td>
    </tr>
    <tr>
      <td>12</td>
      <td>Left Arm</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.eye.left_arm" />
      </td>
    </tr>
    <tr>
      <td>13-14</td>
      <td>Left Leg</td>
      <td>-2</td>
      <td>
        <Input path="data.locations.eye.left_leg" />
      </td>
    </tr>
    <tr>
      <td>15</td>
      <td>Hand</td>
      <td>-4</td>
      <td>
        <Input path="data.locations.eye.hand" />
      </td>
    </tr>
    <tr>
      <td>16</td>
      <td>Foot</td>
      <td>-4</td>
      <td>
        <Input path="data.locations.eye.foot" />
      </td>
    </tr>
    <tr>
      <td>17-18</td>
      <td>Neck</td>
      <td>-5</td>
      <td>
        <Input path="data.locations.eye.neck" />
      </td>
    </tr>
    <tr>
      <td>-</td>
      <td>Vitals</td>
      <td>-3</td>
      <td>
        <Input path="data.locations.eye.vitals" />
      </td>
    </tr>
  </tbody>
</table>
