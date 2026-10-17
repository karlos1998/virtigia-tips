import type {ItemSchema} from '../typings/schematics';
import {Attributes} from '../constants/attributes';
export type ComparableItem = ItemSchema['inner'];
const weaponCategories = new Set(['oneHanded','twoHanded','halfHanded','distances','wands','staffs']);
const equipmentCategories = new Set([...weaponCategories,'armors','helmets','boots','gloves','rings','necklaces','shields','auxiliary','arrows']);
export function comparisonSlot(category: string) {
    if (weaponCategories.has(category)) return 'weapon';
    if (category === 'shields' || category === 'auxiliary' || category === 'arrows') return 'auxiliary';
    return equipmentCategories.has(category) ? category : undefined;
}
export function findEquippedComparison(item: ComparableItem, equipped: ComparableItem[]) {
    // Hovering an equipped item must not compare it to another item from the same slot.
    if (equipped.some(other => String(other.id) === String(item.id))) return undefined;
    const slot = comparisonSlot(item.category);
    return slot ? equipped.find(other => comparisonSlot(other.category) === slot) : undefined;
}
const excluded = new Set(['quantity','maxQuantity','canSplit','lootedWith','lootedAt','petSrc','petActions','isUnidentified','keyDescription','hotelRoom','timelimit','expiresOn']);
export function comparisonStats(item: ComparableItem) {
    return Attributes.getOrdersList({schema:{inner:item,showId:false}}).bonuses.filter(stat => !excluded.has(stat));
}
export function missingComparisonStats(item: ComparableItem, other?: ComparableItem) {
    return other ? comparisonStats(other).filter(stat => !item.attributes[stat]) : [];
}
/** Compare only numeric values with identical shapes; metadata and textual effects have no numeric delta. */
export function attributeDifference(value: unknown, other: unknown): number[] | undefined {
    const a = Array.isArray(value) ? value : [value], b = Array.isArray(other) ? other : [other];
    if (a.length !== b.length || !a.length || !a.every(v=>typeof v==='number' && Number.isFinite(v)) || !b.every(v=>typeof v==='number' && Number.isFinite(v))) return;
    const difference = a.map((v,i)=>Math.round((v-b[i])*10000)/10000);
    return difference.some(v=>v!==0) ? difference : undefined;
}
