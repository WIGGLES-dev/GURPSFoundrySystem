<script>
  export let max;
  export let min = 0;
  export let current = 0;
  export let color = "red";
  export let height = 25;
  export let width = 150;
</script>

<style>
  .bar {
    background-color: transparent;
  }
  .bar-inner {
    display: flex;
    justify-content: center;
    height: 100%;
    border-radius: 10px;
  }
</style>

<div class="bar" style="height:{height}px; width:{width}px;">
  <div
    class="bar-inner"
    style="color: {color}; width:{(current - max) / max || 0}%">
    <span class="bar-text">{current} / {max}</span>
  </div>
</div>
