var NodeHelper = require('node_helper')
var request = require('request')

module.exports = NodeHelper.create({
    start: function() {
        console.log('MMM-ClashofClans-CurrentWar helper, started...')

        this.PlayerName = ''
        this.trophies = null
    },

    getPlayerStats: function(payload) {
        var that = this
        this.url = 'https://api.clashofclans.com/v1/players/%23' + payload.name
        this.token = payload.token

        request({
            url: this.url,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }, (error, response, body) => {
            var result = null;
            if(!error && response.statusCode == 200){
                result = JSON.parse(body)
            } else {
                result = null
            }
            that.sendSocketNotification('CoCCW-GOT-PLAYER-STATS', result)
        })
    },

    getWarStats: function(payload) {
        var that = this
        this.url = 'https://api.clashofclans.com/v1/clans/%23' + payload.clanTag + '/currentwar'
        this.token = payload.token

        request({
            url: this.url,
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }, (error, response, body) => {
            var result = null;
            if(!error && response.statusCode == 200){
                result = JSON.parse(body)
            } else {
                result = null
            }
            that.sendSocketNotification('CoCCW-GOT-WAR-STATS', result)
        })
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case 'CoCCW-GET-PLAYER-STATS':
                this.getPlayerStats(payload)
                break
            case 'CoCCW-GET-WAR-STATS':
                this.getWarStats(payload)
                break
            default:
                break
        }
    }

})