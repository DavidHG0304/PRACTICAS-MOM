const redis = require("redis");
const express = require("express");

const app = express();
app.use(express.json());

const client = redis.createClient({
    url: "redis://192.168.1.90:6380" // IP SERVER
});
client.connect().then(() => console.log("🟢 Conectado a Redis"));

app.post("/order", async (req, res) => {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) {
        return res.status(400).send("Formato inválido");
    }

    for (const o of orders) {
        const { cliente, platillo, vip } = o;

        if (!cliente || !platillo) continue;

        const order = JSON.stringify({ cliente, platillo });

        if (vip) {
            await client.lPush("ordersQueue", order);
            console.log("⭐ VIP:", order);
        } else {
            await client.rPush("ordersQueue", order);
            console.log("📦 Normal:", order);
        }
    }

    res.send("Pedidos enviados");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor corriendo en puerto 3000");
});