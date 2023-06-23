<script setup>
  import { ref } from "vue"

  const emit = defineEmits(["addPlayer"])

  const newPlayer = ref({})

  const handleSubmit = () => {
    emit("addPlayer", newPlayer)
    newPlayer.value = {}
  }

</script>

<template>
  <article>
    <h2>Add players</h2>
    <form @submit.prevent="handleSubmit">
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