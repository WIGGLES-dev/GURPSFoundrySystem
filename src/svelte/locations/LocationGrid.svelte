<script>
    export let locations = [];
</script>

<style>
    .location-grid {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
    }
    .location {
        border: 1px solid black;
        height: 100%;
        width: 100%;
    }
</style>

<div class="location-grid">
    {#each locations as location}
        <div class="location"></div>
    {/each}
</div>