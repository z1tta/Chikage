const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "dm",
  category: "BotAdmins",
  description: "Send a Direct Message to the mentionned user",
  usage: "dm [userid] [message]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;

    const userNotMentionned = new MessageEmbed()
      .setTitle(replies.userNotMentionned.title)
      .setColor(replies.userNotMentionned.color);
    if (!args[0]) return message.channel.send({ embeds: [userNotMentionned] });
    const user = message.guild.members.cache.get(args[0]);
    const cantFindUser = new MessageEmbed()
      .setTitle(replies.cantFindUser.title)
      .setColor(replies.cantFindUser.color);
    if (!user) return message.channel.send({ embeds: [cantFindUser] });
    let dmMessage = "";
    args.forEach((arg) => {
      if (arg !== args[0]) dmMessage = dmMessage + arg + " ";
    });
    if (!dmMessage)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please indicate a message to send`)
            .setColor("RED"),
        ],
      });
    const embed = new MessageEmbed().setTitle;
    await user.user.send({
      embeds: [
        new MessageEmbed()
          .addField(`Message from: ${message.author.tag}`, dmMessage)
          .setFooter({
            text: `Sent on | ${moment().format("L")}`,
            iconURL: message.author.avatarURL(),
          }),
      ],
    });
    return message.react("✅");
  },
};
