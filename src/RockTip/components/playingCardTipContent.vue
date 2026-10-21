<script setup lang="ts">
import {computed} from 'vue';
import {abilityDescriptions, abilityLabels, cardKinds, cardRows, playingCardMetadata} from '../constants/playingCards';
const props = defineProps<{card: unknown; description?: unknown}>();
const card = computed(() => playingCardMetadata(props.card));
const description = computed(() => typeof props.description === 'string' && props.description !== 'null' ? props.description : '');
</script>

<template>
    <section class="playing-card-tip" aria-label="Statystyki karty">
        <template v-if="card">
            <div v-if="card.deck" class="playing-card-tip__stat"><span>Talia:</span> <strong>{{ card.deck === 'retro' ? 'Retro' : card.deck }}</strong></div>
            <div v-if="card.kind" class="playing-card-tip__stat"><span>Rodzaj karty:</span> <strong>{{ cardKinds[card.kind] ?? card.kind }}</strong></div>
            <div v-if="card.kind === 'unit' && card.strength !== null" class="playing-card-tip__stat" data-stat="playingCard.strength"><span>Siła karty:</span> <strong>{{ card.strength }}</strong></div>
            <div v-if="card.rows.length" class="playing-card-tip__stat"><span>Rząd:</span> <strong>{{ card.rows.map(row => cardRows[row] ?? row).join(' / ') }}</strong></div>
            <div v-if="card.kind === 'unit' && card.rows.length > 1" class="playing-card-tip__note">Wybierasz rząd przy zagraniu. Karta pozostaje w wybranym rzędzie.</div>
            <div v-if="card.hero" class="playing-card-tip__hero"><strong>★ Bohater</strong><div>Odporny na pogodę, róg, morale i pożogę. Nie można go zabrać manekinem ani wskrzesić medykiem.</div></div>
            <div v-if="card.kind === 'leader'" class="playing-card-tip__note">Zdolność dowódcy: raz na mecz.</div>
            <div v-for="(ability, index) in card.abilities" :key="ability + index" class="playing-card-tip__ability">
                <strong>{{ abilityLabels[ability] ?? ability }}</strong>
                <div v-if="abilityDescriptions[ability]">{{ abilityDescriptions[ability] }}<template v-if="ability === 'scorch' && card.kind === 'unit'"> Nie niszczy zagrywającej ją jednostki.</template></div>
            </div>
            <div v-if="card.generatedOnly" class="playing-card-tip__note">Karta przywoływana podczas gry. Nie można jej dołączyć do talii.</div>
        </template>
        <div v-else class="playing-card-tip__note">Brak danych karty.</div>
        <p v-if="description" class="playing-card-tip__description">{{ description }}</p>
    </section>
</template>

<style scoped>
.playing-card-tip{display:grid;gap:5px;padding-top:5px;border-top:1px solid #7776;text-align:left;overflow-wrap:anywhere}
.playing-card-tip__stat{display:flex;flex-wrap:wrap;gap:4px}.playing-card-tip__stat strong{color:var(--rockTip-item--color-statValue,#ffd54d)}
.playing-card-tip__hero{border-left:2px solid #d8b45c;padding-left:6px}.playing-card-tip__hero>strong{color:#edcb7d}
.playing-card-tip__ability>strong{color:var(--rockTip-item--color-statValue,#ffd54d)}.playing-card-tip__ability>div,.playing-card-tip__hero>div{margin-top:2px}
.playing-card-tip__note{opacity:.85}.playing-card-tip__description{margin:3px 0 0;padding-top:5px;border-top:1px solid #7776;white-space:pre-line;font-style:italic}
</style>
