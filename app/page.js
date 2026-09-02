"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState(null);

  async function generate() {
    setLoading(true);
    setMessage("Genererer billeder...");
    setProducts([]);
    setImages(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST"
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `API returnerede ikke gyldig JSON. Status: ${response.status}. Svar: ${
            responseText || "Tomt svar"
          }`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Der opstod en fejl under genereringen."
        );
      }

      setProducts(data.products || []);
      setImages(data.images || null);

      setMessage("4 billeder blev genereret.");
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
          {loading ? "GENERATING..." : "GENERATE"}
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {images && (
          <div className="generated-images">
            <h2>Genererede billeder</h2>

            <div className="image-grid">
              <div className="generated-image">
                <h3>Cover</h3>

                <img
                  src={`data:image/png;base64,${images.cover}`}
                  alt="Generated cover"
                />
              </div>

              <div className="generated-image">
                <h3>Billede 1</h3>

                <img
                  src={`data:image/png;base64,${images.image1}`}
                  alt="Generated image 1"
                />
              </div>

              <div className="generated-image">
                <h3>Billede 2</h3>

                <img
                  src={`data:image/png;base64,${images.image2}`}
                  alt="Generated image 2"
                />
              </div>

              <div className="generated-image">
                <h3>Billede 3</h3>

                <img
                  src={`data:image/png;base64,${images.image3}`}
                  alt="Generated image 3"
                />
              </div>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="products">
            <h2>Valgte produkter</h2>

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
