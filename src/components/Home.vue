<script setup>
  import { ref, computed } from 'vue'

  let playerId = 0
  const newPlayer = ref({})

  const players = ref([
    { id: playerId++, firstName: "Yakir", lastName: "Havin", gamesPlayed: [] },
    { id: playerId++, firstName: "Reuvy", lastName: "Havin", gamesPlayed: [] },
    { id: playerId++, firstName: "Nochum", lastName: "Paltiel", gamesPlayed: [] },
    { id: playerId++, firstName: "Dovi", lastName: "Paltiel", gamesPlayed: [] },
    { id: playerId++, firstName: "Menachem", lastName: "Loebenstein", gamesPlayed: [] }
  ])

  const addPlayer = () => {
    players.value.push({ id: playerId++, firstName: newPlayer.value.firstName, lastName: newPlayer.value.lastName })
    newPlayer.value = {}
  }

  const removePlayer = (player) => {
    players.value = players.value.filter((p) => p !== player)
  }

  const matchStarted = ref(false)

  const startMatch = () => {
  matchStarted.value = true
  console.log(matchStarted.value)
  }

  let ballId = 0
  const newBall = ref({})
  const balls = ref([])

  const addBall = (runs) => {
    balls.value.push({ id: ballId++, runs: runs.value })
  }
</script>

<template>
  <h1>Cricket Scoring</h1>
  <h3>Add players</h3>
  <form @submit.prevent="addPlayer">
    <input v-model="newPlayer.firstName" placeholder="First name">
    <input v-model="newPlayer.lastName" placeholder="Last name">
    <button>Add player</button>
  </form>
  <ul>
    <li v-for="player in players" :key="player.id">
      {{ player.firstName }} {{ player.lastName }}
      <button @click="removePlayer(player)">X</button>
    </li>
  </ul>

  <button @click="startMatch">Start match</button>

  <p>{{ matchStarted ? "Match started" : "Match not started" }}</p>

  <h3>Live scoring</h3>

  <table v-if="matchStarted">
    <tr>
      <th>Player</th>
      <th>Runs</th>
      <th>Balls</th>
    </tr>
    <tr v-for="player in players">
      <td>{{ player.firstName }} {{ player.lastName }}</td>
      <td></td>
      <td></td>
    </tr>
  </table>

  <strong v-if="matchStarted">Total runs: {{ sum(balls.runs) }}</strong>
</template>
