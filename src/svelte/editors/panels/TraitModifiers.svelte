<script>
  import { getContext } from "svelte";

  export let entity = getContext("entity") || null;
  let GURPS = $entity.actor._GURPS;

  $: modifiers = $entity.getGURPSObject
    ? Array.from($entity.getGURPSObject().modifiers)
    : $entity.getModifiers();

  import { List, Row } from "../../list/list";
</script>

<style>

</style>

<List>
  <th slot="header">Enabled</th>
  <th slot="header">Modifier</th>
  <th slot="header">Cost Modifier</th>
  <th slot="header">Reference</th>
  {#each modifiers as modifier, i (modifier._id)}
    <Row
      on:addlistitem={() => $entity.addModifier()}
      config={{ highlightHover: false, deleteButton: false, focusable: false }}>
      <td>
        {#if modifier.enabled}
          <span class="fas fa-check" />
        {/if}
      </td>
      <td>{modifier.name} {modifier.levels ? modifier.levels : ''}</td>
      <td />
      <td>{modifier.reference}</td>
    </Row>
  {/each}
</List>
