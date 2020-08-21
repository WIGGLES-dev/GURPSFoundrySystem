<script>
  import { getContext } from "svelte";
  const GURPS = getContext("GURPS");
  const entity = getContext("entity");

  $: encLevel = $GURPS.encumbranceLevel();
  $: move = $GURPS.getAttribute("Move").calculateLevel();
  $: lift = $GURPS.basicLift();
  $: dodge = $GURPS.dodgeScore();
</script>

<style>
  .active {
    background-color: yellow;
  }
  .cannot-move {
    background-color: red;
  }
</style>

<table class:cannot-move={encLevel === -5}>
  <thead>
    <tr>
      <th>Level</th>
      <th>Max Load</th>
      <th>Move</th>
      <th>Dodge</th>
    </tr>
  </thead>
  <tbody>
    <tr class:active={encLevel === 0}>
      <td>0 None</td>
      <td>{lift}</td>
      <td>{move}</td>
      <td>{dodge}</td>
    </tr>
    <tr class:active={encLevel === -1}>
      <td>1 Light</td>
      <td>{lift * 2}</td>
      <td>{move * 0.8}</td>
      <td>{dodge - 1}</td>
    </tr>
    <tr class:active={encLevel === -2}>
      <td>2 Medium</td>
      <td>{lift * 3}</td>
      <td>{move * 0.6}</td>
      <td>{dodge - 2}</td>
    </tr>
    <tr class:active={encLevel === -3}>
      <td>3 Heavy</td>
      <td>{lift * 6}</td>
      <td>{move * 0.4}</td>
      <td>{dodge - 3}</td>
    </tr>
    <tr class:active={encLevel === -4}>
      <td>4 X-Heavy</td>
      <td>{lift * 10}</td>
      <td>{move * 0.2}</td>
      <td>{dodge - 4}</td>
    </tr>
  </tbody>
</table>
