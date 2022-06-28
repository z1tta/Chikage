module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    console.log("I'm ready");
  },
};
