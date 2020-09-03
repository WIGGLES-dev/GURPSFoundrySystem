<script>
  import { getContext } from "svelte";
  import { Select, Option, Input } from "../../form/form";
  import { FeatureType } from "g4elogic";
  import { features } from "process";

  export let entity = getContext("entity") || null;
</script>

<style>
  .features-list {
    position: relative;
  }
  .features-list :global(.GURPS-label) {
    padding: 2px 5px 2px 5px;
  }
  .flex:not(.topmost) {
    margin-left: 45px;
  }
  .feature {
    padding-bottom: 20px;
    position: relative;
  }
  .list-interface {
    position: absolute;
    top: 15px;
    right: 15px;
  }
</style>

<div class="features-list">
  {#if $entity.getFeatures().length === 0}
    <span
      class="fas fa-plus-square list-interface"
      on:click={() => $entity.addFeature()} />
  {/if}
  {#each $entity.getFeatures() as feature, i (feature._id)}
    <div class="feature">
      <div class="list-interface">
        <span
          class="fas fa-minus-square"
          on:click={() => $entity.removeByPath('data.features', feature._id)} />
        <span
          class="fas fa-plus-square"
          on:click={() => $entity.addFeature()} />
      </div>
      <div class="flex topmost">
        <Select path="data.features" array={{ index: i, property: 'type' }}>
          <Option value={FeatureType.attributeBonus}>
            Gives an attribute bonus of
          </Option>
          <Option value={FeatureType.damageResistanceBonus}>
            Gives a DR bonus of
          </Option>
          <Option value={FeatureType.reactionBonus} disabled={true}>
            Gives a reaction modifier of
          </Option>
          <Option value={FeatureType.skillBonus}>
            Gives a skill level bonus of
          </Option>
          <Option disabled={true}>Gives a skill point bonus of</Option>
          <Option value={FeatureType.SpellBonus} disabled={true}>
            Gives spell level bonus of
          </Option>
          <Option disabled={true}>Gives a spell point bonus of</Option>
          <Option value={FeatureType.weaponDamageBonus} disabled={true}>
            Gives a weapon damage bonus of
          </Option>
          <Option value={FeatureType.costReduction} disabled={true}>
            Reduces the attribute cost of
          </Option>
        </Select>
        <Input
          type="number"
          path="data.features"
          array={{ index: i, property: 'amount' }} />
        <Select
          path="data.features"
          array={{ index: i, property: 'per_level' }}>
          <Option value="false" />
          <Option value="true">per level</Option>
        </Select>
      </div>
      {#if feature.type === FeatureType.attributeBonus}
        <div class="flex">
          <Select
            path="data.features"
            array={{ index: i, property: 'attribute' }}>
            <Option value="ST">to ST</Option>
            <Option value="DX">to DX</Option>
            <Option value="IQ">to IQ</Option>
            <Option value="HT">to HT</Option>
          </Select>
          {#if feature.attribute === 'ST'}
            <Select disabled={true}>
              <Option>for lifting only</Option>
              <Option>for striking only</Option>
            </Select>
          {/if}
        </div>
      {:else if feature.type === FeatureType.skillBonus}
        <div class="flex">
          <Select disabled={true}>
            <Option>to skills whose name</Option>
          </Select>
          <Select
            defaultValue="is"
            path="data.features"
            array={{ index: i, property: 'name_compare_type' }}>
            <Option value="is_anything">is anything</Option>
            <Option value="is">is</Option>
            <Option value="is_not">is not</Option>
            <Option value="contains">contains</Option>
            <Option value="does_not_contain">does not contain</Option>
            <Option value="starts_with">starts with</Option>
            <Option value="does_not_start_with">does not start with</Option>
            <Option value="ends_with">ends with</Option>
            <Option value="does_not_end_with">does not end with</Option>
          </Select>
          <Input path="data.features" array={{ index: i, property: 'name' }} />
        </div>

        <div class="flex">
          <Select
            defaultValue="is"
            optionPreface="and specialization"
            path="data.features"
            array={{ index: i, property: 'specialization_compare_type' }}>
            <Option value="is_anything">is anything</Option>
            <Option value="is">is</Option>
            <Option value="is_not">is not</Option>
            <Option value="contains">contains</Option>
            <Option value="does_not_contain">does not contain</Option>
            <Option value="starts_with">starts with</Option>
            <Option value="does_not_start_with">does not start with</Option>
            <Option value="ends_with">ends with</Option>
            <Option value="does_not_end_with">does not end with</Option>
          </Select>
          <Input
            path="data.features"
            array={{ index: i, property: 'specialization' }} />
        </div>
      {:else if feature.type === FeatureType.damageResistanceBonus}10{/if}
    </div>
  {/each}
</div>
