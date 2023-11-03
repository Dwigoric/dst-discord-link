# Don't Starve Bot (Discord Link)

## Before Anything...

You must create two files in the directory where the game is located. You can find this by going to your Steam library and right-clicking DST, then browse local files. In the `data` directory, create two empty files named `in.json` and `out.json`. The bot already tries to create these files automatically, but it is recommended to create them manually.

### Dedicated Servers

Find where the game files are located. The created JSON files must be within the `data` directory.

### For Docker-based servers

Most likely, the game files are not exposed outside the Docker container. You must manually mount the JSON files so that the JSON files outside (located anywhere you want) point to the `data` directory's `in.json` and `out.json`.

## Setup

1. Get [Node.js](https://nodejs.org/en/)
2. Download this repository or clone it.
3. In the same folder where this repository is located, run the command:

`npm install --production`

## Bot Application

1. Go to the [Discord Developers Dashboard](https://discord.com/developers/applications) and make a new application.
2. In the application you just made, create a bot user.
3. Enable **Message Content Intent**.
4. Copy the bot token (not the client secret!).

### `.env`

1. Duplicate the `example.env` file and rename it to `.env` (nothing before the dot).
2. Paste the bot token into the `BOT_TOKEN` variable. Do not include quotes.
3. Change the `JSON_PATH` variable so that it points to where the created JSON files are located.

## Linking Discord and DST

### `dst!link`

By running this command, all messages in DST will be forwarded to the channel you run this command in. For instance, if you run this command in the bot's DMs, all DST events will be sent to your DMs with the bot. You only need to run this once.

## Some Other Stuff

There are commented codes for allowing admins to execute Lua script on the server. You most likely do not have to uncomment this unless you absolutely understand what you are doing.

## Copyright Notice

This project is a fork of [Anumania](https://github.com/Anumania)'s [Discord Bot](https://github.com/Anumania/dont_starve_bot).
