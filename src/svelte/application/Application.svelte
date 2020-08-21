<script>
  export let app = null;
  export let content = null;

  let header;
  let appHTML;

  export function getHTML() {
    return appHTML;
  }
</script>

<style>

</style>

<div class="app window-app" data-appid={app.appId} bind:this={appHTML}>
  <!-- svelte-ignore a11y-missing-attribute -->
  <header bind:this={header}>
    <h4 class="window-title">{app.title}</h4>
    {#each app._getHeaderButtons() as button, i}
      <a class={app.classes.join('')}>
        <i>{app.label}</i>
      </a>
    {/each}
  </header>
  <section class="window-content">
    <svelte:component this={content} />
  </section>
</div>
