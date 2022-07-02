const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["sudo"],
  category: "BotAdmins",
  description: "Sudo command",
  usage: "sudo [member] [command]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin.owner == "true") return;

    const userNotMentionned = new MessageEmbed()
      .setTitle(replies.userNotMentionned.title)
      .setColor(replies.userNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [userNotMentionned] });
    const user = message.guild.members.cache.get(args[0]);
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });

    Object.defineProperty(message, "member", {
      value: user,
    });
    Object.defineProperty(message, "author", {
      value: user.user,
    });
    const cmdName = args[1];
    if (!args[1])
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please enter a valid command name`)
            .setColor("RED"),
        ],
      });
    const newArgs = [];
    for (let i in args) {
      if (i == 0 || i == 1) return;
      newArgs.push(args[i]);
    }
    client.commands
      .map((cmd) => cmd)
      .forEach((cmd) => {
        if (cmd.name.includes(cmdName)) cmd.run(client, message, newArgs);
      });
  },
};
