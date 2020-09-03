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
  export let overrideSubmit = false;

  function _onClose() {
    let close = onClose();
    dispatch("close", close);
    dialogOpen = false;
  }

  async function launchDialog(node, parameters) {
    const dialog = new Dialog(
      {
        title,
        buttons,
        close: _onClose,
        default: defaultButton,
      },
      {
        width,
        height,
      }
    );

    if (overrideSubmit)
      dialog.submit = (button) => {
        try {
          if (button.callback) button.callback();
          dialog.close();
        } catch (err) {
          console.log(err);
        }
      };

    await dialog._render(true);
    dialog.element.get(0).querySelector(".dialog-content").appendChild(node);
    dialogOpen = true;
    dispatch("opened");

    return () => {
      return {
        destroy: () => {},
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
