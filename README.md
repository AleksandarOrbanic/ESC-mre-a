# ESC Mreža 🎤✨

![Eurovision Banner](./src/assets/images/eurovision_stage_vibe_1779108990832.png)

## Opis aplikacije

**ESC Mreža** je napredna interaktivna web aplikacija za vizualizaciju i analizu podataka o pjesmama koje su ostvarile vrhunske rezultate (Top 3) na **Eurosongu (Eurovision Song Contest)** u razdoblju od 2010. do 2025. godine.

Aplikacija koristi snagu **teorije grafova i D3.js knjižnice** kako bi prikazala složenu mrežu odnosa između:
- 🎶 **Pjesama i izvođača**
- 🌍 **Država i regija**
- 🎸 **Glazbenih žanrova**
- 🗣️ **Jezika izvedbe**
- 👥 **Tipova izvođača** (solo, duet, grupa)
- 🗳️ **Izvora podrške** (žiri vs. publika)

### Ključne značajke
- **Interaktivna mrežna vizualizacija:** Svaki čvor predstavlja podatak, a njegova veličina označava učestalost pojavljivanja u "Top 3" uzorku.
- **Dubinsko filtriranje:** Klikom na bilo koji faktor (npr. žanr "Pop" ili regija "Balkan") izoliraju se samo povezane pjesme i države.
- **Detaljni uvidi:** Hover i klik efekti pružaju iscrpne informacije o svakoj izvedbi, uključujući bodove, redoslijed nastupa i specifične deskripcije.
- **Metodološka analiza:** Aplikacija ističe razliku između korelacije i kauzalnosti, prikazujući trendove bez nametanja apsolutnih uzroka uspjeha.

## Tehnologije

Aplikacija je izgrađena korištenjem modernih web tehnologija:
- **React 18** (Vite runtime)
- **TypeScript** za sigurnost tipova
- **D3.js** za kompleksnu simulaciju fizike i renderiranje grafa
- **Tailwind CSS** za poliran i responzivan dizajn
- **Framer Motion** (motion/react) za glatke tranzicije UI elemenata
- **Lucide React** za intuitivne ikone

## Instalacija i pokretanje

Kako biste pokrenuli aplikaciju lokalno, slijedite ove korake:

1. **Klonirajte spremište** (ili preuzmite ZIP datoteku).
2. **Instalirajte ovisnosti:**
   ```bash
   npm install
   ```
3. **Pokrenite razvojni poslužitelj:**
   ```bash
   npm run dev
   ```
4. Otvorite vaš preglednik na adresi `http://localhost:3000`.

## Kako koristiti aplikaciju

1.  **Istraživanje mreže:** Koristite kotačić miša ili "pinch" gestu za zumiranje grafa. Povucite čvorove kako biste istražili njihove međusobne veze.
2.  **Filtriranje podataka:** Kliknite na bilo koji čvor faktora (npr. žanr, jezik, tip izvođača ili regija). Graf će se automatski filtrirati i prikazati samo povezane pjesme i države.
3.  **Pregled detalja faktora:** Prilikom filtriranja, na desnoj strani otvorit će se panel s detaljnim popisom svih pjesama koje dijele taj faktor.
4.  **Pregled detalja pjesme:** Kliknite na bilo koji čvor pjesme za prikaz detaljnih informacija o izvedbi, uključujući bodove, plasman i zanimljive opise.
5.  **Resetiranje prikaza:** U bilo kojem trenutku kliknite na gumb "Resetiraj prikaz" u zaglavlju ili info panelu kako biste se vratili na puni prikaz cijele mreže.
6.  **Metodologija:** Kliknite na gumb "Metodologija" u zaglavlju za važne napomene o načinu interpretacije podataka i mrežne centralnosti.

## Napredni vodič za analizu (Use Cases)

Aplikacija omogućuje dubinsko istraživanje kroz nekoliko analitičkih faza:

*   **Identifikacija "Meta-trenda":** Najveći čvorovi u mreži (poput *Pop*, *English* ili *Scandinavia*) vizualno predstavljaju dominantne arhetipove uspjeha. Što je čvor veći, to je statistička vjerojatnost da će pjesma s tim atributom završiti u Top 3 veća.
*   **Otkrivanje korelacija:** Kliknite na manji, specifičniji čvor (npr. *Rock*). Promatrajte koje su se države "usudile" ući u Top 3 s tim žanrom. Često ćete vidjeti da se određene države (klasteri) stalno vraćaju istim uspješnim receptima.
*   **Analiza anomalija:** Pronađite pobjedničke pjesme (zlatni rub) koje su povezane s vrlo malim čvorovima. To su pjesme koje su pobijedile "protiv struje" (npr. bez engleskog jezika ili u netipičnom žanru).
*   **Geopolitički oblaci:** Promatrajte kako se čvorovi država grupiraju oko regija. Možete uočiti je li uspjeh određene regije vezan uz zajednički glazbeni stil ili pak raznoliku strategiju.

---
*Izrađeno s ljubavlju prema glazbi i analitici podataka.* 🇪🇺🎶
