<script>
    import {getContext} from "svelte";
    import Clock from "../clocks/Clock";

    export let entity = getContext("entity") || null;

    function addNewClock(duration = 36000000) {
        let timers = [...$entity.getProperty("data.timers") || [], {
            _id: randomID(),
            expires: new Date().getTime() + duration,
            timePaused: 0,
            paused: false
        }];
        $entity.update({"data.timers": duplicate(timers)})
    }
</script>

<style>

</style>

{#each $entity.getProperty("data.timers") || [] as {expires, timePaused = 0, paused = false, _id}, i (_id || i)}
    <Clock {expires} {timePaused} {paused}/>
{/each}
<button type="button" on:click={addNewClock}>New Clock</button>