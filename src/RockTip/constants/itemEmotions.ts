/**
 * Emotions an item can show (attribute `useEmotion`, Margonem emotion names). `targeted` emotions are thrown at
 * another player by dragging the item onto them; the rest are shown on the user.
 */
export interface ItemEmotionInfo {
    label: string;
    targeted: boolean;
}

const self = (label: string): ItemEmotionInfo => ({label, targeted: false});
const targeted = (label: string): ItemEmotionInfo => ({label, targeted: true});

export const ITEM_EMOTIONS: Record<string, ItemEmotionInfo> = {
    banki: self('Bańki mydlane'),
    curse: self('Klątwa'),
    emonutki: self('Nutki'),
    guma1: self('Balon z gumy (truskawkowy)'),
    guma2: self('Balon z gumy (jagodowy)'),
    guma3: self('Balon z gumy (malinowy)'),
    guma4: self('Balon z gumy (jabłkowy)'),
    kuciak: self('Kurczaczek'),
    ptaszek: self('Papuga'),
    stars: self('Gwiazdki'),
    termofor: self('Termofor'),
    emosnow: self('Śnieżyca'),
    ghost: self('Duch'),
    water: self('Śmingus-dyngus'),
    zombie: self('Zombie'),
    bat: self('Nietoperz'),
    spider: self('Pająk'),
    angry: self('Złość'),
    fire_1: self('Sztuczne ognie (fioletowe)'),
    fire_2: self('Sztuczne ognie (błękitne)'),
    fire_3: self('Sztuczne ognie (czerwone)'),
    fire_4: self('Sztuczne ognie (różowe)'),
    fire_5: self('Sztuczne ognie (zielone)'),
    fire_6: self('Sztuczne ognie (niebieskie)'),
    fire_7: self('Sztuczne ognie (białe)'),
    fire_8: self('Ognista ósemka'),
    fire_9: self('Czaszka z dymu'),
    fireworks: self('Fajerwerki'),
    lampion1: self('Lampion'),
    lampion2: self('Lampion (czerwony)'),
    lampion3: self('Lampion'),
    lampion4: self('Lampion (zielony)'),
    lampion5: self('Lampion'),
    'flag-anglia.gif': self('Flaga Anglii'),
    'flag-chorwacja.gif': self('Flaga Chorwacji'),
    'flag-czechy.gif': self('Flaga Czech'),
    'flag-dania.gif': self('Flaga Danii'),
    'flag-francja.gif': self('Flaga Francji'),
    'flag-grecja.gif': self('Flaga Grecji'),
    'flag-hiszpania.gif': self('Flaga Hiszpanii'),
    'flag-holandia.gif': self('Flaga Holandii'),
    'flag-irlandia.gif': self('Flaga Irlandii'),
    'flag-niemcy.gif': self('Flaga Niemiec'),
    'flag-polska.gif': self('Flaga Polski'),
    'flag-portugalia.gif': self('Flaga Portugalii'),
    'flag-rosja.gif': self('Flaga Rosji'),
    'flag-skull.gif': self('Piracka bandera'),
    'flag-szwecja.gif': self('Flaga Szwecji'),
    'flag-ukraina.gif': self('Flaga Ukrainy'),
    'flag-wlochy.gif': self('Flaga Włoch'),
    buzia1: targeted('Buziak'),
    buzia2: targeted('Buzia świnki'),
    roza: targeted('Róża'),
    cocos: targeted('Kokos'),
    emohug1: targeted('Świąteczny uścisk'),
    emohug2: targeted('Mocny świąteczny uścisk'),
    emohug3: targeted('Uścisk'),
    gift: targeted('Prezent'),
    holly: targeted('Jemioła'),
    snowball: targeted('Śnieżka'),
    pillow: targeted('Bitwa na poduszki'),
    kiss: targeted('Pocałunek'),
    kiss2: targeted('Serdeczne myśli'),
};

export function describeItemEmotion(name: string): string {
    const emotion = ITEM_EMOTIONS[name];
    if (!emotion) {
        return `Wyraża emocję: ${name}`;
    }
    return emotion.targeted
        ? `Wyraża emocję wobec innego gracza: ${emotion.label}<br><i>Przeciągnij przedmiot na gracza, aby go użyć</i>`
        : `Wyraża emocję: ${emotion.label}`;
}
