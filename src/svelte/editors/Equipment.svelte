<script>
  import { getContext } from "svelte";

  import {
    Select,
    Option,
    Checkbox,
    Textarea,
    RichTextEditor,
    Input,
  } from "../form/form";

  import { List, Row } from "../list/list";
  import WeaponEditor from "../WeaponEditor";

  export let entity = getContext("entity") || null;

  let editing = false;
</script>

<style>
  :global(label) {
    display: block;
  }
</style>

<Checkbox path="data.equipped" label="Equipped" />
<Input path="data.description" alsoUpdate={['name']} type="text" label="Name" />
<Input path="data.quantity" min="0" type="number" label="Quantity" />
<Input path="data.tech_level" type="text" label="Tech Level" />
<Input path="data.legality_class" type="text" label="Legality Class" />
<Input path="data.value" type="number" min="0" label="Value" />
<Input path="data.weight" type="number" min="0" label="Weight" />

<Textarea path="data.notes" label="Notes" cols="30" rows="1" />
<Input type="text" path="data.categories" label="categories" />
<RichTextEditor path="data.user_description" />

<List
  buttonLabel="Add Weapon"
  {entity}
  on:addlistitem={(e) => {
    $entity.addWeapon({
      type: 'melee_weapon',
      usage: 'bash skulls',
      damage: '1d6+3',
    });
  }}>
  <thead slot="header">
    <tr>
      <th />
      <th>type</th>
      <th>usage</th>
      <th>damage</th>
    </tr>
  </thead>
  {#each $entity.displayWeapons() as weapon, i (weapon._id)}
    <!-- svelte-ignore missing-declaration -->
    <Row
      colspan="4"
      {i}
      menuItems={() => [{ name: 'delete weapon', icon: '', condition: () => true, callback() {
            $entity.removeByPath('data.weapons', weapon._id);
          } }, { name: 'roll damage', icon: '', condition: () => true, callback() {
            alert('test');
          } }, { name: 'edit weapon', icon: '', condition: () => true, callback() {
            editing = i;
          } }]}>
      <td>{weapon.type}</td>
      <td>{weapon.usage}</td>
      <td>{weapon.damage}</td>
      <div slot="notes">{weapon.notes}</div>
      {#if editing === i}
        <WeaponEditor
          {entity}
          weapon={weapon.getGURPSObject()}
          {i}
          on:close={(e) => (editing = false)} />
      {/if}
    </Row>
  {/each}
</List>
