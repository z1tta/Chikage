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
    const afkMembers = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "AFK"`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
    afkMembers.forEach((member) => {
      if (
        message.content.includes(`<@${member.userid}>`) &&
        !message.content.startsWith(prefix)
      ) {
        if (member.reason == "No reason")
          return message.channel.send({
            embeds: [
              new MessageEmbed().setTitle(`This user is AFK`).setColor("RED"),
            ],
          });
        else
          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle(
                  `\`${
                    client.users.cache.get(member.userid).username
                  }\` is AFK: ${member.reason}`
                )
                .setDescription(member.reason)
                .setColor("RED"),
            ],
          });
      }
      if (message.member.id == member.userid) {
        client.db.run(`DELETE FROM "AFK" WHERE "userid" = '${member.userid}'`);
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `Welcome back ${message.member}! I removed your AFK`
              )
              .setColor("GREEN"),
          ],
        });
      }
    });
    const blacklisted = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "Blacklist" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row))
      )
    );
    if (blacklisted) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmdName = args.shift().toLowerCase();

    if (cmdName.length == 0) return;

    client.commands
      .map((cmd) => cmd)
      .forEach((cmd) => {
        if (cmd.name.includes(cmdName)) cmd.run(client, message, args);
      });
  },
};
