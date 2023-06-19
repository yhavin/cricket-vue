<script setup>
  import { ref, computed } from 'vue'

  let playerId = 0
  const newPlayer = ref({})

  const players = ref([
    { id: playerId++, firstName: "Yakir", lastName: "Havin", isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Reuvy", lastName: "Havin", isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Nochum", lastName: "Paltiel", isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Dovi", lastName: "Paltiel", isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Menachem", lastName: "Loebenstein", isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null }
  ])

  const addPlayer = () => {
    players.value.push({ id: playerId++, firstName: newPlayer.value.firstName, lastName: newPlayer.value.lastName })
    newPlayer.value = {}
  }

  const removePlayer = (player) => {
    players.value = players.value.filter((p) => p !== player)
  }

  const setIsBatting = (index) => {
    players.value[index].isBatting = true
  }

  const currentBatsmen = computed(() => {
    return players.value.filter(p => p.isBatting)
  })

  const onStrikeIndex = ref(1)

  const maxBatsmanIndex = ref(1)

  const toggleStrike = () => {
    let playerId = currentBatsmen.value[onStrikeIndex.value].id
    removeStrike(playerId)

    onStrikeIndex.value = 1 - onStrikeIndex.value
    playerId = currentBatsmen.value[onStrikeIndex.value].id
    setStrike(playerId)
  }

  const setStrike = (id) => {
    const player = currentBatsmen.value.find(p => p.id === id)
    player.isOnStrike = true
  }

  const removeStrike = (id) => {
    const player = currentBatsmen.value.find(p => p.id === id)
    player.isOnStrike = false
  }
  
  const matchStarted = ref(false)

  const startMatch = () => {
  matchStarted.value = true
  setIsBatting(0)
  setIsBatting(1)
  toggleStrike()
  }

  let ballId = 0
  const onStrikeId = ref('')
  const newBall = ref({})
  const balls = ref([])

  const addBall = (runs, index) => {
    const batter = currentBatsmen.value[index]
    balls.value.push({ id: ballId++, runs: runs, batterId: batter.id })
    batter.runs += runs
    batter.ballsFaced++
    totalRuns.value += runs

    if (runs % 2 === 1 || balls.value.length % 6 === 0) {
      toggleStrike()
    }
  }

  const addWicket = (index) => {
    addBall(0, index)
    const batter = currentBatsmen.value[index]
    batter.isOut = true
    batter.isBatting = false
    totalWickets.value++
    const nextBatter = players.value[maxBatsmanIndex.value + 1]
    maxBatsmanIndex.value++
    nextBatter.isBatting = true
  }

  const formatOvers = computed(() => {
    const completeOvers = Math.floor(balls.value.length / 6)
    const currentOverBalls = balls.value.length % 6
    return completeOvers + "." + currentOverBalls
  })

  const totalRuns = ref(0)

  const totalWickets = ref(0)
</script>

<template>
  <h1>Cricket Scoring</h1>
  <hr />
  <h3>Add players</h3>
  <form @submit.prevent="addPlayer">
    <input v-model="newPlayer.firstName" placeholder="First name">
    <input v-model="newPlayer.lastName" placeholder="Last name">
    <button>Add player</button>
  </form>
  <ol>
    <li v-for="player in players" :key="player.id">
      {{ player.firstName }} {{ player.lastName }}
      <button @click="removePlayer(player)">X</button>
    </li>
  </ol>

  <button @click="startMatch">Start match</button>

  <p>{{ matchStarted ? "Match started" : "Match not started" }}</p>

  <hr />

  <h3>Live scoring</h3>
  <h4>Current batsmen</h4>
  <ul>
    <li v-for="(player, index) in currentBatsmen" :key="player.id" :class="{'on-strike': index === onStrikeIndex}">
    <span :style="{fontWeight: index === onStrikeIndex ? 'bold' : 'normal'}">{{ player.firstName }} {{ player.lastName }}</span>
    </li>
  </ul>
  <table>
    <tr>
      <td><button @click="addBall(1, onStrikeIndex)">1</button></td>
      <td><button @click="addBall(2, onStrikeIndex)">2</button></td>
      <td><button @click="addBall(3, onStrikeIndex)">3</button></td>
      <td><button @click="addBall(4, onStrikeIndex)">4</button></td>
      <td><button @click="addBall(5, onStrikeIndex)">5</button></td>
      <td><button @click="addBall(6, onStrikeIndex)">6</button></td>
      <td><button @click="addWicket(onStrikeIndex)">W</button></td>
    </tr>
  </table>

  <hr />
  
  <h3>Scorecard</h3>
  <table v-if="matchStarted">
    <tr>
      <th>Player</th>
      <th>Out</th>
      <th>Runs</th>
      <th>Balls</th>
    </tr>
    <tr v-for="player in players">
      <td>{{ player.firstName }} {{ player.lastName }}</td>
      <td>{{ player.isOut ? player.isOut : null }}</td>
      <td>{{ player.runs }}</td>
      <td>{{ player.ballsFaced }}</td>
    </tr>
  </table>

  <strong v-if="matchStarted">Score: {{ totalWickets }}/{{ totalRuns }}</strong>
  <br />
  <strong v-if="matchStarted">Overs: {{ formatOvers }}</strong>

</template>

<style>
  .on-strike {
    font-weight: bold;
  }
</style>
