<script setup>
  import { ref, computed } from "vue"


  const props = defineProps({
    matchStarted: Boolean
  })

  const { matchStarted } = props

  const emit = defineEmits(["startMatch"])

  const handleClick = () => {
    emit("startMatch")
  }

</script>

<template>
  <article>
    <h2>Scoring</h2>
    <button v-if="!matchStarted" @click="handleClick">Start match</button>
  </article>
</template>