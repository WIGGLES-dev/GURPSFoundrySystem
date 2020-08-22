<script>
  import { getContext } from "svelte";

  import { Input } from "./form/form";

  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;

  $: totals = $GURPS.pointTotals();
</script>

<style>
  .totals {
    background-color: rgba(0, 0, 0, 0.05);
    gap: 5px;
    margin-left: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
  }
  .totals :global(.GURPS-label) {
    padding: 0px;
  }

  .totals :global(input) {
    float: right;
  }

  .total {
    text-align: right;
  }

  .total-points {
    grid-column: 1 / span 2;
    background-color: black;
    color: white;
    text-align: center;
  }

  .thrust {
    color: white;
    background-color: black;
    text-align: center;
  }
  .swing {
    color: white;
    background-color: black;
    text-align: center;
  }
</style>

<div class="totals">
  <div class="total-points">
    {totals.total + $entity.getProperty('data.unspent_points')} CP
  </div>

  <div>Unspent Points</div>
  <Input path="data.unspent_points" type="number" />

  <div class="">Race</div>
  <div class="total">{totals.racialPoints}</div>

  <div class="">Attributes</div>
  <div class="total">{totals.attributePoints}</div>

  <div class="">Advantages</div>
  <div class="total">{totals.advantages}</div>

  <div class="">Disadvantages</div>
  <div class="total">{totals.disadvantages}</div>

  <div class="">Quirks</div>
  <div class="total">{totals.quirks}</div>

  <div class="">Skills</div>
  <div class="total">{totals.skills}</div>

  <div class="">Spells</div>
  <div class="total">{totals.spells}</div>

  <div class="thrust">Thrust</div>
  <div class="thrust total">{$GURPS.getThrustDamage()}</div>

  <div class="swing">Swing</div>
  <div class="swing total">{$GURPS.getSwingDamage()}</div>
</div>
