module.exports = {
  name: "guildMemberAdd",
  once: false,
  execute: async (client, member) => {
    const ghostChannels = await new Promise((resolve, reject) =>
      client.db.all(
        `SELECT * FROM "Ghosts" WHERE "guildid" = '${member.guild.id}'`,
        (err, rows) => (err ? reject(err) : resolve(rows))
      )
    );
    ghostChannels.forEach(async (channel) => {
      const guildchannel = await member.guild.channels.cache.get(
        channel.channelid
      );
      if (guildchannel) {
        const message = await guildchannel.send(`<@${member.id}>`);
        await message.delete();
      }
    });
    const welcomeMessages = await new Promise((resolve, reject) =>
      client.db.all(
        `SELECT * FROM "WelcomeMessages" WHERE ("guildid" = '${member.guild.id}')`,
        (err, rows) => (err ? reject(err) : resolve(rows))
      )
    );
    welcomeMessages.forEach(async (wMessage) => {
      if (wMessage) {
        const channel = member.guild.channels.cache.get(wMessage.channelid);
        await channel.send(wMessage.message);
      }
    });
  },
};
