import { useMemo, useState } from "react";

export default function App() {
  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([{ title: "Malerarbeiten", qty: 1, price: 250 }]);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.qty || 0) * Number(it.price || 0), 0);
  }, [items]);

  function updateItem(index, key, value) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [key]: value } : it))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { title: "", qty: 1, price: 0 }]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Angebot Generator (Demo)</h1>
        <span style={{ opacity: 0.7 }}>React-only • no backend</span>
      </header>

      <section style={{ marginTop: 18, padding: 16, border: "1px solid #e5e5e5", borderRadius: 12 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Kunde</label>
        <input
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="z.B. Max Mustermann"
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </section>

      <section style={{ marginTop: 18, padding: 16, border: "1px solid #e5e5e5", borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Positionen</h2>
          <button
            onClick={addItem}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            + Position
          </button>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {items.map((it, idx) => {
            const lineTotal = Number(it.qty || 0) * Number(it.price || 0);
            return (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 0.6fr 0.8fr 0.8fr 0.4fr",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <input
                  value={it.title}
                  onChange={(e) => updateItem(idx, "title", e.target.value)}
                  placeholder="Beschreibung"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
                <input
                  type="number"
                  min="0"
                  value={it.qty}
                  onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  placeholder="Menge"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
                <input
                  type="number"
                  min="0"
                  value={it.price}
                  onChange={(e) => updateItem(idx, "price", e.target.value)}
                  placeholder="Einzelpreis €"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
                />
                <div style={{ padding: 10, borderRadius: 10, background: "#f7f7f7", border: "1px solid #eee" }}>
                  {lineTotal.toFixed(2)} €
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  title="Löschen"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ padding: 14, borderRadius: 12, border: "1px solid #e5e5e5", minWidth: 240 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ opacity: 0.7 }}>Kunde</span>
              <b>{customer || "—"}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Summe</span>
              <b>{total.toFixed(2)} €</b>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: 18, opacity: 0.7, fontSize: 13 }}>
        Not: Bu demo sadece frontend. Sonra backend ekleyip kayıt + PDF yapacağız.
      </footer>
    </div>
  );
}