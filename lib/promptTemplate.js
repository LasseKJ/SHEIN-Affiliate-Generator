const PROMPT_TEMPLATE = `
Brug det vedhæftede template som præcis baggrund og layout.

Behold templateets layout, placering, proportioner, typografi, farver og dekorative elementer så tæt på originalen som muligt.

Dette er en produktslide med præcis tre produkter.

Indsæt de tre uploadede produktbilleder i de tre billedfelter.

PRODUKTBILLEDER:

Produktbillederne skal være det visuelle fokus i deres respektive sektioner.

Gør hvert produkt tydeligt, skarpt, rent og visuelt præsentabelt.

Produktet skal placeres naturligt og centreret i billedfeltet.

Sørg for at produktet fylder en passende og tydelig del af billedfeltet uden at blive for lille.

Brug hele det tilgængelige billedfelt effektivt, så produktet er let at se og genkende.

Fjern den originale baggrund fra hvert produktbillede, så kun selve produktet vises.

Rens forsigtigt kanterne omkring produktet, så produktet fremstår professionelt og pænt isoleret.

Forbedr produktbilledets visuelle kvalitet med diskret enhancement.

Produktet skal fremstå skarpt, klart, rent og velbelyst.

Forbedr forsigtigt kontrast, lys, skarphed og detaljer, når det er nødvendigt.

Enhancement må aldrig ændre selve produktets identitet eller design.

Behold produktets originale form, farve, detaljer, materiale, tekst, mønster og udseende.

Du må ikke ændre produktets form.

Du må ikke ændre produktets farve.

Du må ikke ændre produktets detaljer.

Du må ikke ændre produktets materiale.

Du må ikke ændre produktets tekst.

Du må ikke ændre produktets design.

Du må ikke tilføje nye detaljer til produktet.

Du må ikke fjerne eksisterende detaljer fra produktet.

Du må ikke generere nye produkter.

Du må ikke erstatte de uploadede produkter med andre produkter.

Du må ikke finde på eller tilføje produkter.

Produktet skal altid være det samme fysiske produkt som på det uploadede billede.

Produktbilledet må ikke beskæres på en måde, der skjuler dele af produktet.

Sørg for passende luft omkring produktet.

Undgå unødvendigt tomt område omkring produktet.

Produktet skal have en naturlig visuel størrelse i billedfeltet.

Produktet skal være i fokus og ikke baggrunden.

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

Behold præcis de uploadede produktbilleder som grundlag for produkterne.

Produktet skal være tydeligt, skarpt, centreret og visuelt fremhævet.

Gør produktbillederne rene og professionelle uden at ændre selve produkterne.

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

Ingen erstatning af produkterne.

Ingen opfundne produkter.

Ingen ændring af produktdesign.

OUTPUT:

Outputtet skal altid være præcis 9:16.

Outputformatet skal være vertikalt 9:16.

Lever som ét færdigt vertikalt katalogbillede i 9:16.

Billedet skal have solid hvid baggrund.

Billedet må ikke have gennemsigtig baggrund.

Alle tre produkter skal være tydelige og lette at se.

Alle tre produkter skal være skarpe og visuelt fremhævede.

Produktbillederne skal være pæne, rene og professionelt præsenterede.

Høj opløsning.

Klar og skarp tekst.

Produktnavne, koder og priser skal være lette at læse.

Ingen ekstra elementer uden for templateets eksisterende design.
`;

const COVER_PROMPT = `
Brug det vedhæftede forside template som præcis baggrund og behold hele det eksisterende design uændret.

Behold teksten “shein squishy codes” præcis som den er.

Behold farverne, typografien, blomsterne, sløjfen, hjerterne, stregerne, baggrunden og alle øvrige dekorative elementer uændret.

Der er vedhæftet præcis tre produktbilleder sammen med templaten.

De tre vedhæftede produktbilleder er de eneste produkter, der må bruges i resultatet.

Brug PRÆCIS de tre vedhæftede produktbilleder som visuel reference.

Indsæt præcis ét produkt fra hvert af de tre vedhæftede produktbilleder i det store blanke område under teksten.

Det første vedhæftede produktbillede skal bruges som Produkt 1.

Det andet vedhæftede produktbillede skal bruges som Produkt 2.

Det tredje vedhæftede produktbillede skal bruges som Produkt 3.

Bevar hvert produkts originale identitet.

Bevar hvert produkts originale form.

Bevar hvert produkts originale farve.

Bevar hvert produkts originale materiale.

Bevar hvert produkts originale detaljer.

Bevar hvert produkts originale mønster.

Bevar hvert produkts originale udseende.

Produkterne skal ligne de faktiske produkter fra de vedhæftede billeder og må ikke erstattes med andre produkter.

Du må ikke bruge produkter fra andre billeder.

Du må ikke vælge andre produkter.

Du må ikke generere nye produkter.

Du må ikke opfinde produkter.

Du må ikke ændre produkternes design.

Du må ikke ændre produkternes farver.

Du må ikke ændre produkternes form.

Du må ikke tilføje detaljer til produkterne.

Du må ikke fjerne detaljer fra produkterne.

Hvis produktbillederne har en original baggrund, skal baggrunden fjernes forsigtigt, så kun det originale produkt placeres på templaten.

Produktets kanter skal være rene og naturlige.

Placér de tre produkter elegant som en harmonisk lille gruppe i det store blanke område under teksten.

Produkt 1 skal placeres til venstre.

Produkt 2 skal placeres til højre.

Produkt 3 skal placeres let foran og mellem Produkt 1 og Produkt 2.

Produkterne må gerne overlappe hinanden en smule.

Sørg for at alle tre produkter er tydelige og lette at genkende.

Sørg for en naturlig størrelse på alle tre produkter.

Sørg for god luft omkring gruppen.

Ingen af produkterne må dække teksten.

Ingen af produkterne må dække de vigtigste dekorative elementer.

Giv hvert produkt en realistisk, blød og naturlig skygge på baggrunden.

Skyggerne skal få produkterne til at se fysisk placeret på designet ud.

Resultatet skal ligne et ægte æstetisk produktfoto integreret direkte i den eksisterende feminine kawaii template.

Resultatet må ikke ligne et kunstigt AI genereret produkt.

Ingen ekstra produkter.

Ingen ekstra tekst.

Ingen priser.

Ingen produktnavne.

Ingen produktkoder.

Ingen nye dekorative elementer.

Ingen TikTok ikoner.

Ingen TikTok interface.

Ingen ændring af templateets design.

Ingen ændring af templateets typografi.

Ingen ændring af templateets farver.

Ingen ændring af templateets dekorative elementer.

Formatet skal være præcis 9:16.

Lever ét færdigt vertikalt forsidebillede i 9:16.

Høj opløsning.

Skarpe og tydelige produkter.

De tre produkter skal være de samme produkter som i de tre vedhæftede produktbilleder.
`;

export function createPrompt(products) {
  if (!products || products.length !== 3) {
    throw new Error(
      "Prompten skal bruge præcis 3 produkter."
    );
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
    throw new Error(
      "Der skal bruges præcis 9 produkter."
    );
  }

  return [
    createPrompt(
      products.slice(0, 3)
    ),
    createPrompt(
      products.slice(3, 6)
    ),
    createPrompt(
      products.slice(6, 9)
    )
  ];
}

export function createCoverPrompt() {
  return COVER_PROMPT;
}
