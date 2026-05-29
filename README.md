# Virtigia Tips

Biblioteka tooltipów używana przez ekosystem Virtigii. Renderuje opisy przedmiotów, NPC, postaci, petów, grobów i własnych treści HTML w spójnym stylu gry.

Pakiet jest używany między innymi przez `virtigia-game-client`, `virtigia-map-editor` i `virtigia-world-admin`, dzięki czemu przedmiot albo NPC wygląda tak samo w kliencie gry i w narzędziach administracyjnych.

## Co Oferuje

| Obszar | Funkcje |
| --- | --- |
| Item tips | nazwa, rzadkość, grafika, statystyki, bonusy, wymagania, tagi i akcje |
| NPC tips | nazwa, poziom, profesja, ranga, grafika i podstawowe informacje |
| Other tips | tooltipy postaci i innych graczy |
| Pet tips | tooltipy zwierzaków |
| RIP tips | tooltipy grobów/martwych postaci |
| HTML tips | bezpieczne renderowanie własnej treści |
| Vue directive | łatwe podpinanie tooltipów do elementów UI |
| Renderer testowy | render tooltipa do HTML przez `renderRockTipToHtml` |

## Atrybuty Przedmiotów

Biblioteka zna kolejność, grupowanie i tłumaczenia atrybutów przedmiotów. Dzięki temu opisy są czytelne i stabilne niezależnie od miejsca użycia.

### Akcje

- Dodanie doświadczenia po następnym zabiciu.
- Dodanie doświadczenia ulepszenia.
- Dodanie drakonitu.
- Zmiana zmęczenia.
- Zmiana staminy.
- Podgląd lootboxa.
- Leczenie w walce.
- Dodanie złota.
- Otwieranie depozytu.
- Otwieranie depozytu klanowego.
- Otwieranie aukcji.
- Otwieranie poczty.
- Teleportacja.
- Ucieczka z walki.
- Użycie emotki.
- Użycie outfitu.
- Lokalizowanie NPC.
- Lokalizowanie herosa.
- Dokładne lokalizowanie herosa.
- Otwieranie książki.
- Użycie peta.
- Odwiązanie przedmiotu od właściciela.
- Odwiązanie przedmiotu trwale związanego.

### Bonusy

- Ilość i maksymalna ilość.
- Bonus legendarny.
- Informacja o źródle łupu.
- Opis.
- Grafika peta.
- Bonus szansy na legendarny łup.
- Bonus szansy na heroiczny łup.
- Minimalna szansa na łup.
- Bonus doświadczenia za walkę.
- Szansa zachowania strzały.
- Szybkość ataku.
- Redukcje leczenia i prędkości przeciwnika.
- Głębokie rany.
- Niszczenie pancerza.
- Blok przebicia.
- Zdrowie za siłę.
- Przebicie pancerza.
- Redukcja many przeciwnika.
- Redukcje krytyka, many, odporności, uniku i mocy krytycznej.
- Unik, zdrowie, energia, mana, stamina.
- Atrybuty bazowe: intelekt, siła, zręczność.
- Blok.
- Absorpcja fizyczna i magiczna.
- Moc krytyczna fizyczna i magiczna.
- Procent ulepszenia per rzadkość.
- Kategorie możliwe do ulepszania i przechowywania.
- Redukcja wymagań poziomu per rzadkość.
- Odporności na truciznę, światło, lód i ogień.
- Szansa na kontrę.
- Obrona.
- Przywracanie zdrowia.
- Obrażenia fizyczne i żywiołowe.
- Pojemność torby.
- Czasowe limity.
- Przedmiot niezidentyfikowany.

### Limity

- Wymagane profesje.
- Ograniczenie do map.
- Wymagany intelekt.
- Wymagana siła.
- Wymagana zręczność.
- Wymagany poziom.
- Cooldown.
- Data wygaśnięcia.
- Wymagany quest.

### Tagi

- Brak możliwości przechowywania w depozycie klanowym.
- Przedmiot wiąże się trwale po zakupie.
- Brak możliwości przechowywania w depozycie.
- Przedmiot trwale związany.
- Zwój obniżenia poziomu.
- Przedmiot wiąże się po założeniu.
- Zwój odwiązania.
- Brak możliwości wystawienia na aukcji.
- Przedmiot związany z właścicielem.
- Zwój przywołania.
- Zwój cofnięcia.
- Przedmiot odzyskany.
- Przedmiot przeklęty.
- Czas do zniknięcia.
- Data wygaśnięcia.
- Brak możliwości usunięcia.

## Eksporty

Pakiet eksportuje:

- `ToolTipDirective`.
- `RockTip`.
- `useToolTip`.
- typy payloadów: `HtmlPayload`, `ItemPayload`, `NpcPayload`, `OtherPayload`, `PetPayload`, `RipPayload`.
- `renderRockTipToHtml`.
- plik stylów `virtigia-tips/style.css`.

## Przykład Użycia

```ts
import { RockTip, ToolTipDirective, useToolTip } from 'virtigia-tips';
import 'virtigia-tips/style.css';
```

## Instalacja Z Gita

W repozytoriach Virtigii pakiet może być podpinany bez publikacji do npm:

```json
{
  "dependencies": {
    "virtigia-tips": "github:karlos1998/virtigia-tips#main"
  }
}
```

## Komendy

```bash
npm install
npm run dev
npm run build
```

Preview:

```bash
npm run preview
```

## Powiązane Repozytoria

| Repozytorium | Rola |
| --- | --- |
| `virtigia-game-client` | główne miejsce użycia tooltipów w grze |
| `virtigia-map-editor` | podglądy itemów i NPC w edytorze |
| `virtigia-world-admin` | podglądy danych świata |
| `virtigia-engine` | implementacja części atrybutów widocznych w tooltipach |

