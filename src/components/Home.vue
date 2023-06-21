<script setup>
  import { ref, computed } from 'vue'

  let playerId = 0
  const newPlayer = ref({})

  const players = ref([
    { id: playerId++, firstName: "Shane", lastName: "Warne", team: 1, isBatting: false, isOnStrike: false, isOut: false, outString: null, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Ricky", lastName: "Ponting", team: 1, isBatting: false, isOnStrike: false, isOut: false, outString: null, runs: null, ballsFaced: null },
    { id: playerId++, firstName: "Adam", lastName: "Gilchrist", team: 1, isBatting: false, isOnStrike: false, isOut: false, outString: null, runs: null, ballsFaced: null },
  ])

  const teamOne = computed(() => {
    return players.value.filter(p => p.team === 1)
  })

  const teamTwo = computed(() => {
    return players.value.filter(p => p.team === 2)
  })

  const addPlayer = () => {
    players.value.push({ id: playerId++, firstName: newPlayer.value.firstName, lastName: newPlayer.value.lastName, team: Number(newPlayer.value.team), isBatting: false, isOnStrike: false, isOut: false, outString: null, runs: null, ballsFaced: null })
    newPlayer.value = {}
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
  const reversedBalls = computed(() => balls.value.slice().reverse())

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

  const formatBall = (ball) => {
    // Used 6.01 in following lines so that last ball of over is x.6 and next is x+1.1
    const currentOverNumber = Math.floor((ball.id + 1) / 6.01)
    const currentOverBalls = ((ball.id + 1) % 6.01).toFixed()
    const formattedBallInOver = currentOverNumber + "." + currentOverBalls
    const batter = players.value.filter(p => p.id === ball.batterId)[0]
    if (!ball.isWicket) {
      return `${formattedBallInOver}: ${batter.firstName} ${batter.lastName}, ${ball.runs} runs`
    } else {
      return `${formattedBallInOver}: ${batter.firstName} ${batter.lastName} is out`
    }
  }

  const totalRuns = ref(0)

  const totalWickets = ref(0)

</script>

<template>
  <main class="container">
    <hgroup>
      <h1>Cricket Scoring</h1>
      <h3>Keep the score and lose the arguments</h3>
    </hgroup>
    
    <article>
      <h2>Add players</h2>
      <form @submit.prevent="addPlayer">
        <div class="grid">
          <input v-model="newPlayer.firstName" placeholder="First name">
          <input v-model="newPlayer.lastName" placeholder="Last name">
          <input v-model="newPlayer.team" placeholder="Team">
        </div>
        <button>Add player</button>
      </form>
    </article>
    
    <article>
      <h2>Teams</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">Team 1</th>
              <th scope="col">Team 2</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in teamOne.length > teamTwo.length ? teamOne : teamTwo" :key="index">
              <td>{{ teamOne[index]?.firstName }} {{ teamOne[index]?.lastName }}</td>
              <td>{{ teamTwo[index]?.firstName }} {{ teamTwo[index]?.lastName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button v-if="!matchStarted" @click="startMatch">Start match</button>
    </article>
    
    <article>
      <h2>Live scoring</h2>
      <ul>
        <li v-for="(player, index) in currentBatsmen" :key="player.id" :class="{'on-strike': index === onStrikeIndex}">
        <span :style="{fontWeight: index === onStrikeIndex ? 'bold' : 'normal'}">{{ player.firstName }} {{ player.lastName }}: {{ player.runs }} ({{ player.ballsFaced }})</span>
        </li>
      </ul>

      <div class="grid">
        <button @click="addBall(0, onStrikeIndex)">0</button>
        <button @click="addBall(1, onStrikeIndex)">1</button>
        <button @click="addBall(2, onStrikeIndex)">2</button>
        <button @click="addBall(3, onStrikeIndex)">3</button>
        <button @click="addBall(4, onStrikeIndex)">4</button>
        <button @click="addBall(5, onStrikeIndex)">5</button>
        <button @click="addBall(6, onStrikeIndex)">6</button>
        <button @click="addWicket(onStrikeIndex)" class="contrast">W</button>
      </div>
    </article>
    
    <article>
      <h2>Scorecard</h2>
      <div>
        <table v-if="matchStarted" role="grid">
          <thead>
            <tr>
              <th scope="col">Player</th>
              <th style="text-align: center" scope="col">Status</th>
              <th style="text-align: center" scope="col">Runs</th>
              <th style="text-align: center" scope="col">Balls</th>
              <th style="text-align: center" scope="col">S/R</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in teamOne">
              <td>{{ player.firstName }} {{ player.lastName }}</td>
              <td style="text-align: center">{{ player.isOut ? "out" : player.isBatting ? "not out" : null }}</td>
              <td style="text-align: center">{{ player.runs }}</td>
              <td style="text-align: center">{{ player.ballsFaced }}</td>
              <td style="text-align: center">{{ player.ballsFaced !== null ? ((player.runs / player.ballsFaced) * 100).toFixed(2) : null}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <span v-if="matchStarted">Score: {{ totalWickets }}/{{ totalRuns }}</span>
      <br />
      <span v-if="matchStarted">Overs: {{ formatOvers }}</span>
      <br />
      <span v-if="matchStarted">This over: {{ thisOver.join(", ") }}</span>
    </article>
    
    <article>
      <h2>Ball-by-ball</h2>
      <details>
        <summary role="button" class="secondary">Expand</summary>
        <ul>
          <article v-for="ball in reversedBalls">
            {{ formatBall(ball) }}
          </article>
        </ul>
      </details>
      
    </article>
  </main>
  
</template>

<style>

</style>
