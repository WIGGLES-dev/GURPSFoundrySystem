<script>
  import { getContext } from "svelte";
  import { RichTextEditor, Input, FilePicker } from "./form/form";
  import { Signature } from "g4elogic";

  export let entity = getContext("entity") || null;
  const GURPS = getContext("GURPS");
</script>

<style>
  .attributes {
    display: grid;
    grid-template-rows: repeat(auto, 60px);
    grid-template-columns: repeat(1, 75px);
    background-color: rgba(0, 0, 0, 0.05);
    gap: 2px;
  }
  .attribute {
    border: 1px solid black;
  }
  .attribute :global(.GURPS-label input) {
    max-width: 50px;
  }
</style>

<div class="attributes strength">
  <div class="attribute">
    <Input
      mod={$GURPS.getAttribute(Signature.ST).getMod()}
      path="data.attributes.strength"
      min="0"
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('ST').pointsSpent()}] ST:
      </span>
    </Input>
  </div>
  <div class="attribute dexterity">
    <Input
      mod={$GURPS.getAttribute(Signature.DX).getMod()}
      path="data.attributes.dexterity"
      min="0"
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('DX').pointsSpent()}] DX:
      </span>
    </Input>
  </div>
  <div class="attribute intelligence">
    <Input
      mod={$GURPS.getAttribute(Signature.IQ).getMod()}
      path="data.attributes.intelligence"
      min="0"
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('IQ').pointsSpent()}] IQ:
      </span>
    </Input>
  </div>
  <div class="attribute health">
    <Input
      mod={$GURPS.getAttribute(Signature.HT).getMod()}
      path="data.attributes.health"
      min="0"
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('HT').pointsSpent()}] HT:
      </span>
    </Input>
  </div>
  <div class="attribute move">
    <Input
      path="data.attributes.move"
      type="number"
      basedOn={$GURPS
        .getAttribute('Move')
        .calculateLevel() - $entity.getProperty('data.attributes.move')}>
      <span slot="label-text">
        [{$GURPS.getAttribute('Move').pointsSpent()}] Move:
      </span>
    </Input>
  </div>
  <div class="attribute speed">
    <Input
      path="data.attributes.speed"
      step="0.25"
      min={0}
      basedOn={$GURPS
        .getAttribute('Speed')
        .calculateLevel() - $entity.getProperty('data.attributes.speed')}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('Speed').pointsSpent()}] Speed:
      </span>
    </Input>
  </div>
  <div class="attribute will">
    <Input
      let:value
      path="data.attributes.will"
      basedOn={$entity.getProperty('data.attributes.intelligence')}
      min={0}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('Will').pointsSpent()}] Will:
      </span>
    </Input>
  </div>
  <div class="attribute perception">
    <Input
      path="data.attributes.perception"
      min={0}
      basedOn={$entity.getProperty('data.attributes.intelligence')}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('Per').pointsSpent()}] Per:
      </span>
    </Input>
  </div>
  <div class="attribute hitpoints">
    <Input
      path="data.attributes.hit_points"
      min={0}
      basedOn={$entity.getProperty('data.attributes.strength')}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('HP').pointsSpent()}] HP:
      </span>
    </Input>
  </div>
  <div class="attribute fatigue">
    <Input
      path="data.attributes.fatigue_points"
      min={0}
      basedOn={$entity.getProperty('data.attributes.health')}
      type="number">
      <span slot="label-text">
        [{$GURPS.getAttribute('FP').pointsSpent()}] FP:
      </span>
    </Input>
  </div>
</div>
