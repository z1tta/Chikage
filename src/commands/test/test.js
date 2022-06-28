const { MessageEmbed } = require("discord.js");
const replies = require("../../../replies/embedsReplies.json");

module.exports = {
  name: "test",
  description: "test",
  usage: "test",
  run: async (client, message, args, cooldown) => {
    const ghostChannels = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "Ghosts"`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
    ghostChannels.forEach(async (channel) => {
      const guildchannel = await message.member.guild.channels.cache.get(
        channel.id
      );
      console.log(channel.id);
      console.log(guildchannel);
      const mess = await channel.send(message.member);
      await mess.delete();
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
