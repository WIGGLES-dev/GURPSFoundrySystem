<script>
  import Bar from "../bars/bar";
  export let viewAs = "data";
  export let location = null;
  export let maxHP = null;
</script>

<style>
</style>

<div class="hit-location">
  {#if viewAs === 'data'}
    <span>{location.name}</span>
  {:else if viewAs === 'injury'}
    <Bar
      max={maxHP / location.crippleRatio}
      current={maxHP - location.damageTaken} />
  {/if}
</div>
