<script setup lang="ts">
import { computed } from 'vue';
import { abilityLabels, cardRows, cardKinds } from '../constants/playingCards';
const props = defineProps<{ type: string }>();
const label = computed(() => cardRows[props.type] ?? abilityLabels[props.type] ?? cardKinds[props.type] ?? props.type);
const aliases: Record<string, string> = {foltest_king:'fog',foltest_lord:'clear',foltest_siegemaster:'horn',foltest_son:'scorch_c',foltest_steelforged:'scorch',scorch_c:'scorch'};
const symbol = computed(() => aliases[aliases[props.type] ?? props.type] ?? aliases[props.type] ?? props.type);
const paths: Record<string, string> = {
 close:'M5 3l15 15-2 2L3 5V3h2zm14 0L4 18l2 2L21 5V3h-2zM3 17l4 4m10-4l4 4',
 ranged:'M7 3q15 9 0 18L12 12 7 3zm-3 9h17m-4-3 4 3-4 3',
 siege:'M4 17h16M6 16l5-9 6 9M11 7l7-4 2 2-7 4M11 7 8 3M4 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0m12 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
 medic:'M12 20 4 12C-2 5 7-1 12 6c5-7 14-1 8 6l-8 8zm0-11v7m-3-3.5h6',
 spy:'M2 12q10-14 20 0-10 14-20 0zm7 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
 bond:'M10 14 8 16a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 4 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0m-4-4 8-8',
 morale:'M5 21V3h12l-3 4 3 4H5m12 3v7m-3-3.5h6',
 horn:'M3 10h5l12-6v16L8 14H3v-4zm5 4 2 6h4l-3-5',
 muster:'M9 7a3 3 0 1 0 6 0 3 3 0 1 0-6 0M7 21v-4a5 5 0 0 1 10 0v4M3 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M1 16v-3a4 4 0 0 1 5-4m11-4a2 2 0 1 0 4 0 2 2 0 1 0-4 0m1 4a4 4 0 0 1 5 4v3',
 scorch:'M12 2c2 7-5 8-3 12 3-1 3-4 4-6 1 4 7 6 7 10-1 6-15 6-16 0C3 11 10 9 12 2z',
 avenger:'M4 10a8 8 0 0 1 14-4l2 2m0-6v6h-6M20 14A8 8 0 0 1 6 20l-2-2m0 6v-6h6',
 frost:'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3M3 10l4-1-1-4m15 9-4 1 1 4M3 14l4 1-1 4m15-9-4-1 1-4',
 fog:'M3 10c-2-6 5-9 8-5 5-6 13 1 9 5M2 13h20M5 17h14M3 21h18',
 rain:'M4 12c-5-5 3-12 8-7 6-4 13 4 7 7H4zm2 3-2 5m9-5-2 5m9-5-2 5',
 storm:'M3 11C0 5 8 1 11 5c6-5 15 4 9 7h-5m-3-3-6 8h6l-2 6 8-10h-6l2-4',
 clear:'M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2',
 decoy:'M9 5a3 3 0 1 0 6 0 3 3 0 1 0-6 0M3 10h18m-9-2v14m-7 0 7-8 7 8M7 10v5m10-5v5',
 leader:'M3 7l5 4 4-8 4 8 5-4-2 13H5L3 7zm2 9h14',
 special:'M12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2z',
 unit:'M8 6a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 22v-5a8 8 0 0 1 16 0v5',
 weather:'M4 17c-5-5 3-12 8-7 6-4 13 4 7 7H4z',
};
</script>
<template>
    <svg class="playing-card-icon" :data-card-icon="type" viewBox="0 0 24 24" role="img" :aria-label="label" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <title>{{ label }}</title>
        <path :d="paths[symbol] ?? paths.special" />
    </svg>
</template>
<style>
.playing-card-icon{display:inline-block;width:1em;height:1em;vertical-align:middle;flex-shrink:0;overflow:visible}
</style>
