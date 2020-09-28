<script>
  import { Timer } from "@modules/timer/timer";
  import TimerDialog from "@components/dialogs/TimerDialog.svelte";
  import { onMount } from "svelte";
  import Message from "./Message";

  export let ChatLog = null;
  export let vanilla = false;
  export let messages = [];

  $: visibleMessages = (activeTab) => {
    if (vanilla) return messages;
    switch (activeTab) {
      case 0:
        return messages.filter(
          (message) =>
            message.roll || (message.isDiceRoll() && !message.isTimer())
        ); //rolls
      case 1:
        return messages.filter((message) => message.data.whisper.length); //whispers
      case 2:
        return messages.filter(
          (message) => !message.isOOC() && !message.isTimer()
        ); //ic messages
      case 3:
        return messages.filter(
          (message) => message.isOOC() && !message.isTimer()
        ); //ooc messages
      case 4:
        return messages.filter((message) => message.isTimer()); //timers
      default:
        return [];
    }
  };

  function createTimer(length) {
    new TimerDialog({
      target: document.body,
      props: {},
    }).$on("submit", (e) => {
      let timer = new Timer(length);
      ChatMessage.create({
        flags: {
          GURPS: {
            message_type: "timer",
            message_data: {
              timerLabel: e.detail,
              timerData: timer.toJSON(),
            },
            is_timer: true,
          },
        },
      });
    });
  }

  export let chatPanel;

  let tabs = ["Rolls", "Whispers", "IC", "OOC", "Timers"];
  let activeTab = 0;
</script>

<style>
  .chat-sidebar-tabs {
    display: flex;
    flex: none;
  }
  .chat-sidebar-tabs > .chat-item {
    text-align: center;
    padding: 3px;
    align-self: center;
    flex: 1;
  }
  .timers {
    display: flex;
    flex: none;
    padding-top: 5px;
  }
  .fa-clock {
    flex: 1;
    text-align: center;
  }
  .fa-clock:hover {
    color: red;
  }
  .active {
    box-shadow: 0 0 10px var(--foundry-accent-color);
  }
  .chat-log {
    margin: 0px;
    padding: 0px;
  }
</style>

<svelte:options accessors={true} />

<section
  class="active sidebar-tab tab flexcol"
  id="chat"
  data-tab="chat"
  bind:this={chatPanel}>
  {#if !vanilla}
    <div class="chat-sidebar-tabs">
      {#each tabs as tab, i (i)}
        <div
          on:click={() => (activeTab = i)}
          class="chat-item"
          class:active={i === activeTab}>
          {tab}
        </div>
      {/each}
    </div>
  {/if}

  {#if activeTab === 4}
    <div class="timers">
      <span class="fas fa-clock" on:click={() => createTimer(60000)}>1M</span>
      <span class="fas fa-clock" on:click={() => createTimer(300000)}>5M</span>
      <span class="fas fa-clock" on:click={() => createTimer(600000)}>10M</span>
      <span
        class="fas fa-clock"
        on:click={() => createTimer(1800000)}>30M</span>
      <span
        class="fas fa-clock"
        on:click={() => createTimer(3600000)}>60M</span>
    </div>
  {/if}

  <ol id="chat-log">
    {#each messages as message, i (message.id)}
      <Message {message} hide={!visibleMessages(activeTab).includes(message)} />
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
