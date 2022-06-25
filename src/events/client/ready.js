module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    const dbUsers = await new Promise((resolve, reject) =>
      client.db.all(`SELECT * FROM "Users"`, (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
    const ids = [];
    dbUsers.forEach((user) => {
      ids.push(user.id);
    });
    const users = client.users.cache.map((user) => user.id);
    users.forEach((user) => {
      if (!ids.includes(user)) {
        client.db.run(
          `INSERT INTO "Users" ("id", "isInCooldown") VALUES ('${user}', 'false');`
        );
      }
    });
    console.log("I'm ready");
  },
};
