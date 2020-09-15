<script>
  import { onMount } from "svelte";
  import Message from "./Message";

  export let ChatLog = null;
  export let messages = [];

  export let chatPanel;
  onMount(() => {
    //ChatLog.activateListeners(jQuery(chatPanel));
  });
</script>

<style>
</style>

<svelte:options accessors={true} />
<section
  class="active sidebar-tab tab flexcol"
  id="chat"
  data-tab="chat"
  bind:this={chatPanel}>
  <!-- <nav class="tabs">
    {#each tabs as tab, i}
      <a class:active={activeTab === i} class="item" title={tab.title} />
    {/each}
  </nav> -->

  <ol id="chat-log">
    {#each messages as message, i (message.id)}
      <Message {message} />
    {/each}
  </ol>

  {#if !!!ChatLog.options.stream}
    <!-- svelte-ignore a11y-no-onchange -->
    <div id="chat-controls" class="flexrow">
      <div class="roll-type-select">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label> <i class="fas fa-dice-d20" /> </label>
        <select value={game.settings.get('core', 'rollMode')} name="rollMode">
          <optgroup label={game.i18n.localize('CHAT.RollDefault')}>
            {#each Object.entries(CONFIG.Dice.rollModes) as [name, rt], i}
              <option value={name}>{game.i18n.localize(rt)}</option>
            {/each}
          </optgroup>
        </select>
      </div>
      {#if game.user.isGM}
        <div class="control-buttons">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="button export-log"
            title={game.i18n.localize('CHAT.Export')}>
            <i class="fas fa-save" />
          </a>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="delete button chat-flush"
            title={game.i18n.localize('CHAT.Clear')}>
            <i class="fas fa-trash" />
          </a>
        </div>
      {/if}
    </div>
    <form id="chat-form">
      <textarea id="chat-message" autocomplete="nope" />
    </form>
  {/if}
</section>
