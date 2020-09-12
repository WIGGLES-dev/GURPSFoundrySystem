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
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
  }

  .totals :global(.GURPS-label input) {
    max-width: 50px;
  }

  .totals :global(.GURPS-label) {
    padding: 0px;
  }

  .total-points :global(input.total-points-input) {
    color: white;
  }

  .total-points .point-total-label {
    margin-right: auto;
  }

  .total {
    text-align: right;
    padding: 3px 0 3px 3px;
  }
  .span-2 {
    grid-column: 1 / span 2;
  }

  .total-points {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px;
    text-align: center;
  }
  .divider {
    grid-column: 1 / span 2;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  }
  .thrust,
  .swing {
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    grid-column: 1 / span 2;
  }
</style>

<div class="totals">
  <div class="span-2 total-points flex">
    <div class="point-total-label">Point Total</div>
    <Input
      path="data.point_total"
      type="number"
      classList="total-points-input" />
  </div>

  <div>Spent</div>
  <div class="total">{totals.total}</div>

  <div>Unspent Points</div>
  <div class="total">
    <input
      style="width: 50px;"
      type="number"
      disabled
      value={$entity.getProperty('data.point_total') - totals.total} />
  </div>

  <div class="divider" />

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

  <div class="thrust total">
    <span style="float: left;">Thrust:</span>
    {$GURPS.getThrustDamage()}
  </div>

  <div class="swing total">
    <span style="float: left;">Swing:</span>
    {$GURPS.getSwingDamage()}
  </div>

  <div class="hp">Hit Points</div>
  <div class="hp total">
    <Input path="data.pools.hit_points.value" type="number">
      <span slot="label-text-after">
        / {$GURPS.getAttribute('HP').calculateLevel()}
      </span>
    </Input>
  </div>

  <div class="fatigue">Fatigue Points</div>
  <div class="fatigue total">
    <Input path="data.pools.fatigue_points.value" type="number" min="0">
      <span slot="label-text-after">
        / {$GURPS.getAttribute('FP').calculateLevel()}
      </span>
    </Input>
  </div>
</div>
