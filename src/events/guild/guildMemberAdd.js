const { Message } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  execute: async (client, member) => {
    const ghostChannels = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "Ghosts"`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
    ghostChannels.forEach(async (channel) => {
      const guildchannel = await member.guild.channels.cache.get(channel.id);
      const message = await guildchannel.send(`<@${member.id}>`);
      await message.delete();
    });
  },
};
