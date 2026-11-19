"use client";

import { useEffect, useState } from "react";

const ENDPOINT = "/api/generate-dresses";

export default function DressGenerator() {
  const [products, setProducts] = useState([]);
  const [code, setCode] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const selectedProduct = products.find((product) => product.code === code);

  async function loadProducts() {
    setLoadingProducts(true);
    setError("");
    setCode("");
    setResult(null);
    try {
      const response = await fetch(ENDPOINT);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProducts(data.products);
      if (!data.products.length) setError("Der er ingen aktive kjoler med billede og kode i Google Sheets.");
    } catch (error) {
      setError(error.message || "Kunne ikke hente kjoler.");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function generate(event) {
    event.preventDefault();
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Kunne ikke generere kjolebilledet.");
      }

      setResult({ code, image: await response.blob() });
    } catch (error) {
      setError(error.message || "Kunne ikke generere kjolebilledet.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="clothing-generator dress-generator">
      <div className="clothing-hero">
        <h1>Dress <span>Generator</span></h1>
        <form className="dress-controls" onSubmit={generate}>
          {!products.length && (
            <button className="generate-button" type="button" onClick={loadProducts} disabled={loadingProducts}>
              {loadingProducts ? "Henter kjoler…" : "Hent kjoler fra Sheets"}
            </button>
          )}
          {products.length > 0 && (
            <>
              <label htmlFor="dress-code">Kjolekode</label>
              <select id="dress-code" value={code} disabled={generating} onChange={(event) => {
                setCode(event.target.value);
                setResult(null);
                setError("");
              }}>
                <option value="">Vælg en kode</option>
                {products.map((product) => (
                  <option key={product.code} value={product.code}>{product.code}</option>
                ))}
              </select>
              {selectedProduct && (
                <img className="dress-reference" src={selectedProduct.imageUrl} alt={`Produktbillede for ${code}`} />
              )}
              <button className="generate-button" type="submit" disabled={!selectedProduct || generating}>
                {generating ? "Genererer billede…" : "Læg kjolen på sengen"}
              </button>
            </>
          )}
        </form>
        {generating && <p role="status">Billedet kan tage et par minutter.</p>}
        {error && <p role="alert">{error}</p>}
      </div>
      {result && <DressResult result={result} />}
    </section>
  );
}

function DressResult({ result }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const imageUrl = URL.createObjectURL(result.image);
    setUrl(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, [result]);

  if (!url) return null;

  return (
    <section className="clothing-results dress-result">
      <h2>{result.code}</h2>
      <img src={url} alt={`Kjole ${result.code} lagt på en seng`} />
      <a className="generate-button" href={url} download={`dress-${result.code.replace(/[^a-zA-Z0-9_-]/g, "-")}.webp`}>
        Download billede
      </a>
    </section>
  );
}
