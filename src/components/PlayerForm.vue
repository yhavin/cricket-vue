<script setup>
  import { ref, computed } from "vue"


  const props = defineProps({
    newPlayer: Object,
    addPlayer: Function
  })

  let { newPlayer, addPlayer } = props

</script>

<template>
  <article>
    <h2>Add players</h2>
    <form @submit.prevent="addPlayer">
      <div class="grid">
        <input v-model="newPlayer.firstName" placeholder="First name">
        <input v-model="newPlayer.lastName" placeholder="Last name">
      </div>
      <input type="radio" id="one" value="one" v-model="newPlayer.team">
      <label for="one">Team 1</label>
      <input type="radio" id="two" value="two" v-model="newPlayer.team">
      <label for="two">Team 2</label>
      <p></p>
      <button>Add player</button>
    </form>
  </article>
</template>