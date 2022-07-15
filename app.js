const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      roundNumber: 0,
      lastSpecialRoundNumber: null,
      winner: null,
      logMessages: []
    }
  },
  computed: {
    monsterHealthBarStyles() {
      if (this.monsterHealth <= 0) {
        return {width: '0%'}
      }
      return {width: this.monsterHealth + '%'}
    },
    playerHealthBarStyles() {
      if (this.playerHealth <= 0) {
        return {width: '0%'}
      }
      return {width: this.playerHealth + '%'}
    },
    specialAttackButtonCooldown() {
      if (this.lastSpecialRoundNumber && this.roundNumber - this.lastSpecialRoundNumber <= 3) {
        return true
      }
    }
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw'
      } else if (value <= 0) {
        this.winner = 'monster'
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'draw'
      } else if (value <=0) {
        this.winner = 'player'
      }
    },
    logMessages: {
      handler(value) {
        if (value.length > 14) {
          console.log('lol')
          this.logMessages = this.logMessages.slice(0, 14)
        }
      },
      deep: true
    }
  },
  methods: {
    playerAttacks() {
      this.roundNumber++
      const attackValue = this.generateRandomValue(7, 12);
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attack', attackValue)
      this.monsterAttacks()
    },
    specialAttack() {
      this.roundNumber++
      const attackValue = this.generateRandomValue(12, 18)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attack', attackValue)
      this.monsterAttacks()
      this.lastSpecialRoundNumber = this.roundNumber
    },
    playerHeals() {
      this.roundNumber++
      const healValue = this.generateRandomValue(8, 17)
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100
      } else {
       this.playerHealth += healValue
      }
      this.addLogMessage('player', 'heal', healValue)
      this.monsterAttacks()
    },
    playerSurrenders() {
      this.winner = 'monster'
    },
    monsterAttacks() {
      const attackValue = this.generateRandomValue(10, 15)
      this.playerHealth -= attackValue
      this.addLogMessage('monster', 'attack', attackValue)
    },
    resetGame() {
      this.monsterHealth = 100
      this.playerHealth = 100
      this.roundNumber = 0
      this.winner = null
      this.lastSpecialRoundNumber = null
      this.logMessages = []
    },
    addLogMessage(player, action, value) {
      this.logMessages.unshift({
        player: player,
        action: action,
        value: value
      })
    },
    generateRandomValue(min, max) {
      return Math.round(Math.random() * (max - min) + min)
    }
  }
})

app.mount('#game')