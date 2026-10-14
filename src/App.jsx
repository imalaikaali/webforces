import { useState } from "react";
import "./App.css";

const INITIAL_ORDERS = [
  { id: "#21", pickup: "Gulberg", dropoff: "DHA", distance: 1.4 },
  { id: "#08", pickup: "Model Town", dropoff: "Johar Town", distance: 3.2 },
  { id: "#15", pickup: "Cantt", dropoff: "Garden Town", distance: 5.8 },
];

const STATUSES = ["Picked Up", "In Transit", "Delivered"];
const MAX_BAR_KM = 6; // distance that fills the bar completely

function distanceColor(km) {
  if (km < 2) return "green";
  if (km <= 4) return "yellow";
  return "red";
}

function DistanceBar({ km }) {
  const width = Math.min((km / MAX_BAR_KM) * 100, 100);
  return (
    <div className="bar-track">
      <div
        className={`bar-fill ${distanceColor(km)}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function OrderDetails({ order }) {
  return (
    <>
      <div className="order-id">Order {order.id}</div>
      <p><span className="label">Pickup:</span> {order.pickup}</p>
      <p><span className="label">Dropoff:</span> {order.dropoff}</p>
      <p><span className="label">Distance:</span> {order.distance} km</p>
      <DistanceBar km={order.distance} />
    </>
  );
}

export default function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState(null);
  const [status, setStatus] = useState(STATUSES[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hi, is my order on the way?" },
    { id: 2, sender: "user", text: "Please call when you arrive." },
  ]);
  const [draft, setDraft] = useState("");

  // Nearest first
  const sortedOrders = [...orders].sort((a, b) => a.distance - b.distance);

  function acceptOrder(order) {
    setActiveOrder(order);
    setStatus(STATUSES[0]);
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
  }

  function finishDelivery() {
    setActiveOrder(null);
  }

  function sendMessage(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: "rider", text }]);
    setDraft("");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>LogiPulse — Rider Dashboard</h1>
      </header>

      <main className="layout">
        {/* Left column */}
        <section className="column">
          <h2>Available Orders</h2>

          {sortedOrders.length === 0 && (
            <p className="empty">No orders available right now.</p>
          )}

          {sortedOrders.map((order) => (
            <div className="card" key={order.id}>
              <OrderDetails order={order} />
              <button
                className="btn"
                onClick={() => acceptOrder(order)}
                disabled={activeOrder !== null}
                title={
                  activeOrder
                    ? "Finish your current delivery first"
                    : "Accept this order"
                }
              >
                Accept
              </button>
            </div>
          ))}
        </section>

        {/* Right column */}
        <div className="column-group">
          <section className="column">
            <h2>My Active Delivery</h2>

            {!activeOrder ? (
              <p className="empty">Accept an order to start a delivery.</p>
            ) : (
              <div className="card">
                <OrderDetails order={activeOrder} />

                <label className="status-row">
                  <span className="label">Status:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                {status === "Delivered" && (
                  <button className="btn" onClick={finishDelivery}>
                    Finish delivery
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="column">
            <h2>Chat</h2>

            <div className="chat">
              <div className="messages">
                {messages.map((m) => (
                  <div key={m.id} className={`message ${m.sender}`}>
                    {m.text}
                  </div>
                ))}
              </div>

              <form className="chat-form" onSubmit={sendMessage}>
                <input
                 type="text"
                 value={draft}
                 onChange={(e) => setDraft(e.target.value)}
                 placeholder="Type a message..."
                />
                <button className="btn" type="submit">
                  Send
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}