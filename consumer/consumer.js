const redis = require("redis");

const client = redis.createClient({
    url: "redis://192.168.1.90:6380" // IP SERVER
});

client.connect().then(() => console.log("Cocina lista"));

async function processOrders() {
    while (true) {
        const order = await client.lPop("ordersQueue");

        if (order) {
            const { cliente, platillo } = JSON.parse(order);

            console.log(`Preparando pedido de ${cliente}: ${platillo}...`);

            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log(`Pedido listo para ${cliente}: ${platillo}`);

            await client.publish("ordersReady", JSON.stringify({ cliente, platillo }));

        } else {
            console.log("Esperando nuevos pedidos...");
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

processOrders();