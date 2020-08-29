<script>
  export let ChatLog = null;

  let activeTab = 0;

  let tabs = [{ title: "Rolls" }];
</script>

<style>

</style>

<section class="sidebat-tab tab flexcol" id="chat" data-tab="chat">
  <nav class="tabs">
    {#each tabs as tab, i}
      <a class:active={activeTab === i} class="item" title={tab.title} />
    {/each}
  </nav>

  <ol id="chat-log" on:scroll={ChatLog._onchatKeyDown.bind(ChatLog)}>
    {#each ChatLog.collection.entries as message, i (message.id)}
      
    {/each}
  </ol>

  {#if !!!ChatLog.options.stream}
    <!-- svelte-ignore a11y-no-onchange -->
    <div id="chat-controls" class="flexrow">
      <div class="roll-type-select">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
          <i class="fas fa-dice-d20" />
        </label>
        <select
          name="rollMode"
          on:change={ChatLog._onChangeRollMode.bind(ChatLog)}>
          <optgroup label={CHAT.RollDefault}>
            {#each CONFIG.DicePool.rollModes as mode, i}
              <option value={mode.rt}>{mode.name}</option>
            {/each}
          </optgroup>
        </select>
      </div>
      {#if game.user.isGM}
        <div class="control-buttons">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="button export-log"
            title={CHAT.Export}
            on:click={ChatLog._onExportLog.bind(ChatLog)}>
            <i class="fas fa-save" />
          </a>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="delete button chat-flush"
            title={CHAT.Clear}
            on:click={ChatLog._onFlushLog.bind(ChatLog)}>
            <i class="fas fa-trash" />
          </a>
        </div>
      {/if}
    </div>
    <form id="chat-form">
      <textarea
        id="chat-message"
        autocomplete="nope"
        on:keydown={ChatLog._onchatKeyDown.bind(ChatLog)} />
    </form>
  {/if}
</section>
