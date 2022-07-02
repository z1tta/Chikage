const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["say"],
  category: "BotAdmins",
  description: "Send a message in the mentionned channel",
  usage: "say [channel] [message]",
  run: async (client, message, args) => {
    const botAdmin = await new Promise((resolve, reject) =>
      client.db.get(
        `SELECT * FROM "BotAdmins" WHERE id = "${message.member.id}"`,
        (err, row) => (err ? reject(err) : resolve(row.id))
      )
    );
    if (!botAdmin) return;

    const channelNotMentionned = new MessageEmbed()
      .setTitle(replies.channelNotMentionned.title)
      .setColor(replies.channelNotMentionned.color);
    if (!args[0])
      return message.channel.send({ embeds: [channelNotMentionned] });
    if (!args[0].startsWith("<#") && !args[0].endsWith(">"))
      return message.channel.send({ embeds: [channelNotMentionned] });
    const channel = message.guild.channels.cache.get(
      args[0].split("<#")[1].split(">")[0]
    );
    const cantFindChannel = new MessageEmbed()
      .setTitle(replies.cantFindChannel.title)
      .setColor(replies.cantFindChannel.color);
    if (!channel) return message.channel.send({ embeds: [cantFindChannel] });

    let cMessage = "";
    args.forEach((arg) => {
      if (arg !== args[0]) cMessage = cMessage + arg + " ";
    });

    channel.send(cMessage);
    return message.react("✅");
  },
};
