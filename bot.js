/**
 * CONFIGURE THIS TO WHERE THE JSON FILES ARE LOCATED
 */
const path = "C:/Program Files (x86)/Steam/steamapps/common/Don't Starve Together/data"
/**
 * CONFIGURE THIS TO WHERE THE JSON FILES ARE LOCATED
 */

import Discord from 'discord.js'
const client = new Discord.Client()

import 'dotenv/config'
import fs from 'fs'
import moment from 'moment'

let lastModified = 0
let channelHook = 0
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
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
    let fd = null
    try {
        fd = fs.openSync(`${path}/out.json`, 'r')
    } catch (err) {
        console.error(err)
    }
    try {
        const data = fs.statSync(`${path}/out.json`)
        lastModified = data.mtime.toISOString()
        console.log('last modified changed to ' + lastModified)
    } catch (err) {
        console.error(err)
    }
    try {
        fs.closeSync(fd)
    } catch (err) {
        console.error(err)
    }
})

client.on('message', (message) => {
    if (message.content == 'dst!link' && channelHook == 0) {
        channelHook = message.channel
        message.delete()
        setInterval(function () {
            fs.open(`${path}/out.json`, 'r', (err, fd) => {
                if (err) {
                    console.log(err)
                    return
                } else {
                    fs.stat(`${path}/out.json`, (err, data) => {
                        const previousLMM = moment(lastModified)
                        const rightNow = data.mtime.toISOString()
                        const folderLMM = moment(rightNow)
                        const res = !folderLMM.isSame(previousLMM, 'second') //seconds granularity
                        if (res) {
                            try {
                                const data = JSON.parse(fs.readFileSync(`${path}/out.json`, 'utf8'))
                                message.channel.send(String(data.name) + ':' + String(data.message))
                            } catch (err) {
                                console.error(err)
                            }
                            lastModified = rightNow
                        }
                        try {
                            fs.closeSync(fd)
                        } catch (err) {
                            console.log(err)
                        }
                    })
                }
            })
        }, 500)
    }

    if (message.content.startsWith('!send ') && message.channel == channelHook) {
        SendToDontStarve(message.author.username, message.content.substring(6))
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
