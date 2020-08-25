<script>
  import Dialog from "./Dialog";
  export let entity = null;
  let colorPickerInput = {};

  async function changeColor(e) {
    let update = await $entity.update({
      "flags.GURPS.background_color": colorPickerInput.backgroundColor.value,
      "flags.GURPS.text_color": colorPickerInput.textColor.value,
    });
  }

  async function setDefault() {
    let update = await $entity.update({
      "flags.GURPS.background_color": "",
      "flags.GURPS.text_color": "",
    });
  }

  $: colors = {
    textColor: $entity.getFlag("GURPS", "text_color"),
    backgroundColor: $entity.getFlag("GURPS", "background_color"),
  };

  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: "Change Color",
      callback: changeColor,
    },
    default: {
      icon: '<i class="fas fa-check"></i>',
      label: "Default",
      callback: setDefault,
    },
  };
</script>

<style>

</style>

<!-- svelte-ignore avoid-is -->
<Dialog on:close title="Color Picker" height={600} width={350} {buttons}>
  <div>
    <div>Row Background Color</div>
    <input
      value={colors.backgroundColor}
      name="row background color"
      type="text"
      is="colorpicker-input"
      bind:this={colorPickerInput.backgroundColor} />
  </div>
  <div>
    <div>Row Text Color</div>
    <input
      value={colors.textColor}
      name="row text color"
      type="text"
      is="colorpicker-input"
      bind:this={colorPickerInput.textColor} />
  </div>
</Dialog>
