const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "addwelcome",
  category: "Welcomer",
  description: "Adds a message in the mentionned channel when a user join",
  usage: "addwelcome [channel] [message]",
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

    if (!args[1])
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Please enter a message to send")
            .setColor("RED"),
        ],
      });

    let wMessage = "";
    args.forEach((arg) => {
      if (arg !== args[0]) wMessage = wMessage + arg + " ";
    });

    client.db.run(
      `INSERT INTO "WelcomeMessages" ("guildid", "channelid", "message") VALUES ('${message.guild.id}', '${channel.id}', '${wMessage}')`
    );

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully set in #${channel.name} :`)
          .setDescription(wMessage)
          .setColor("GREEN"),
      ],
    });
  },
};
