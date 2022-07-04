module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    setInterval(async () => {
      const dbBalance = await new Promise((resolve, reject) =>
        client.db.all(`SELECT * FROM "Balance";`, (err, rows) =>
          err ? reject(err) : resolve(rows)
        )
      );
      const ids = [];
      dbBalance.forEach((user) => {
        ids.push(user.userid);
      });
      const users = client.users.cache
        .map((user) => user)
        .filter((user) => user.bot == false);
      users.forEach((user) => {
        if (!ids.includes(user.id)) {
          client.db.run(
            `INSERT INTO "Balance" ("userid") VALUES ('${user.id.toString()}');`
          );
        }
      });
    }, 5000);
    console.log("I'm ready");
  },
};
