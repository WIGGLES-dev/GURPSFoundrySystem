<script>
  import { Tabs, TabList, Tab, TabPanel } from "../tabs/tabs";
  import { getContext, onMount, onDestroy } from "svelte";
  const GT = game.Gametime;
  const DTC = GT.DTC;
  export let entity = getContext("entity") || null;
  export let calendar = "Gregorian";

  let CD = GT.DTNow();

  let onDestroyId = game.Gametime.doEvery({ seconds: 30 }, () => {
    CD = GT.DTNow();
  });

  $: isLeapYear = (yearNow = CD.years) => DTC.isLeapYear(yearNow);

  onDestroy(() => {
    game.Gametime.clearTimeout(onDestroyId || "");
  });
</script>

<style>
  .calendar {
    /* display: grid; */
  }
  .weekday-list {
    display: flex;
  }
  .weekday {
    flex: 1;
  }
  .month-days {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  .day {
    width: 100%;
    height: 40px;
    border: 1px solid black;
  }
</style>

<div class="calendar">
  <div class="current-month">???</div>
  <div class="weekday-list">
    {#each DTC.weekDays as day, i (day)}
      <div class="weekday">{day}</div>
    {/each}
  </div>
  <div class="month-days">
    {#each new Array(DTC.dpm[CD.months][isLeapYear() ? 0 : 1]) as placeholder, i (i)}
      <div class="day">{i + 1}</div>
    {/each}
  </div>
</div>
