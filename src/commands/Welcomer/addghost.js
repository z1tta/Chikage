const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "addghost",
  category: "Welcomer",
  description: "Adds a ghost ping to a channel when a member join",
  usage: "addghost [channel]",
  run: async (client, message, args) => {
    const noPerm = new MessageEmbed()
      .setTitle(replies.noPerm.title)
      .setColor(replies.noPerm.color);
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send({ embeds: [noPerm] });
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

    client.db.run(
      `INSERT INTO "Ghosts" ("guildid", "channelid") VALUES ('${message.guild.id}', '${channel.id}')`
    );

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set a ghost ping in #${channel.name}`)
          .setColor("GREEN"),
      ],
    });
  },
};
