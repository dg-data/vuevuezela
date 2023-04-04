import Vue from 'https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm.browser.min.js'
//import defaultAxios from 'https://raw.githubusercontent.com/bundled-es-modules/axios/master/axios.js' //'https://unpkg.com/axios/dist/axios.min.js'
import axios from 'https://cdn.skypack.dev/axios'
import {
    MainTemplate
} from './templates/main-template.js'
//const axios = defaultAxios;
Vue.use(VueRouter)
/*
const router = new VueRouter({
  routes: [{
    path: '/about',
    component: About,
    name: "About Us Page"
  }]
})

new Vue({
    el: '#app',
    components: {
        'navbar': Navbar
    },
    router,
    template: MainTemplate
})
const axios = require('axios')
*/
new Vue({ //export default {
  el: '#app',
  template: MainTemplate,
  computed: {
    // team names

    home () {
      return this.results.g.hls.ta
    },
    visitor () {
      return this.results.g.vls.ta
    },
    // player stats if played

    hPlayers () {
      var self = this
      return typeof (this.results.g.hls.pstsg) !== 'undefined' ? self.results.g.hls.pstsg.filter(
        function (player) {
          return player.min !== 0
        }
      ) : null
    },
    vPlayers () {
      var self = this
      return typeof (this.results.g.vls.pstsg) !== 'undefined' ? self.results.g.vls.pstsg.filter(
        function (player) {
          return player.min !== 0
        }
      ) : null
    },
    // team totals

    hTotals () {
      return this.results.g.hls.tstsg
    },
    vTotals () {
      return this.results.g.vls.tstsg
    }
  },

  data: function () {
    return {
      results: null,
      season: 0, // year without century
      game: '0820', // four digit number padded with zeros
      success: true,
      columns: ['PLAYER', 'MIN', 'FGM', 'FGA', 'TPM', 'TPA', 'FTM', 'FTA',
        'REB', 'AST', 'STL', 'BLK', 'TOV', 'PTS'],
      aligned: [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 1 for aligned columns
      games: null,
      gameID: null // when selected from dropdown list
    }
  },

  mounted: function () {
    // get yesterday's games
    var url =
      'https://thingproxy.freeboard.io/fetch/https://it.global.nba.com/stats2/scores/miniscoreboard.json'
    // + new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().slice(0, 4) + '/scores/00_todays_scores.json'
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
    axios.defaults.headers.common['Header set Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept"
    axios.get(url, { crossdomain: true })
      .then(response => {
        var g = []
        var utc = Math.floor((new Date()).getTime() / 1000) //parseInt(round(time.time() * 1000))
        var key = response.payload.today.games[0].profile.utcMillis < String(utc) ? 'today' : 'previous' 
        for (var game of response.payload[key].games) {
          g.push(JSON.parse('{"id":"' + game.profile.gameId + '","home":{"nickname":"' + game.homeTeam.profile.abbr + '"},"visitor":{"nickname":"' + game.awayTeam.profile.abbr + '"}}'))
        }
        response.data.sports_content = Object.assign({}, {
          games: {
            game: g
          }
        })
        this.games = typeof (response.data.sports_content.games.game) !== 'undefined'
          ? response.data.sports_content.games.game : []
      })
      .catch(error => {
        console.log(error)
      })
  },

  methods: {
    getGamedetail () {
      var day = new Date()
      // calculate start of the season
      var yy = parseInt(day.getFullYear()) - parseInt(day.getMonth() > 9 ? 0 : 1) - parseInt(this.season) - 2000
      var gameID = this.gameID > '' ? this.gameID : '004' + yy + '0' + this.game
      var url = 'https://cors-anywhere.herokuapp.com/http://data.nba.net/v2015/json/mobile_teams/nba/20' +
        yy + '/scores/gamedetail/' + gameID + '_gamedetail.json'
      axios.get(url, { crossdomain: true })
        .then(response => {
          this.results = response.data
          this.success = typeof (this.results.g.hls.pstsg) !== 'undefined'
        })
        .catch(error => {
          console.log(error)
          this.success = false
        })
    },

    // stat line from player (or total) object
    stats (player, teamtotal) {
      return player != null ? [
        player.ln != null ? player.fn + ' ' + player.ln : teamtotal,
        player.ln != null ? player.min + ':' + ('00' + player.sec).slice(-2) : 'TOTALS',
        player.fgm, player.fga, player.tpm, player.tpa, player.ftm, player.fta,
        String(player.reb).concat(player.oreb > 0 ? ' (' + player.oreb + ')' : ''),
        player.ast, player.stl, player.blk, player.tov, player.fgm * 2 + player.tpm + player.ftm] : []
    },

    filter (arr) {
      return arr.slice(1)
    }
  }
})
