<script>
  import { onMount, tick } from "svelte";
  import { createEventDispatcher, getContext } from "svelte";
  const dispatch = createEventDispatcher();

  import { asyncEnrichHTML } from "../../rich-text-editor";

  export let entity = getContext("entity") || null;
  export let path = null;
  export let secrets = true;
  export let entities = true;
  export let links = true;
  export let rolls = true;

  function getRollData() {
    let data = {
      data: {
        this: {
          ...$entity.data,
        },
        actor: $entity.actor
          ? {
              ...$entity.actor.data,
            }
          : null,
      },
    };
    return { data };
  }

  let RTE;
  let target;
  let value = getProperty($entity.data, path);

  const enrichHTML = (value) => {
    content = TextEditor.enrichHTML(value, {
      secrets: true,
      entities: true,
      links: true,
      rolls: true,
      rollData: getRollData(),
    });
    return content;
  };

  let content = enrichHTML(value) || "";

  export let editing = false;

  async function createEditorInstance() {
    let editor = await TextEditor.create(
      {
        target,
        save_onsavecallback() {
          editing = false;
          enrichHTML();
          dispatch("save");
        },
      },
      value || ""
    );
    RTE = editor[0];
    RTE.on("blur", (e) => {
      update(e.target.getContent());
    });
    editing = true;
  }

  async function update(value) {
    await $entity.update({ [path]: value });
    enrichHTML(value);
    dispatch("save");
  }
</script>

<style>
  .hidden {
    display: none;
  }
  .editor-content {
    min-height: 50px;
  }
</style>

<div style="width: 100%;">
  <div class="editor GURPS-rte">
    <div class:hidden={editing} class="editor-content">
      {#if content}
        {@html content}
      {:else}&ThinSpace;{/if}
    </div>
    <div class:hidden={!editing}>
      <div bind:this={target} />
    </div>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="editor-edit">
      <i
        class="fas fa-edit"
        on:click={async () => {
          await createEditorInstance();
          if (RTE) editing = true;
        }} />
    </a>
  </div>

  {#if editing}
    <button
      class="GURPS-rte"
      class:rte-edit={!editing}
      class:rte-save={editing}
      type="button"
      on:click={async (e) => {
        await update(RTE.getContent());
        RTE.remove();
        editing = false;
      }}>
      <i class="fas fa-feather-alt" />
      Save
    </button>
  {/if}
</div>
