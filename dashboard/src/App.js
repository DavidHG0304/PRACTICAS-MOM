import { useEffect, useState } from "react";

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      fetch("http://192.168.1.90:4000/orders") // ← tu IP
        .then(res => res.json())
        .then(data => setOrders(data));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Dashboard de Pedidos</h1>

      <h2>⭐ VIP</h2>
      {orders.filter(o => o.vip).map((o, i) => (
        <div key={i} style={{ color: "red" }}>
          {o.cliente} - {o.platillo}
        </div>
      ))}

      <h2>📦 Normales</h2>
      {orders.filter(o => !o.vip).map((o, i) => (
        <div key={i}>
          {o.cliente} - {o.platillo}
        </div>
      ))}
    </div>
  );
}

export default App;