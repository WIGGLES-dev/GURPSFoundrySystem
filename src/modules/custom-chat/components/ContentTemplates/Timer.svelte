<script>
  import { onMount, onDestroy } from "svelte";
  import { Timer } from "@modules/timer/timer";
  export let message = null;
  const { timerData, timerLabel } = message.getFlag("GURPS", "message_data");
  let timer = Timer.fromJSON(timerData);

  let interval;
  onMount(() => {
    interval = setInterval(() => {
      if (timer.isFinished()) {
        clearInterval(interval);
      }
      timer = timer;
    }, 1000);
  });
  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<style>
  .expired {
    background-color: red;
  }
  .timer {
    padding: 8px;
    display: flex;
  }
  .control {
    padding-left: 10px;
  }
  .control:hover {
    color: red;
  }
</style>

<div class="timer" class:expired={timer.isFinished()}>
  <span class="minutes">{timer.minutesRemaining()}</span>: <span
    class="seconds">{timer.secondsRemaining()}</span>
</div>
<div class="timer-label">{timerLabel}</div>
<!-- <div class="timer-controls">
  <span class="control pause fas fa-pause" on:click={() => timer.pause()} />
  <span class="control start fas fa-play" on:click={() => timer.start()} />
  <span class="control reset fas fa-refresh" on:click={() => timer.restart()} />
</div> -->
