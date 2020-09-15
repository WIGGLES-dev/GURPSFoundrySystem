<script>
  import SuccessRoll from "gurps-foundry-roll-lib/src/js/Roll/SuccessRoll";

  import Damage from "@components/chat/Damage";
  import Skill from "@components/chat/Skill";

  export let message = null;

  let sender = game.users.get(message.data.user);
  let userAvatar = sender.avatar;
  let aliasAvatar = sender.character
    ? sender.character.getProperty("img")
    : null;

  let avatar = aliasAvatar || userAvatar;

  let isWhisper = getProperty(message, "data.whisper.length");
  let whisperTo = message.data.whisper.map((u) => {
    let user = game.users.get(u);
    return user ? user.name : null;
  });
  let isVisible = message.isContentVisible;
  let flavor = null;
  let alias = null;
  let borderColor =
    message.data.type === CONST.CHAT_MESSAGE_TYPES.OOC
      ? message.user.color
      : null;
  if (!isVisible) {
    isWhisper = false;
    flavor = `${this.user.name} privately rolled some dice`;
    alias = message.user.name;
  }
  let hasHTMLContent = message.data.content.startsWith("<");

  export let rollComponent = false;
  export let rollData = null;

  function getRollComponent(type) {
    switch (type) {
      case "Damage":
        return Damage;
    }
  }
</script>

<style>
</style>

{#if isVisible}
  <li
    style="border-color: {borderColor};"
    class="message flexcol"
    class:ic={window.CONST.CHAT_MESSAGE_TYPES.IC}
    class:emote={window.CONST.CHAT_MESSAGE_TYPES.EMOTE}
    class:whisper={isWhisper}
    class:blind={message.data.blind}
    data-message-id={message._id}>
    <header class="message-header flexrow">
      <h4 class="message-sender">{message.alias}</h4>
      <span class="message-metadata">
        <time
          class="message-timestamp">{window.timeSince(message.data.timestamp)}</time>
        {#if window.game.user.isGM}
          <a class="button message-delete"> <i class="fas fa-trash" /></a>
        {/if}
      </span>
      {#if isWhisper}
        <span class="whisper-to">{game.i18n.localize('CHAT.To')}: {whisperTo}</span>
      {/if}
      {#if message.data.flavor}
        <span class="flavor-text">{message.data.flavor}</span>
      {/if}
    </header>
    <div class="message-content">
      {#if message.rollType()}
        <svelte:component
          this={getRollComponent(message.rollType())}
          {message}
          {rollData} />
      {:else if message.roll}
        {#await message.roll.render() then roll}
          {@html roll}
        {/await}
      {:else if hasHTMLContent || (message.data.content && !rollComponent)}
        {@html message.data.content}
      {/if}
    </div>
  </li>
{/if}
