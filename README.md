# ESC Mreža 🎤✨

![Eurovision Banner](./src/assets/images/eurovision_banner_1779108339878.png)

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

## Struktura projekta

- `/src/components`: UI komponente (Graf, Detalji pjesme, Detalji faktora).
- `/src/data.ts`: Centralni repozitorij podataka o ESC pjesmama i prijevodi.
- `/src/App.tsx`: Glavna logika aplikacije i upravljanje stanjem.

---
*Izrađeno s ljubavlju prema glazbi i analitici podataka.* 🇪🇺🎶
