<script>
  import Dialog from "@components/Dialog";
  import { Input } from "../form/form";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let weapon = null;

  let deceptiveAttacks = 0;
  let telegraphed = false;
  let hasWeaponMaster = false;
  let rapidStrikes = 0;
  let otherMods = 0;
  let ammoSource;

  function sendDiceRoll() {
    return [
      {
        modifier: `${deceptiveAttacks === 0 ? "+" : "-"}${
          deceptiveAttacks * 2
        }`,
        description: "Deceptive attacks",
      },
      {
        modifier: `${rapidStrikes === 0 ? "+" : "-"}${
          rapidStrikes * (hasWeaponMaster ? 3 : 6)
        }`,
        description: "Rapid strikes",
      },
      { modifier: `+${telegraphed ? 4 : 0}`, description: "Is telegraphed" },
      {
        modifier: `${otherMods >= 0 ? "+" : "-"}${otherMods}`,
        description: "Other mods",
      },
    ];
  }

  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: "roll",
      callback: () => dispatch("roll", sendDiceRoll()),
    },
  };
</script>

<style>
</style>

<Dialog
  on:close
  title="Attack Roll"
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
      <span>Ammo Source To Use</span>
      <select>
        {#each weapon.getAmmoSources() || [] as ammoSource, i (ammoSource.uuid)}
          <option value={ammoSource.foundryID}>{ammoSource.name}</option>
        {/each}
      </select>
    {/if}
  </div>
</Dialog>
