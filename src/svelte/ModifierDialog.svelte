<script>
  import Dialog from "./Dialog";
  import { Input } from "./form/form";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let type = null;

  let deceptiveAttacks = 0;
  let telegraphed = false;
  let hasWeaponMaster = false;
  let rapidStrikes = 0;
  let otherMods = 0;

  function sendDiceRoll() {
    let totalMod = 0;
    totalMod += deceptiveAttacks * -2;
    totalMod += rapidStrikes * -(hasWeaponMaster ? 3 : 6);
    totalMod += telegraphed ? -4 : 0;
    totalMod += otherMods;
    return totalMod;
  }

  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: "Roll",
      callback: () => dispatch("roll", sendDiceRoll()),
    },
  };
</script>

<style>

</style>

<Dialog
  on:close
  title="Attck Roll"
  {buttons}
  overrideSubmit={true}
  height={300}
  width={200}>
  {#if type === 'attack'}
    <div class="flex-col">
      <span>Deceptive Attacks</span>
      <input type="number" bind:value={deceptiveAttacks} min="0" />
      <span>Has Weapon Master</span>
      <input type="checkbox" bind:checked={hasWeaponMaster} />
      <span>Rapid Strikes</span>
      <input type="number" bind:value={rapidStrikes} min="0" />
      <span>Is Telegraphed</span>
      <input type="checkbox" bind:checked={telegraphed} />
      <span>Other Mods</span>
      <input type="number" bind:value={otherMods} />
    </div>
  {:else if type === 'skill'}
    <h1>WIP</h1>
  {:else if type === 'parry'}
    <h1>WIP</h1>
  {:else if type === 'dodge'}
    <h1>WIP</h1>
  {/if}
</Dialog>
