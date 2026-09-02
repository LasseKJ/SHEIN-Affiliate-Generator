const PROMPT_TEMPLATE = `
Brug det vedhæftede template som præcis baggrund og layout.

Behold templateets layout, placering, proportioner, typografi, farver og dekorative elementer så tæt på originalen som muligt.

Dette er en produktslide med præcis tre produkter.

Indsæt de tre uploadede produktbilleder i de tre billedfelter.

Fjern den originale baggrund fra hvert produktbillede, så kun selve produktet vises.

Behold selve produktet præcis som på det uploadede billede.

Du må ikke ændre produktets form, farve, detaljer, materiale, tekst eller udseende.

Du må ikke generere nye produkter.

Du må ikke erstatte de uploadede produkter med andre produkter.

Du må ikke finde på eller tilføje produkter.

Produktbillederne skal placeres naturligt i billedfelterne uden unødvendig beskæring.

Fjern de stiplede linjer omkring billedfelterne.

Templateets pladsholdertekster skal erstattes med oplysningerne nedenfor.

Produkt 1:
Navn: {{PRODUCT_1_NAME}}
Kode: {{PRODUCT_1_CODE}}
Pris: {{PRODUCT_1_PRICE}}

Produkt 2:
Navn: {{PRODUCT_2_NAME}}
Kode: {{PRODUCT_2_CODE}}
Pris: {{PRODUCT_2_PRICE}}

Produkt 3:
Navn: {{PRODUCT_3_NAME}}
Kode: {{PRODUCT_3_CODE}}
Pris: {{PRODUCT_3_PRICE}}

KRAV:

Behold præcis samme layout som template.

Behold præcis de uploadede produktbilleder.

Ændr ikke produkterne.

Find ikke på nye produkter.

Fjern pladsholderen BILLEDE 1 og indsæt Produkt 1.

Fjern pladsholderen BILLEDE 2 og indsæt Produkt 2.

Fjern pladsholderen BILLEDE 3 og indsæt Produkt 3.

Fjern NAVN 1 og indsæt produktets rigtige navn.

Fjern NAVN 2 og indsæt produktets rigtige navn.

Fjern NAVN 3 og indsæt produktets rigtige navn.

Fjern KODE 1 og indsæt den rigtige kode.

Fjern KODE 2 og indsæt den rigtige kode.

Fjern KODE 3 og indsæt den rigtige kode.

Behold teksten Code: under produktnavnet.

Vis produktkoden i den lyserøde afrundede boks.

Vis prisen stort med rød tekst under koden.

Behold de lyserøde dekorative elementer, hjerter, streger og øvrige elementer fra templaten.

Behold hvid baggrund.

Behold ens afstand mellem alle tre produktsektioner.

Ingen ekstra overskrift.

Ingen ekstra tekst.

Ingen ekstra produkter.

Ingen ændring af baggrundsdesignet.

Ingen ændring af produktbilledernes udseende.

Lever som ét færdigt vertikalt katalogbillede.

Formatet skal være 9:16.

Billedet skal have solid hvid baggrund.

Billedet må ikke have gennemsigtig baggrund.

Høj opløsning.

Klar og skarp tekst.

Produktnavne, koder og priser skal være lette at læse.
`;

export function createPrompt(products) {
  if (!products || products.length !== 3) {
    throw new Error("Prompten skal bruge præcis 3 produkter.");
  }

  return PROMPT_TEMPLATE
    .replace(
      "{{PRODUCT_1_NAME}}",
      products[0]["Product Name"]
    )
    .replace(
      "{{PRODUCT_1_CODE}}",
      products[0]["Product Code"]
    )
    .replace(
      "{{PRODUCT_1_PRICE}}",
      `${products[0]["Price"]} ${products[0]["Currency"]}`
    )
    .replace(
      "{{PRODUCT_2_NAME}}",
      products[1]["Product Name"]
    )
    .replace(
      "{{PRODUCT_2_CODE}}",
      products[1]["Product Code"]
    )
    .replace(
      "{{PRODUCT_2_PRICE}}",
      `${products[1]["Price"]} ${products[1]["Currency"]}`
    )
    .replace(
      "{{PRODUCT_3_NAME}}",
      products[2]["Product Name"]
    )
    .replace(
      "{{PRODUCT_3_CODE}}",
      products[2]["Product Code"]
    )
    .replace(
      "{{PRODUCT_3_PRICE}}",
      `${products[2]["Price"]} ${products[2]["Currency"]}`
    );
}

export function createPromptSet(products) {
  if (!products || products.length !== 9) {
    throw new Error("Der skal bruges præcis 9 produkter.");
  }

  return [
    createPrompt(products.slice(0, 3)),
    createPrompt(products.slice(3, 6)),
    createPrompt(products.slice(6, 9))
  ];
}
