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
    setInterval(async () => {
      const searches = await new Promise((resolve, reject) =>
        client.db.all(`SELECT * FROM "CustomSearch";`, (err, rows) =>
          err ? reject(err) : resolve(rows)
        )
      );
      searches.forEach(async (search) => {
        try {
          await new Promise((resolve, reject) =>
            client.db.all(
              `SELECT * FROM "${search.name}Cooldown";`,
              (err, rows) => (err ? reject(err) : resolve(rows))
            )
          );
        } catch (error) {
          if (error)
            client.db.run(
              `CREATE TABLE "${search.name}Cooldown" ("userid" text NOT NULL);`
            );
        }
      });
    }, 5000);
    console.log("I'm ready");
  },
};
