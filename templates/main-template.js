// Note that these are backticks.

const MainTemplate = `
<!--template-->
  <div id="app">
    <div class='ui centered card'>

      <div class='ui form'>
        <!-- selecting season and game -->
        <div class='field'>
          <label>Season</label>
          <select v-model="season">
            <option value="" disabled hidden>Select season</option>
            <option value="0"> Actual</option>
            <option value="1"> Previous</option>
          </select>
        </div>
        <div class='field'>
          <label>Game</label>
          <input type='text' v-model="game">
        </div>
        <div class='field'>
          <select v-model="gameID">
            <option value="null" disabled>Choose from recent games</option>
            <option v-for="game in games" :value="game.id" v-bind:key="game.id">
              {{game.home.nickname}} - {{game.visitor.nickname}}
            </option>
          </select>
        </div>
        <div class='ui two button attached buttons'>
          <button class='ui basic blue button' v-on:click="getGamedetail()">
            Get boxscore
          </button>
        </div>
      </div>

    </div>
    <div v-if="! success" class="ui bottom attached compact info message">
      <i class="icon warning red"></i>Error getting game details
    </div>

    <div v-if="results != null">
      <!-- showing the boxscore -->
      <p class="ui secondary inverted segment huge">{{ home }} - {{ visitor }}</p>

      <table class="ui compact table segment">
        <thead>
          <tr>
            <th v-bind:class="{ 'three wide': index == 0 }"
              v-for="(header, index) in columns" v-bind:key="index">
                {{ header }}
            </th>
          </tr>
        </thead>
        <!-- home players' stats -->
        <tr class="warning" v-for="player in hPlayers" v-bind:key="player.pid">
          <td v-bind:class="[aligned[index] == 1 ? 'right': '']"
            v-for="(data, index) in stats(player, home)" v-bind:key="index">
              {{ data }}
          </td>
        </tr>
        <tr class="active">
          <!-- home totals -->
          <td v-bind:class="[aligned[index] == 1 ? 'right' : '']"
            v-for="(data, index) in stats(hTotals, home)" v-bind:key="index">
              <b v-if="index == stats(hTotals, home).length - 1 || index == 0"> {{ data }} </b>
              <template v-else>
                {{ data }}
              </template>
          </td>
        </tr>
        <!-- visitor -->
        <tr class="warning" v-for="player in vPlayers" v-bind:key="player.pid">
          <td v-bind:class="[aligned[index] == 1 ? 'right': '']"
            v-for="(data, index) in stats(player, null)" v-bind:key="index">
            {{ data }}
          </td>
        </tr>
        <tr class="active">
          <td v-bind:class="[aligned[index] == 1 ? 'right': '']"
            v-for="(data, index) in stats(vTotals, visitor)" v-bind:key="index">
              <b v-if="index == stats(vTotals, visitor).length - 1 || index == 0"> {{ data }} </b>
              <template v-else>
                {{ data }}
              </template>
          </td>
        </tr>
      </table>

    </div>
  </div>
<!--/template-->
<!--router-view></router-view-->
`
export { MainTemplate }
