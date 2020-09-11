<script>
  export let weapon = null;
</script>

<style>

</style>

<div>
  <div class="row">
    <input type="text" bind:value={weapon.usage} />
    <input type="number" bind:value={weapon.strength} />
    <input type="text" bind:value={weapon.damage} />
    <select bind:value={weapon.damageType}>
      <option value="pi-">Pi-</option>
      <option value="pi">Pi</option>
      <option value="pi+">Pi+</option>
      <option value="pi++">Pi++</option>
      <option value="imp">Imp</option>
      <option value="cut">Cut</option>
      <option value="tox">Tox</option>
      <option value="fat">Fat</option>
    </select>
    {#if weapon.getType() === 'melee_weapon'}
      <input type="text" bind:value={weapon.reach} />
      <input type="text" bind:value={weapon.parry} />
      <input type="text" bind:value={weapon.block} />
    {:else if weapon.getType() === 'ranged_weapon'}
      <input type="text" bind:value={weapon.accuracy} />
    {/if}
  </div>
</div>
