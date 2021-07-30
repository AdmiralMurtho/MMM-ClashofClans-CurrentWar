Module.register("MMM-ClashofClans-CurrentWar", {
    defaults: {
        updateInterval: 60 * 60 * 1000, //Every 60 Minutes
        playerTag: '', //Without the Hashtag
        playerToken: '', //This is available on https://developer.clashofclans.com -> My Account
        clanTag: ''
    },
    
    start: function() {
        Log.info(`Starting Module: ${this.name}`);

        this.playerName = ''
        this.own_clan_src = ''
        this.own_clan_name = ''
        this.own_clan_attacks = 0
        this.own_clan_percentage = 0
        this.own_clan_stars = 0
        this.opponent_clan_src = ''
        this.opponent_clan_name = ''
        this.opponent_clan_attacks = 0
        this.opponent_clan_percentage = 0
        this.opponent_clan_stars = 0
        this.team_size = 0
        this.start_time = null
        this.end_time = null

        this.loaded = false
        this.sheduleUpdate()
    },

    getStyles: function() {
        return ["MMM-ClashofClans-CurrentWar.css"]
    },

    getPlayerStats: function() {
        this.sendSocketNotification('CoCCW-GET-PLAYER-STATS', {'name': this.config.playerTag, 'token': this.config.playerToken});
    },

    getWarStats: function() {
        this.sendSocketNotification('CoCCW-GET-WAR-STATS', {'clanTag': this.config.clanTag, 'token': this.config.playerToken})
    },

    getDom: function() {

    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case 'CoCCW-GOT-PLAYER-STATS':
                this.playerName = payload.name
                this.loaded = true
                this.updateDom()
                break
            case 'CoCCW-GOT-WAR-STATS':
                this.own_clan_src = payload.clan.badgeUrls.small
                this.own_clan_name = payload.clan.name
                this.own_clan_attacks = payload.clan.attacks
                this.own_clan_percentage = payload.clan.destructionPercentage
                this.own_clan_stars = payload.clan.stars
                this.opponent_clan_src = payload.opponent.badgeUrls.small
                this.opponent_clan_name = payload.opponent.name
                this.opponent_clan_attacks = payload.opponent.attacks
                this.opponent_clan_percentage = payload.opponent.destructionPercentage
                this.opponent_clan_stars = payload.opponent.stars
                this.team_size = payload.teamSize
                this.start_time = payload.startTime
                this.end_time = payload.endTime
                this.updateDom()
                break
            default:
                this.updateDom()
                break
        }
    },

    sheduleUpdate: function() {
        setInterval(() => {
            this.getPlayerStats()
        }, this.config.updateInterval)
        this.getPlayerStats()
    }
})