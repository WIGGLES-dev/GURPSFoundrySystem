<script>
  import { Row } from "../list/list";
  export let trait = null;
</script>

<style>
</style>

<Row>
  <td><input type="text" bind:value={trait.name} /></td>
  <td><input type="number" bind:value={trait.points} /></td>
  <td><input type="text" bind:value={trait.reference} /></td>
</Row>
