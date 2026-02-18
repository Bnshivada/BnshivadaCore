const fs = require("fs");
const WebSocket = require("ws");

const BOT_NAME = "BnshivadaCore";
const PREFIX = "!";

const commands = new Map();
const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

const ws = new WebSocket("wss://kick-chat-url");

ws.on("open", () => {
    console.log(`${BOT_NAME} başlatıldı.`);
});

ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (!msg.content) return;
    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.slice(PREFIX.length).split(" ");
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return;

  
    if (command.modOnly && !msg.isMod) {
        ws.send(JSON.stringify({
            type: "message",
            content: `[${BOT_NAME}] Bunu Kullanmak İçin Yeterli Yetkin Bulunmuyor`
        }));
        return;
    }

    command.execute(ws, msg, args, BOT_NAME);
});
