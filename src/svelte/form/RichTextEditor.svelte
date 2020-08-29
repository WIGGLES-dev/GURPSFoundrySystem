<script>
  import { onMount, onUpdate } from "svelte";
  import { createEventDispatcher, getContext } from "svelte";
  const dispatch = createEventDispatcher();

  export let entity = getContext("entity") || null;
  export let path = null;
  export let secrets = true;
  export let entities = true;
  export let links = true;
  export let rolls = true;
  export let title = "???";

  let target;
  let value = $entity.getProperty(path) || "";

  const enrichHTML = (value) => {
    content = TextEditor.enrichHTML(value, {
      secrets: true,
      entities: true,
      links: true,
      rolls: true,
    });
    return content;
  };

  let content = enrichHTML(value);

  export let editing = false;

  onMount(async () => {});

  const createEditorInstance = async (target) => {
    let RTE = await TextEditor.create(
      {
        target,
        save_onsavecallback() {
          try {
            update(this.getContent());
          } catch (err) {}
        },
      },
      value || ""
    );
    return RTE[0];
  };

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
  <h2>{title}</h2>
  <div class="editor">
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
          await createEditorInstance(target);
          editing = true;
        }} />
    </a>
  </div>

  {#if editing}
    <button
      class:rte-edit={!editing}
      class:rte-save={editing}
      type="button"
      on:click={async (e) => {
        editing = false;
      }}>
      <i class="fas fa-feather-alt" />
      View As Text
    </button>
  {/if}
</div>
