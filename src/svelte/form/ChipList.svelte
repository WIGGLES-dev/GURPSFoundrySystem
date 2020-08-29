<script>
  import { createEventDispatcher, getContext, tick } from "svelte";
  import { Input } from "./form";
  import { customUpdate } from "../../helpers";

  export let entity = getContext("entity") || null;
  export let path = null;
  export let label = false;
</script>

<style>
  .chip {
    display: inline-block;
    padding: 0 3px;
    font-size: 16px;
    border-radius: 3px;
    background-color: #f1f1f1;
  }

  .closebtn {
    padding-left: 10px;
    color: #888;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
  }
</style>

<label for="">
  <div>
    {label}
    <span
      class="fas fa-plus-square"
      on:click={async () => {
        let list = $entity.getProperty(path) || [];
        console.log($entity, path, list);
        list.push('');
        await $entity.update({ [path]: duplicate(list) });
        $entity.render();
      }} />
  </div>
  {#each $entity.getProperty(path) || [] as chip, i (i)}
    <div class="chip">
      <Input {entity} {path} array={{ index: i }}>
        <span
          slot="label-text-after"
          class="closebtn"
          on:click={async () => {
            let list = $entity.getProperty(path);
            list.splice(i, 1);
            await $entity.update({ [path]: duplicate(list) });
            $entity.render();
          }}>
          &times;
        </span>
      </Input>
    </div>
  {/each}
</label>
