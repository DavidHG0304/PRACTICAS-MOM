import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0f0e0d;
    color: #f0ede8;
    font-family: 'DM Sans', sans-serif;
  }

  .dashboard {
    min-height: 100vh;
    padding: 40px 32px;
    background: #0f0e0d;
    background-image:
      radial-gradient(ellipse at 20% 10%, rgba(200,140,60,0.07) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 90%, rgba(200,100,60,0.05) 0%, transparent 50%);
  }

  .header {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 44px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding-bottom: 24px;
  }

  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    color: #f5e6c8;
    letter-spacing: -0.5px;
  }

  .live-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #aaa;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #5dde7a;
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  .sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  @media (max-width: 700px) {
    .sections { grid-template-columns: 1fr; }
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title.vip { color: #e2a84b; }
  .section-title.normal { color: #8fa3b8; }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.2;
  }

  .count-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    padding: 2px 9px;
    border-radius: 20px;
    background: rgba(255,255,255,0.06);
  }

  .order-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s, transform 0.2s;
    animation: slideIn 0.3s ease both;
  }

  .order-card:hover {
    background: rgba(255,255,255,0.06);
    transform: translateY(-1px);
  }

  .order-card.vip {
    border-left: 3px solid #e2a84b;
    background: rgba(226,168,75,0.05);
  }

  .order-card.vip:hover {
    background: rgba(226,168,75,0.09);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .client-name {
    font-weight: 500;
    font-size: 0.95rem;
    color: #f0ede8;
  }

  .order-card.vip .client-name { color: #f5e0a8; }

  .dish-name {
    font-size: 0.82rem;
    color: #7a7670;
    margin-top: 3px;
    font-weight: 300;
  }

  .vip-star {
    font-size: 1.1rem;
    opacity: 0.8;
  }

  .empty {
    text-align: center;
    padding: 32px 0;
    color: #3a3835;
    font-size: 0.88rem;
    letter-spacing: 0.5px;
  }
`;

function OrderCard({ order, isVip }) {
  return (
    <div className={`order-card ${isVip ? "vip" : ""}`}>
      <div>
        <div className="client-name">{order.cliente}</div>
        <div className="dish-name">{order.platillo}</div>
      </div>
      {isVip && <span className="vip-star">★</span>}
    </div>
  );
}

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      fetch("http://192.168.1.90:4000/orders")
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(() => {});
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const vipOrders = orders.filter(o => o.vip);
  const normalOrders = orders.filter(o => !o.vip);

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">
        <div className="header">
          <h1>Dashboard de Pedidos</h1>
          <span className="live-badge">
            <span className="live-dot" />
            En vivo
          </span>
        </div>

        <div className="sections">
          <div>
            <div className="section-title vip">
              VIP
              <span className="count-badge">{vipOrders.length}</span>
            </div>
            {vipOrders.length === 0
              ? <div className="empty">Sin pedidos VIP</div>
              : vipOrders.map((o, i) => (
                  <OrderCard key={i} order={o} isVip />
                ))
            }
          </div>

          <div>
            <div className="section-title normal">
              Normales
              <span className="count-badge">{normalOrders.length}</span>
            </div>
            {normalOrders.length === 0
              ? <div className="empty">Sin pedidos</div>
              : normalOrders.map((o, i) => (
                  <OrderCard key={i} order={o} isVip={false} />
                ))
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default App;