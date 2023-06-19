<script setup>
  import { ref, computed } from 'vue'

  let playerId = 0
  const newPlayer = ref({})

  const players = ref([
    { id: playerId++, firstName: "Player", lastName: "1", team: 1, isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Player", lastName: "2", team: 1, isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Player", lastName: "3", team: 1, isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Player", lastName: "4", team: 2, isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Player", lastName: "5", team: 2, isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Player", lastName: "6", team: 2, isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null }
  ])

  const teamOne = computed(() => {
    return players.value.filter(p => p.team === 1)
  })

  const teamTwo = computed(() => {
    return players.value.filter(p => p.team === 2)
  })

  const addPlayer = () => {
    players.value.push({ id: playerId++, firstName: newPlayer.value.firstName, lastName: newPlayer.value.lastName, team: Number(newPlayer.value.team), isBatting: false, isOnStrike: false, isOut: false, runs: null, ballsFaced: null })
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

  const thisOver = computed(() => {
    const currentOverBalls = balls.value.length % 6
    const thisOverBallObjects = balls.value.slice(-currentOverBalls)
    const runsThisOver = thisOverBallObjects.map(ball => ball.isWicket ? "W" : ball.runs)
    return runsThisOver
  })

  const addBall = (runs, index, isWicket=false) => {
    const batter = currentBatsmen.value[index]
    balls.value.push({ id: ballId++, runs: runs, batterId: batter.id, isWicket: isWicket })
    batter.runs += runs
    batter.ballsFaced++
    totalRuns.value += runs

    if (runs % 2 === 1) {
      toggleStrike()
    }

    if (balls.value.length % 6 === 0) {
      toggleStrike()
    }
  }

  const addWicket = (index) => {
    addBall(0, index, true)
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
  <h2>Add players</h2>
  <form @submit.prevent="addPlayer">
    <input v-model="newPlayer.firstName" placeholder="First name">
    <input v-model="newPlayer.lastName" placeholder="Last name">
    <input v-model="newPlayer.team" placeholder="Team">
    <button>Add player</button>
  </form>
  <br />

  <table class="table-outline">
    <tr>
      <th class="table-outline">Team 1</th>
      <th class="table-outline">Team 2</th>
    </tr>
    <tr v-for="(player, index) in teamOne.length > teamTwo.length ? teamOne : teamTwo" :key="index">
      <td class="table-outline">{{ teamOne[index]?.firstName }} {{ teamOne[index]?.lastName }}</td>
      <td class="table-outline">{{ teamTwo[index]?.firstName }} {{ teamTwo[index]?.lastName }}</td>
    </tr>
  </table>

  <hr />

  <h2>Live scoring</h2>
  <h4>Current batsmen</h4>
  <ul>
    <li v-for="(player, index) in currentBatsmen" :key="player.id" :class="{'on-strike': index === onStrikeIndex}">
    <span :style="{fontWeight: index === onStrikeIndex ? 'bold' : 'normal'}">{{ player.firstName }} {{ player.lastName }}: {{ player.runs }} ({{ player.ballsFaced }})</span>
    </li>
  </ul>
  <h4>Enter ball event</h4>
  <table>
    <tr>
      <td><button @click="addBall(0, onStrikeIndex)">0</button></td>
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
  
  <h2>Scorecard</h2>
  <button @click="startMatch">{{ matchStarted ? "End match" : "Start match" }} </button>
  <br />
  <br />
  <table v-if="matchStarted" class="table-outline">
    <tr>
      <th class="table-outline">Player</th>
      <th class="table-outline">Out</th>
      <th class="table-outline">Runs</th>
      <th class="table-outline">Balls</th>
    </tr>
    <tr v-for="player in teamOne">
      <td class="table-outline">{{ player.firstName }} {{ player.lastName }}</td>
      <td class="table-outline">{{ player.isOut ? player.isOut : null }}</td>
      <td class="table-outline">{{ player.runs }}</td>
      <td class="table-outline">{{ player.ballsFaced }}</td>
    </tr>
  </table>
  <br />

  <strong v-if="matchStarted">Score: {{ totalWickets }}/{{ totalRuns }}</strong>
  <br />
  <strong v-if="matchStarted">Overs: {{ formatOvers }}</strong>
  <br />
  <strong v-if="matchStarted">This over: {{ thisOver.join(", ") }}</strong>

</template>

<style>
  .on-strike {
    font-weight: bold;
  }
</style>
