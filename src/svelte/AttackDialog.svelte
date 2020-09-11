<script>
  import Dialog from "./Dialog";
  import { Input } from "./form/form";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let type = null;
  export let weapon = null;

  let deceptiveAttacks = 0;
  let telegraphed = false;
  let hasWeaponMaster = false;
  let rapidStrikes = 0;
  let otherMods = 0;
  let ammoSource;

  function sendDiceRoll() {
    return [
      deceptiveAttacks * -2,
      rapidStrikes * -(hasWeaponMaster ? 3 : 6),
      telegraphed ? 4 : 0,
      otherMods,
    ];
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
    {#if weapon.getType() === 'ranged_weapon'}
      <select bind:value={ammoSource} />
    {/if}
  </div>
</Dialog>
