"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  async function generate() {
    setLoading(true);
    setMessage("Henter produkter fra Google Sheet...");
    setProducts([]);

    try {
      const response = await fetch("/api/products");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Der opstod en fejl.");
      }

      setProducts(data.products || []);

      setMessage(
        `Google Sheet forbindelse virker. ${data.products?.length || 0} produkter blev hentet.`
      );
    } catch (error) {
      setMessage(`Fejl: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <div className="badge">SHEIN AFFILIATE TOOL</div>

        <h1>SHEIN Affiliate Generator</h1>

        <p className="subtitle">
          Generer affiliate content automatisk fra dine produkter.
        </p>

        <button onClick={generate} disabled={loading}>
          {loading ? "LOADING..." : "GENERATE"}
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {products.length > 0 && (
          <div className="products">
            <h2>Produkter hentet</h2>

            {products.map((product, index) => (
              <div className="product" key={index}>
                <strong>{product["Product Name"]}</strong>

                <div>
                  Produkt ID: {product["Product ID"]}
                </div>

                <div>
                  Kategori: {product["Category"]}
                </div>

                <div>
                  Produktkode: {product["Product Code"]}
                </div>

                <div>
                  Pris: {product["Price"]} {product["Currency"]}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="status">
          <span className="dot"></span>
          System ready
        </div>
      </div>
    </main>
  );
}
