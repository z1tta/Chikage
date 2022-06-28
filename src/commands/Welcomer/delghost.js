const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "delghost",
  description: "Deletes a ghost ping set to a channel when a member join",
  usage: "delghost [channel]",
  run: async (client, message, args, cooldown) => {
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

    client.db.run(`DELETE FROM "Ghosts" WHERE ("id" = '${channel.id}')`);

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Successfully deletes a ghost ping in #${channel.name}`)
          .setColor("GREEN"),
      ],
    });

    if (cooldown && !message.member.permissions.has("ADMINISTRATOR")) {
      await new Promise((resolve, reject) =>
        client.db.get(
          `INSERT INTO "Cooldown" ("id") VALUES ('${message.member.id}');`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      setTimeout(async () => {
        await new Promise((resolve, reject) =>
          client.db.get(
            `DELETE FROM "Blacklist" WHERE ("id" = '${message.member.id}');`,
            (err, row) => (err ? reject(err) : resolve(row))
          )
        );
      }, cooldown);
    }
  },
};
