module.exports = {
  name: "ban",
  modOnly: true,
  execute(ws, message, args, botName) {
    const user = args[0];
    if (!user) return;

    console.log(`[${botName}] ${user} banlandı.`);
  }
};
