<script setup>
  import { ref, toRef } from "vue"


  const props = defineProps({
    matchStarted: Boolean
  })

  const matchStarted = toRef(props, "matchStarted")

  const emit = defineEmits(["startMatch", "addBall"])

  const handleStart = () => {
    emit("startMatch")
  }

  const handleAddBall = (runs, wicket=false) => {
    emit("addBall", runs, wicket)
  }

</script>

<template>
  <article>
    <h2>Scoring</h2>
    <button v-if="!matchStarted" @click="handleStart">Start match</button>

    <div class="grid">
      <button @click="handleAddBall(1)">1</button>
      <button @click="handleAddBall(2)">2</button>
      <button @click="handleAddBall(3)">3</button>
      <button @click="handleAddBall(4)">4</button>
      <button @click="handleAddBall(5)">5</button>
      <button @click="handleAddBall(6)">6</button>
      <button @click="handleAddBall(0, true)" class="contrast">W</button>
    </div>
  </article>
</template>