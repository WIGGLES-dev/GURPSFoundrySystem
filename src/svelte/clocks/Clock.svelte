<script>
  import { onMount, onDestroy } from "svelte";

  export let expires = null;
  export let currentTime = () => new Date().getTime();
  export let timePaused = 0;
  export let paused = true;

  $: isExpired = currentTime() > expires;
  $: timeRemaining = expires + timePaused - currentTime();

  let lastPausedAt;
  let interval;

  function pauseTimer() {
    lastPausedAt = currentTime();
    paused = true;
  }

  function startTimer() {
    timePaused += currentTime() - lastPaused;
    paused = false;
  }

  onMount(() => {
    interval = setInterval(() => {
      if (!paused) {
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<style>
</style>

<div class="clock">
  <span class="days">{Math.floor(timeRemaining / (1000 * 60 * 60 * 24))}</span>
  <span class="hours">
    {Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}
  </span>
  <span
    class="minutes">{Math.floor((timeRemaining % (1000 * 60)) / (1000 * 60))}</span>
  <span
    class="seconds">{Math.floor((timeRemaining % (1000 * 60)) / 1000)}</span>
</div>
<span on:click={pauseTimer} class="fas fa-pause" />
<span on:cick={startTimer} class="fas fa-play" />
