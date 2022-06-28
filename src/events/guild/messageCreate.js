const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.channel.type == "DM") return;
    const blacklisted = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Blacklist" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (blacklisted) return;
    const prefix = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT prefix FROM "Guilds" WHERE id = "${message.guild.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.prefix))
      )
    );
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const cooldown = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT "cooldown" FROM "Guilds" WHERE id = "${message.guild.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.cooldown))
      )
    );
    const memberInCooldown = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Cooldown" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    if (cmdName.length == 0) return;

    let cmd = client.commands.get(cmdName);
    if (cmd) {
      const isInCooldown = new MessageEmbed()
        .setTitle(`${replies.isInCooldown.title}${cooldown / 1000}s`)
        .setColor(replies.isInCooldown.color);
      if (memberInCooldown)
        return message.channel.send({ embeds: [isInCooldown] });
      cmd.run(client, message, args, cooldown);
    }
  },
};
