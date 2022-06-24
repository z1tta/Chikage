const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const sqlite3 = require("sqlite3");
config();

const client = new Client({
  allowedMentions: {
    parse: ["everyone", "roles", "users"],
  },
  presence: {
    status: "online",
    activities: [],
  },
  intents: 131071,
});

client.commands = new Collection();

client.db = new sqlite3.Database("database.db", (err) => {
  if (err) console.error(err);
});

[("CommandUtil", "EventUtil")].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(process.env.DISCORD_TOKEN);
