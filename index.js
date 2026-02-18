const fs = require("fs");
const WebSocket = require("ws");

const BOT_NAME = "BnshivadaCore";
const PREFIX = "!";
const CHATROOM_ID = "64710147";

const commands = new Map();
const commandFiles = fs.readdirSync("./komutlar");

for (const file of commandFiles) {
  const command = require(`./komutlar/${file}`);
  commands.set(command.name, command);
}

const ws = new WebSocket(
  "wss://ws-us2.pusher.com/app/de504dc5763aeef9ff52?protocol=7&client=js&version=7.0.3&flash=false"
);

ws.on("open", () => {
  console.log(`${BOT_NAME} chat’e bağlandı`);

  ws.send(JSON.stringify({
    event: "pusher:subscribe",
    data: {
      channel: `chatrooms.${CHATROOM_ID}.v2`
    }
  }));
});

ws.on("message", (data) => {
  const msg = JSON.parse(data.toString());

  if (msg.event === "App\\Events\\ChatMessageEvent") {
    const message = JSON.parse(msg.data);
    const text = message.content;
    const username = message.sender.username;
    const isMod = message.sender.is_moderator;

    console.log(`${username}: ${text}`);

    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).split(" ");
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return;

    if (command.modOnly && !isMod) {
      console.log(`[${BOT_NAME}] Bunu Kullanmaya Yetkin Yetmiyor!`);
      return;
    }

    command.execute(ws, message, args, BOT_NAME);
  }
});
