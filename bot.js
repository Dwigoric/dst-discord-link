import Discord from 'discord.js'
const client = new Discord.Client()

import 'dotenv/config'
import fs from 'fs'

let channelHook = 0

const path = process.env.JSON_PATH
// Open previously linked channel.
try {
    if (fs.existsSync('./linked_channel.json')) {
        const data = JSON.parse(fs.readFileSync('./linked_channel.json', 'utf8'))
        channelHook = data.channelId
    }
} catch (err) {
    console.error(err)
}

// ------ JSON FILES ------
try {
    // Try to create the file if it doesn't exist
    if (!fs.existsSync(`${path}/out.json`)) {
        const str = { message: '', time: Date.now() }
        fs.writeFileSync(`${path}/out.json`, JSON.stringify(str))
    }
} catch (err) {
    console.error(err)
}
try {
    // Try to create the file if it doesn't exist
    if (!fs.existsSync(`${path}/in.json`)) {
        fs.writeFileSync(`${path}/in.json`, '')
    }
} catch (err) {
    console.error(err)
}

// Watch out.json file
fs.watchFile(`${path}/out.json`, SendToDiscord)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (message) => {
    if (message.content === 'dst!link') {
        channelHook = message.channel.id

        // Write to linked_channel.json
        fs.open('./linked_channel.json', 'w', (err, fd) => {
            if (err) {
                console.error(err)
                return
            }

            try {
                const str = { channelId: channelHook }
                fs.writeFileSync('./linked_channel.json', JSON.stringify(str))
            } catch (err) {
                console.error(err)
            }

            // Close the opened file.
            try {
                fs.closeSync(fd)
            } catch (err) {
                console.error(err)
            }
        })

        message.delete().catch(() => message.react('✅').catch(() => null))
    } else if (message.channel.id === channelHook && message.author.id !== client.user.id) {
        SendToDontStarve(message.author.username, message.content)
    }
    /*
	examples of custom commands, there is a commented part of the dont starve side where it allows anybody who does a / command to execute custom lua on the serverside. PLEASE SET THIS UP CAREFULLY, GIVING THIS ABILITY TO ANYONE CAN DAMAGE PEOPLE'S GAMES IF USED NEFARIOUSLY.
	if(message.content.startsWith("!ban ") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/TheNet:Ban('" + message.content.substring(5) + "')")
	}
	if(message.content.startsWith("!kick ") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/TheNet:Kick('" + message.content.substring(6) + "')")
	}
	if(message.content.startsWith("!regenerate") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/c_regenerateworld()")
	}
	if(message.content.startsWith("!rollback ") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/c_rollback("+message.content.substring(10)+")")
	}
	if(message.content.startsWith("!listplayers") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/str = '' for i, v in ipairs(AllPlayers) do str = str..string.format('[%d] (%s) %s <%s>', i, v.userid, v.name, v.prefab).. '\\n' end SendToDiscord('[Server]',str)")
	}
	if(message.content.startsWith("!announce ") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/c_announce('" + message.content.substring(10) + "')")
	}
	if(message.content.startsWith("!save") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/c_save()")
	}
	if(message.content.startsWith("!reset") && message.channel == channelHook){
		SendToDontStarve(message.author.username,"/c_reset()")
	}

	if(message.content.startsWith("!help") && message.channel == channelHook){
		message.channel.send("!ban                TheNet:Ban(userid) \n!kick               TheNet:Kick(userid)\n!regenerate   c_regenerateworld()\n!rollback        c_rollback(count)\n!listplayers    c_listallplayers\n!announce     c_announce(\"announcement\")\n!save               c_save()\n!reset              c_reset()")
	}*/
})

function SendToDiscord() {
    if (channelHook === 0 || client.readyAt === null) return

    fs.open(`${path}/out.json`, 'r', (err, fd) => {
        if (err) {
            console.error(err)
            return
        }

        fs.stat(`${path}/out.json`, (err) => {
            if (err) {
                console.error(err)
                return
            }

            const data = JSON.parse(fs.readFileSync(`${path}/out.json`, 'utf8'))

            client.channels.cache
                .get(channelHook)
                .send(String(data.name) + ': ' + String(data.message))

            try {
                fs.closeSync(fd)
            } catch (err) {
                console.log(err)
            }
        })
    })
}

function SendToDontStarve(name, message) {
    fs.open(`${path}/in.json`, 'w', (err, fd) => {
        // Open the file for writing.
        try {
            const str = { time: Date.now(), name, message }
            fs.writeFileSync(`${path}/in.json`, JSON.stringify(str))
        } catch (err) {
            console.error(err)
        }

        // Close the opened file.
        try {
            fs.closeSync(fd)
        } catch (err) {
            console.error(err)
        }
    })
}

client.login(process.env.BOT_TOKEN)
