<script>
  import { getContext } from "svelte";

  import { Input } from "./form/form";

  export let entity = getContext("entity") || null;
  export let GURPS = getContext("GURPS") || $entity._GURPS || null;

  $: totals = $GURPS.pointTotals();
</script>

<style>
  .column {
    display: flex;
    flex-direction: column;
  }
  .total {
    padding: 7px;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .point-total {
    display: flex;
    margin-left: auto;
  }
  .point-total .numbers {
    padding-right: 5px;
  }
</style>

<!-- <div>{totals.total + $entity.getProperty('data.unspent_points')}</div>
<Input path="data.unspent_points" type="number" /> -->
<div class="point-total">
  <div class="numbers column">
    <div class="total">{totals.racialPoints}</div>
    <div class="total">{totals.attributePoints}</div>
    <div class="total">{totals.advantages}</div>
    <div class="total">{totals.disadvantages}</div>
    <div class="total">{totals.quirks}</div>
    <div class="total">{totals.skills}</div>
    <div class="total">{totals.spells}</div>
    <div class="swing total">{$GURPS.getSwingDamage()}</div>
    <div class="thrust total">{$GURPS.getThrustDamage()}</div>
  </div>
  <div class="labels column">
    <div class="total">Race</div>
    <div class="total">Attributes</div>
    <div class="total">Advantages</div>
    <div class="total">Disadvantages</div>
    <div class="total">Quirks</div>
    <div class="total">Skills</div>
    <div class="total">Spells</div>
    <div class="total">Swing</div>
    <div class="total">Thrust</div>
  </div>
</div>
