export interface PlayingCardMetadata {
    deck: string;
    kind: string;
    strength: number | null;
    hero: boolean;
    rows: string[];
    abilities: string[];
    generatedOnly: boolean;
}

export function playingCardMetadata(value: unknown): PlayingCardMetadata | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    const card = value as Record<string, unknown>;
    return {
        deck: typeof card.deck === 'string' ? card.deck : '',
        kind: typeof card.kind === 'string' ? card.kind : '',
        strength: typeof card.strength === 'number' && Number.isFinite(card.strength) ? card.strength : null,
        hero: card.hero === true,
        rows: Array.isArray(card.rows) ? card.rows.filter((row): row is string => typeof row === 'string') : [],
        abilities: Array.isArray(card.abilities) ? card.abilities.filter((ability): ability is string => typeof ability === 'string') : [],
        generatedOnly: card.generatedOnly === true,
    };
}

export const cardKinds: Record<string, string> = {unit: 'Jednostka', special: 'Specjalna', weather: 'Pogoda', leader: 'Dowódca'};
export const cardRows: Record<string, string> = {close: 'Zwarcie', ranged: 'Dystans', siege: 'Oblężenie'};

export const abilityLabels: Record<string, string> = {
    spy: 'Szpieg',
    medic: 'Medyk',
    bond: 'Więź',
    morale: 'Morale',
    horn: 'Róg',
    muster: 'Braterstwo',
    scorch: 'Pożoga',
    scorch_c: 'Pożoga zwarcia',
    avenger: 'Przemiana',
    frost: 'Mróz',
    fog: 'Mgła',
    rain: 'Deszcz',
    storm: 'Sztorm',
    clear: 'Czyste niebo',
    decoy: 'Manekin',
    foltest_king: 'Przywołaj mgłę',
    foltest_lord: 'Usuń pogodę',
    foltest_siegemaster: 'Róg oblężenia',
    foltest_son: 'Pożoga zwarcia',
    foltest_steelforged: 'Pożoga oblężenia'
};
export const abilityDescriptions: Record<string, string> = {
    spy: 'Trafia do rzędu przeciwnika i daje mu swoje punkty. Dobierasz do dwóch kart ze swojej talii.',
    medic: 'Wybierasz jednostkę ze swojego stosu odrzuconych i zagrywasz ją ponownie. Nie wskrzesza bohaterów ani kart specjalnych.',
    bond: 'Jednostki tej samej więzi w jednym rzędzie mnożą swoją siłę przez liczbę tych jednostek.',
    morale: 'Dodaje 1 punkt innym zwykłym jednostkom w swoim rzędzie. Nie wzmacnia siebie.',
    horn: 'Podwaja siłę zwykłych jednostek w rzędzie. Kilka rogów nie mnoży tego efektu; jednostka z rogiem nie wzmacnia sama siebie.',
    muster: 'Wzywa powiązane jednostki z ręki i pozostałej talii. Nie tworzy dodatkowych kopii ani nie przywołuje ze stosu odrzuconych.',
    scorch: 'Niszczy jednocześnie najsilniejsze zwykłe jednostki na obu stronach planszy. Remisujące jednostki również giną.',
    scorch_c: 'Niszczy najsilniejsze zwykłe jednostki zwarcia przeciwnika, gdy ich rząd ma co najmniej 10 punktów.',
    avenger:
        'Po usunięciu tej jednostki pojawia się jej następca. Po zakończeniu rundy następca wchodzi w kolejnej rundzie.',
    frost: 'Na obu stronach zmniejsza bazową siłę zwykłych jednostek zwarcia do 1.',
    fog: 'Na obu stronach zmniejsza bazową siłę zwykłych jednostek dystansowych do 1.',
    rain: 'Na obu stronach zmniejsza bazową siłę zwykłych jednostek oblężniczych do 1.',
    storm: 'Na obu stronach zmniejsza bazową siłę zwykłych jednostek dystansowych i oblężniczych do 1.',
    clear: 'Usuwa wszystkie aktywne karty pogody z planszy.',
    decoy: 'Zabiera wybraną zwykłą jednostkę z twojej strony planszy do ręki. Zostawia w jej miejscu manekin wart 0 punktów.',
    foltest_king: 'Zagrywa mgłę z pozostałej talii, jeśli jest dostępna.',
    foltest_lord: 'Usuwa wszystkie aktywne karty pogody z planszy.',
    foltest_siegemaster: 'Zapewnia efekt rogu w twoim rzędzie oblężniczym.',
    foltest_son:
        'Niszczy najsilniejsze zwykłe jednostki zwarcia przeciwnika, jeśli ten rząd ma co najmniej 10 punktów.',
    foltest_steelforged:
        'Niszczy najsilniejsze zwykłe jednostki oblężnicze przeciwnika, jeśli ten rząd ma co najmniej 10 punktów.'
};
