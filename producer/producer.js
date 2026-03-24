const redis = require("redis");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const client = redis.createClient({
    url: "redis://192.168.1.90:6380"
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

        const order = JSON.stringify({ cliente, platillo, vip });

        if (vip) {
            await client.lPush("ordersQueue", order);
            console.log("⭐ VIP:", order);
        } else {
            await client.rPush("ordersQueue", order);
            console.log("Normal:", order);
        }
    }

    res.send("Pedidos enviados");
});

app.get("/orders", async (req, res) => {
    try {
        const orders = await client.lRange("ordersQueue", 0, -1);
        const parsed = orders.map(o => JSON.parse(o));
        res.json(parsed);
    } catch (err) {
        res.status(500).send("Error al obtener pedidos");
    }
});

app.listen(4000, "0.0.0.0", () => {
    console.log("🚀 Servidor corriendo en puerto 4000");
});