<script setup>
  import { ref, computed } from "vue"
  import { db } from "../firebase.config.js"
  import { collection, addDoc, updateDoc } from "firebase/firestore"
  import PlayerForm from "./PlayerForm.vue"
  import Scoring from "./Scoring.vue"
  import BattingScoreboard from "./BattingScoreboard.vue"

  
  const collectionName = "matches"
  const collectionRef = collection(db, collectionName)
  
  const match = ref({
    date: "",
    result: "",
    balls: [],
    players: []
  })

  const matchId = ref()
  const matchStarted = ref(false)

  const handleAddPlayer = (player) => {
    match.value.players.push(player.value)
  }

  const teamOne = computed(() => {
    return match.value.players.filter(p => p.team === "one")
  })

  const teamTwo = computed(() => {
    return match.value.players.filter(p => p.team === "two")
  })

  const handleStartMatch = async () => {
    matchStarted.value = true
    match.value.date = new Date()
    const matchRef = await addDoc(collectionRef, match.value)
    matchId.value = matchRef.id
    console.log("Match started with ID", matchId.value)
  }
  
</script>

<template>
  <main class="container">
    <hgroup>
      <h1>Cricket Scoring</h1>
      <h3>Keep the score and lose the arguments</h3>
    </hgroup>
    
    <PlayerForm @addPlayer="handleAddPlayer" :teamOne="teamOne" :teamTwo="teamTwo" :matchStarted="matchStarted" />

    <Scoring :matchStarted="matchStarted" @startMatch="handleStartMatch" />
    
    <!-- <article>
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
      
    </article> -->
  </main>
  
</template>

<style>

</style>
