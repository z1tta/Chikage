module.exports = {
  name: "guildCreate",
  once: false,
  execute: async (client, guild) => {
    client.db.run(
      `INSERT INTO "Guilds" ("id", "prefix") VALUES ('${guild.id}', 'c.');`
    );
    console.log(`New guild joined ! ${guild.name} (${guild.id})`);
  },
};
