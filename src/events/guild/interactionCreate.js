const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  execute: async (client, interaction) => {
    if (interaction.isButton()) {
      const userbalance = await new Promise((resolve, reject) =>
        client.db.get(
          `SELECT * FROM "Balance" WHERE "userid" = '${interaction.member.id}';`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      if (!userbalance)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(`I can't find your balance`)
              .setColor("RED"),
          ],
          ephemeral: true,
        });
      const dropcurrencybutton = await new Promise((resolve, reject) =>
        client.db.get(
          `SELECT * FROM "DropcurrencyButtons" WHERE "id" = '${interaction.customId}'`,
          (err, row) => (err ? reject(err) : resolve(row))
        )
      );
      if (!dropcurrencybutton) return;
      client.guilds.cache
        .get(interaction.guildId)
        .channels.cache.get(interaction.channelId)
        .messages.cache.get(interaction.customId)
        .delete();
      client.db.run(
        `DELETE FROM "DropcurrencyButtons" WHERE "id" = '${interaction.customId}'`
      );
      await interaction.reply({
        embeds: [
          new MessageEmbed().setDescription(
            `Successfully added ${dropcurrencybutton.amount} to you balance`
          ),
        ],
        ephemeral: true,
      });
      client.db.run(
        `UPDATE "Balance" SET "balance" = '${
          parseInt(userbalance.balance) + parseInt(dropcurrencybutton.amount)
        }' WHERE "userid" = '${interaction.member.id}';`
      );
    }
  },
};
