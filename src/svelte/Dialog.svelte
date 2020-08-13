<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let dialogOpen = false;
  let content;

  export let height = 800;
  export let width = 800;
  export let title = "???";
  export let buttons = {};
  export let defaultButton = null;
  export let onClose = new Function();

  function _onClose() {
    onClose();
    dialogOpen = false;
    dispatch("close");
  }

  function launchDialog(node, parameters) {
    const dialog = new Dialog(
      {
        title,
        buttons,
        button: defaultButton,
        close: _onClose,
        default: defaultButton,
      },
      {
        width,
        height,
      }
    );
    dialog._render(true).then((value) => {
      dialog.element.get(0).querySelector(".dialog-content").appendChild(node);
      dialogOpen = true;
    });
    return () => {
      return {
        destroy: () => {
          dialog.close();
          dialogOpen = false;
        },
      };
    };
  }
</script>

<style>
  .hidden {
    display: none;
  }
</style>

<div
  class:hidden={!dialogOpen}
  class="svelte-dialog"
  bind:this={content}
  use:launchDialog>
  <slot />
</div>
