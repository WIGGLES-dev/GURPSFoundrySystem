<script>
  import { Row } from "@components/list/list";
  export let skill = null;
</script>

<style>
</style>

<Row let:depth id={skill.foundryID}>
  <td />
  <td>{Math.floor(skill.calculateLevel())}</td>
  <td />
  <td><input type="number" bind:value={skill.gMod} /></td>
  <td><input type="number" bind:value={skill.points} /></td>
  <td><input type="text" bind:value={skill.reference} /></td>
</Row>
