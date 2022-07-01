const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "eval",
  category: "BotAdmins",
  description: "Evaluates JS code",
  usage: "eval [code]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin)
      return console.log(
        `${message.author.tag}, (${message.author.id}) à essayé d'éxécuter la commande eval depuis le serveur ${message.guild.name} (${message.guild.id})`
      );
    function clean(text) {
      if (typeof text === "string") {
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      }
      return text;
    }
    const code = args.join(" ");
    if (!code) return false;
    try {
      const evaled = eval(code);
      const cleanCode = await clean(evaled);
      if (String(cleanCode).includes(process.env.TOKEN || client.token))
        return false;
      return message.channel.send(`\`\`\`js\n${cleanCode.toString()}\`\`\``);
    } catch (error) {
      message.channel.send(`\`\`\`js\n${error}\`\`\``);
    }
  },
};
