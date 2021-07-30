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
        if(this.loaded) {


            var wrapper = document.createElement("div")
            wrapper.classList.add("CoCCW_container")

            var own_name = document.createElement("div")
            own_name.classList.add("CoCCW_element")
            own_name.innerText = "LOVEPARADE"
            
            wrapper.appendChild(own_name)
            /*
            var versus = document.createElement("div")
            versus.classList.add("CoCCW_element")
            
            var own_image = document.createElement("img")
            own_image.src = "blablabla"

            var versus_title = document.createElement("div")
            versus_title.innerText = "VS"

            var opponent_image = document.createElement("img")
            opponent_image.src = "blablabla"

            versus.appendChild(own_image, versus_title, opponent_image)

            var opponent_name = document.createElement("div")
            opponent_name.innerText = "IQ FRIENDS IQ"

            var own_stats = document.createElement("div")
            own_stats.classList.add("stats")

            var own_stars = document.createElement("span")
            own_stars.classList.add("CoCCW_element")
            own_stars.appendChild(document.createTextNode("8"))

            var own_percent = document.createElement("span")
            own_percent.classList.add("CoCCW_element")
            own_percent.appendChild(document.createElement("23,70%"))

            own_stats.appendChild(own_stars, own_percent)

            var remaining_time = document.createElement("span")
            remaining_time.appendChild(document.createTextNode("22H 45M"))

            var opponent_stats = document.createElement("div")
            opponent_stats.classList.add("stats")

            var opponent_stars = document.createElement("span")
            opponent_stars.classList.add("stats")
            opponent_stars.appendChild(document.createTextNode("1"))

            var opponent_percent = document.createElement("span")
            opponent_percent.classList.add("CoCCW_element")
            opponent_percent.appendChild(document.createTextNode("2,34%"))

            opponent_stats.appendChild(opponent_stars, opponent_percent)

            wrapper.appendChild(own_name, versus, opponent_name, own_stats, remaining_time, opponent_stats)*/

            //TODO: Hier fehlt ncoh die Implementation der erinnerung, dass ein Spieler noch Angriffe machen muss

        } else {
            var wrapper = document.createElement("div")
            wrapper.innerText = "Daten werden noch geladen"
        }

        return wrapper
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case 'CoCCW-GOT-PLAYER-STATS':
                this.playerName = payload.name
                this.loaded = true
                this.updateDom()
                break
            case 'CoCCW-GOT-WAR-STATS':
                /*this.own_clan_src = payload.clan.badgeUrls.medium
                this.own_clan_name = payload.clan.name
                this.own_clan_attacks = payload.clan.attacks
                this.own_clan_percentage = payload.clan.destructionPercentage
                this.own_clan_stars = payload.clan.stars
                this.opponent_clan_src = payload.opponent.badgeUrls.medium
                this.opponent_clan_name = payload.opponent.name
                this.opponent_clan_attacks = payload.opponent.attacks
                this.opponent_clan_percentage = payload.opponent.destructionPercentage
                this.opponent_clan_stars = payload.opponent.stars
                this.team_size = payload.teamSize
                this.start_time = payload.startTime
                this.end_time = payload.endTime*/
                this.loaded = true
                this.updateDom()
                break
            default:
                this.updateDom()
                break
        }
    },

    sheduleUpdate: function() {
        setInterval(() => {
            this.getWarStats()
        }, this.config.updateInterval)
        this.getWarStats()
    }
})