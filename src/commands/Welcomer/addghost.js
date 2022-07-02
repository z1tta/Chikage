const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: ["addghost"],
  category: "Welcomer",
  description: "Adds a ghost ping to a channel when a member join",
  usage: "addghost [channel] [duration] [message]",
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

    const durationMissing = new MessageEmbed()
      .setTitle(replies.durationMissing.title)
      .setColor(replies.durationMissing.color);
    if (!args[1]) return message.channel.send({ embeds: [durationMissing] });
    const duration = ms(args[1]);
    const invalidDuration = new MessageEmbed()
      .setTitle(replies.invalidDuration.title)
      .setColor(replies.invalidDuration.color);
    if (!duration) return message.channel.send({ embeds: [invalidDuration] });
    let wMessage = "";
    args.forEach((arg) => {
      if (arg !== args[0] && arg !== args[1]) wMessage = wMessage + arg + " ";
    });
    if (!wMessage.length)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`Please enter a message to send`)
            .setColor("RED"),
        ],
      });

    client.db.run(
      `INSERT INTO "Ghosts" ("guildid", "channelid", "message", "duration") VALUES ('${message.guild.id}', '${channel.id}', '${wMessage}', '${duration}')`
    );

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set a ghost ping :`)
          .addFields([
            {
              name: "Channel",
              value: `${channel}`,
              inline: true,
            },
            {
              name: "Lifetime of the message",
              value: ms(duration),
              inline: true,
            },
            {
              name: "Message",
              value: wMessage,
              inline: true,
            },
          ])
          .setColor("GREEN"),
      ],
    });
  },
};
