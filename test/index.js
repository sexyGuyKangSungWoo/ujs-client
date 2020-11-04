
const { Client } = require("../dist/");

const client = new Client;

(async () => {
    await client.connect("http://127.0.0.1:5555/");
    const result = await client.execNode("console.log(3)");
    console.log(result);
})();