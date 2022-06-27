const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.channel.type == "DM") return;
    const prefix = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT prefix FROM "Guilds" WHERE id = "${message.guild.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.prefix))
      )
    );
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const user = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Users" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    const cooldown = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT "cooldown" FROM "Guilds" WHERE id = "${message.guild.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.cooldown))
      )
    );

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    if (cmdName.length == 0) return;

    let cmd = client.commands.get(cmdName);
    if (cmd.name == "eval") {
      try {
        return cmd.run(client, message, args);
      } catch (error) {
        return message.channel.send(error, { code: "js" });
      }
    }
    if (cmd) {
      const isInCooldown = new MessageEmbed()
        .setTitle(`${replies.isInCooldown.title}${cooldown / 1000}s`)
        .setColor(replies.isInCooldown.color);
      if (user.isInCooldown == "true")
        return message.channel.send({ embeds: [isInCooldown] });
      cmd.run(client, message, args, cooldown);
    }
  },
};
