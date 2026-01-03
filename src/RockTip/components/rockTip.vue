<script lang="ts" setup>
// import { useToolTip } from '@/tooltips/module.ts';
import {computed, onMounted, ref, watch} from 'vue';
import { priceFormatter } from '../utilities/priceFormatter';
import { Translations } from '../constants/translations';
import { Attributes } from '../constants/attributes';
import {useToolTip} from "../../tooltips/module";
import {TipProps} from "../typings/schematics";
import { generateItemTipHtml } from '../utilities/itemTipGenerator';

const { state, setToolTipElement } = useToolTip();

const position = computed(() => ({
    x: state.value.positionX,
    y: state.value.positionY
}));

const element = ref<HTMLElement | null>(null);

onMounted(() => {
    if (element.value) {
        setToolTipElement(element.value);
    }
});

const selfProperties = state;

const props = withDefaults(defineProps<TipProps>(), {
  heroLvl: 500,
  heroProfession: null,
  baseSrc: ''
})

const itemOrders = computed(() => state.value.itemPayload ? Attributes.getOrdersList(state.value.itemPayload) : null)

const itemTipHtml = computed(() => {
    if (!selfProperties.value.itemPayload) return '';
    return generateItemTipHtml(selfProperties.value.itemPayload, {
        heroLvl: props.heroLvl,
        heroProfession: props.heroProfession,
        baseSrc: props.baseSrc
    });
});

</script>

<template>
    <div class="rockTip" :style="{
            left: position.x + 'px',
            top: position.y + 'px',
        }" :data-type="(() => {
        if(selfProperties.otherPayload) {
            return 'other';
        }
        if(selfProperties.itemPayload) {
            return 'item';
        }
        if(selfProperties.htmlPayload) {
            return 'html';
        }
        if(selfProperties.npcPayload) {
            return 'npc';
        }
    })()"
         :data-color="selfProperties.target?.dataset.color"
         ref="element">
        <div class="tip-wrapper">
            <div class="corners">
                <div class="leftTop" />
                <div class="rightBottom" />
            </div>
            <template v-if="selfProperties.otherPayload">
                <div class="inner text-sharpen">
                    <div class="nickname">
                        <b>{{ selfProperties.otherPayload.schema.inner.name }}
                            {{ `(${selfProperties.otherPayload.schema.inner.level}${selfProperties.otherPayload.schema.inner.profession})`
                            }}</b>
                    </div>
                    <template v-if="selfProperties.otherPayload.schema.inner.bless">
                        <div class="bless">
                            <b>Błogosławieństwo</b>
                        </div>
                    </template>
                    <template v-if="selfProperties.otherPayload.schema.inner.clan">
                        <div class="clan">
                            <span>{{ `[${selfProperties.otherPayload.schema.inner.clan}]` }}</span>
                        </div>
                    </template>
                    <template v-if="selfProperties.otherPayload.schema.inner.role">
                        <div class="role">
                            <span>{{ selfProperties.otherPayload.schema.inner.role }}</span>
                        </div>
                    </template>
                </div>
            </template>
            <template v-if="selfProperties.htmlPayload">
                <div class="inner text-sharpen" v-html="selfProperties.htmlPayload.schema.inner.content" />
            </template>
            <template v-if="selfProperties.itemPayload">
                <div class="inner text-sharpen" v-html="itemTipHtml" />
            </template>
            <template v-if="selfProperties.npcPayload">
                <div class="inner text-sharpen">
                    <div class="name">
                        <b>{{ selfProperties.npcPayload.schema.inner.name }}</b>
                    </div>
                    <template v-if="selfProperties.npcPayload.schema.inner.rank">
                        <div class="rank">
                            <template v-if="selfProperties.npcPayload.schema.inner.rank === 'ELITE'">
                                <i>elita</i>
                            </template>
                            <template v-if="selfProperties.npcPayload.schema.inner.rank === 'ELITE_II'">
                                <i>elita II</i>
                            </template>
                            <template v-if="selfProperties.npcPayload.schema.inner.rank === 'ELITE_III'">
                                <i>elita III</i>
                            </template>
                            <template v-if="selfProperties.npcPayload.schema.inner.rank === 'HERO'">
                                <i>heros</i>
                            </template>
                            <template v-if="selfProperties.npcPayload.schema.inner.rank === 'TITAN'">
                                <i>tytan</i>
                            </template>
                        </div>
                    </template>
                    <div class="level" :advantage="(() => {
                    const differenceLevel = props.heroLvl - selfProperties.npcPayload.schema.inner.lvl;
                    if(differenceLevel > 13) {
                        return 'high';
                    }
                    if(differenceLevel < -13) {
                        return 'low';
                    }
                    return 'equal';
                })()">
                        <span>{{ `${selfProperties.npcPayload.schema.inner.lvl} lvl` }}</span>
                    </div>
                  <div class="group" v-if="selfProperties.npcPayload.schema.inner.inGroup">
                    W grupie
                  </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style src="src/RockTip/assets/rock-tip.css">

</style>
