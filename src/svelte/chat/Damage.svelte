<script>
  export let message = null;

  const roll = message.roll;
  const { type, weaponName, damageType, weaponUsage } = message.getFlag(
    "GURPS",
    "roll_data"
  );
</script>

<style>

</style>

<div class="dice-roll">
  <div class="dice-result">
    <div class="dice-formula">
      {weaponName} - {weaponUsage}
      <br />
      {roll.formula}
    </div>
    <div class="dice-tooltip">
      <div class="dice">
        {#each roll.dice as die}
          <p class="part-formula">
            {die.formula}
            <span class="part-total">{die.total}</span>
          </p>

          <ol class="dice-rolls">
            {#each die.results as result}
              <li class="roll die d6">{result}</li>
            {/each}
          </ol>
        {/each}
      </div>
    </div>
    <h4 class="dice-total">{roll.total} {damageType}</h4>
  </div>
</div>
