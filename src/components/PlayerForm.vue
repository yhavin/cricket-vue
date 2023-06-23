<script setup>
  import { ref, toRefs } from "vue"


  const props = defineProps({
    teamOne: Array,
    teamTwo: Array,
    matchStarted: Boolean
  })

  const { teamOne, teamTwo, matchStarted } = toRefs(props)
  
  const emit = defineEmits(["addPlayer"])

  const defaultPlayer = {
    firstName: "",
    lastName: "",
    team: "",
    batting: [
      {
        innings: 1,
        isBatting: false,
        isOnStrike: false,
        isOut: false,
        runs: null,
        balls: null
      }
    ],
    bowling: [
      {
        innings: 1,
        isBowling: false,
        balls: null,
        runs: null,
        wickets: null
      }
    ]
  }
  
  const newPlayer = ref()
  newPlayer.value = { ...defaultPlayer }

  const handleSubmit = () => {
    emit("addPlayer", newPlayer)
    newPlayer.value = { ...defaultPlayer }
  }

</script>

<template>
  <article>
    <h2>Setup match</h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid">
        <input v-model="newPlayer.firstName" placeholder="First name" :disabled="matchStarted" required>
        <input v-model="newPlayer.lastName" placeholder="Last name" :disabled="matchStarted" required>
      </div>
      <fieldset>
        <label for="one">
          <input type="radio" id="one" value="one" v-model="newPlayer.team" :disabled="matchStarted">
          Team 1
        </label>
        <label for="two">
          <input type="radio" id="two" value="two" v-model="newPlayer.team" :disabled="matchStarted">
          Team 2
        </label>
      </fieldset>
      <button :disabled="matchStarted">Add player</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Team 1</th>
          <th>Team 2</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in teamOne.length > teamTwo.length ? teamOne : teamTwo" :key="index">
          <td>{{ teamOne[index]?.firstName }} {{ teamOne[index]?.lastName }}</td>
          <td>{{ teamTwo[index]?.firstName }} {{ teamTwo[index]?.lastName }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>