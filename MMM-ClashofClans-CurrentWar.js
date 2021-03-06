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
        this.fight_state = ''

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
            own_name.innerText = this.own_clan_name

            var versus = document.createElement("div")
            versus.classList.add("CoCCW_element")
            
            var own_image = document.createElement("img")
            own_image.src = this.own_clan_src
            own_image.classList.add("CoCCW_image")

            var versus_title = document.createElement("div")
            versus_title.innerText = "VS"

            var opponent_image = document.createElement("img")
            opponent_image.src = this.opponent_clan_src
            opponent_image.classList.add("CoCCW_image")

            versus.appendChild(own_image)
            versus.appendChild(versus_title)
            versus.appendChild(opponent_image)

            var opponent_name = document.createElement("div")
            opponent_name.classList.add("CoCCW_element")
            opponent_name.innerText = this.opponent_clan_name

            var own_stats = document.createElement("div")
            own_stats.classList.add("stats")
            var opponent_stats = document.createElement("div")
            opponent_stats.classList.add("stats")

            switch(this.fight_state){
                case('inWar'):
                    var own_stars = document.createElement("span")
                    own_stars.classList.add("CoCCW_element")
                    own_stars.appendChild(document.createTextNode(`${this.own_clan_stars} / ${this.team_size * 3}`))

                    var own_percent = document.createElement("span")
                    own_percent.classList.add("CoCCW_element")
                    own_percent.appendChild(document.createTextNode(`${this.own_clan_percentage.toFixed(2)} %`))

                    own_stats.appendChild(own_stars)
                    own_stats.appendChild(own_percent)

                    var opponent_stars = document.createElement("span")
                    opponent_stars.classList.add("CoCCW_element", "bigger")
                    opponent_stars.appendChild(document.createTextNode(this.opponent_clan_stars))

                    var opponent_percent = document.createElement("span")
                    opponent_percent.classList.add("CoCCW_element")
                    opponent_percent.appendChild(document.createTextNode(`${this.opponent_clan_percentage.toFixed(2)} %`))

                    opponent_stats.appendChild(opponent_stars)
                    opponent_stats.appendChild(opponent_percent)
                    break
                case('preparation'):
                    var preparation = document.createElement("span")
                    preparation.classList.add("CoCCW_element")
                    preparation.appendChild(document.createTextNode('Preparation'))
                    var preparation2 = preparation.cloneNode(true)
                    own_stats.appendChild(preparation)
                    opponent_stats.appendChild(preparation2)
                    break
                default:
                    break;
            }

            var remaining_time = document.createElement("span")
            remaining_time.classList.add("CoCCW_element")
            remaining_time.appendChild(document.createTextNode(this.checkRemainingTime()))

            wrapper.appendChild(own_name)
            wrapper.appendChild(versus)
            wrapper.appendChild(opponent_name)

            wrapper.appendChild(own_stats)
            wrapper.appendChild(remaining_time)
            wrapper.appendChild(opponent_stats)

            //TODO: Hier fehlt ncoh die Implementation der erinnerung, dass ein Spieler noch Angriffe machen muss

        } else {
            var wrapper = document.createElement("div")
            wrapper.innerText = "Daten werden noch geladen"
        }

        return wrapper
    },

    checkOwnStats: function() {

    },

    checkRemainingTime: function() {
        var diff;
        switch (this.fight_state) {
            case ('inWar'):
                diff = this.end_time - Date.now()
                break
            case ('preparation'):
                diff = Date.now() - this.start_time
                break
            default:
                break
        }
        diff /= (1000*60*60)
        var hours = parseInt(diff)
        var minutes = 60 * (diff - hours)
        minutes = parseInt(minutes)

        return `${Math.abs(hours)} H ${Math.abs(minutes)} M`
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
            case 'CoCCW-GOT-PLAYER-STATS':
                this.playerName = payload.name
                this.loaded = true
                this.updateDom()
                break
            case 'CoCCW-GOT-WAR-STATS':
                this.own_clan_src = payload.clan.badgeUrls.medium
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
                this.start_time = this.dateStringToDate(payload.startTime)
                this.end_time = this.dateStringToDate(payload.endTime)
                this.fight_state = payload.state
                this.loaded = true
                this.updateDom()
                break
            default:
                this.updateDom()
                break
        }
    },

    dateStringToDate: function(string_date) {
        var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var date_string = `${string_date.substr(6,2)} ${month[parseInt(string_date.substr(4,2))-1]} ${string_date.substr(0,4)} ${string_date.substr(9,2)}:${string_date.substr(11,2)}:00 Z`
        return Date.parse(date_string)
    },

    sheduleUpdate: function() {
        setInterval(() => {
            this.getWarStats()
        }, this.config.updateInterval)
        this.getWarStats()
    }
})