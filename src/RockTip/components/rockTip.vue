<script lang="ts" setup>
// import { useToolTip } from '@/tooltips/module.ts';
import {computed, onMounted, ref, watch} from 'vue';
import { priceFormatter } from '../utilities/priceFormatter';
import { Translations } from '../constants/translations';
import { Attributes } from '../constants/attributes';
import {useToolTip} from "../../tooltips/module";
import {TipProps} from "../typings/schematics";

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

const itemOrders = computed(() => state.value.itemPayload ? Attributes.getOrdersList(state.value.itemPayload) : null)

withDefaults(defineProps<TipProps>(), {
  heroLvl: 500,
  heroProfession: null,
  baseSrc: ''
})

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
                <div class="inner text-sharpen">
                    <div class="header">
                        <div v-if="selfProperties.itemPayload.schema.showId">
                            <i>ID: {{ selfProperties.itemPayload.schema.inner.id }}</i>
                        </div>
                        <div class="name">
                            <span>{{ selfProperties.itemPayload.schema.inner.name }}</span>
                        </div>
                        <div
                            v-if="selfProperties.itemPayload.schema.inner.rarity && selfProperties.itemPayload.schema.inner.rarity != 'common'"
                            class="rarity"
                            :data-type="selfProperties.itemPayload.schema.inner.rarity"
                        >
                            <span>* </span>
                            <span class="inner">
                            {{ `${Translations.rarities[selfProperties.itemPayload.schema.inner.rarity]}` }}
                        </span>
                            <span> *</span>
                        </div>
                      <div
                          v-if="selfProperties.itemPayload.schema.inner.attributes.upgradedByPercent"
                          class="upgrade-percent"
                      >
                        <span
                            v-html="Translations.attributes.upgradedByPercent(selfProperties.itemPayload.schema.inner.attributes.upgradedByPercent)"></span>
                      </div>
                      <div
                          v-if="selfProperties.itemPayload.schema.inner.attributes.reducedLevelRequirement"
                          class="reduced-level-requirement"
                      >
                        <span
                            v-html="Translations.attributes.reducedLevelRequirement(selfProperties.itemPayload.schema.inner.attributes.reducedLevelRequirement)"></span>
                      </div>
                        <!-- Display outfit image if useOutfit attribute exists -->
                        <div v-if="selfProperties.itemPayload.schema.inner.attributes.useOutfit && selfProperties.itemPayload.schema.inner.attributes.useOutfit.src" 
                             class="outfit-image" 
                             :style="{
                                backgroundImage: `url(${selfProperties.itemPayload.schema.inner.attributes.useOutfit.src})`,
                                backgroundPosition: '0 0',
                                width: '32px',
                                height: '48px',
                                margin: '5px auto',
                                display: 'block'
                             }">
                        </div>
                    </div>
                    <div class="struct">
                        <div class="category">
                        <span
                            v-if="selfProperties.itemPayload.schema.inner.category && Translations.categories[selfProperties.itemPayload.schema.inner.category]">{{ `Typ: ${Translations.categories[selfProperties.itemPayload.schema.inner.category]}`
                            }}</span>
                            <b v-else>{{ `Nieznany typ: ${selfProperties.itemPayload.schema.inner.category || '-'}`
                                }}</b>
                        </div>
                        <div class="bonuses">
<!--                            <template v-if="itemOrders?.tags.isUnidentified">-->
<!--                                <div class="attribute text-center" :data-stat="'unidentified'">-->
<!--                                    Przedmiot niezidentyfikowany-->
<!--                                </div>-->
<!--                            </template>-->
                            <template v-for="currentStat of itemOrders?.bonuses">
                                <div class="attribute" :data-stat="currentStat">
                                <span
                                    v-if="Translations.attributes[currentStat]"
                                    v-html="`${Translations.attributes[currentStat].apply(null, [selfProperties.itemPayload.schema.inner.attributes[currentStat]])}`"
                                />
                                    <div v-else><b>Nieznany stat: {{ currentStat }}</b></div>
                                </div>
                            </template>
                        </div>
                        <div class="tags">
                            <template v-for="currentStat of itemOrders?.tags">
                                <div class="attribute" :data-stat="currentStat">
                                <span
                                    v-if="Translations.attributes[currentStat]"
                                    v-html="Translations.attributes[currentStat].apply(null, [selfProperties.itemPayload.schema.inner.attributes[currentStat]])"
                                />
                                    <div v-else><b>Nieznany tag: {{ currentStat }}</b></div>
                                </div>
                            </template>
                        </div>
                        <div class="requires">
                            <template v-for="currentStat of itemOrders?.limits">
                                <div
                                    v-if="(() => {
                                      switch(currentStat) {
                                        case 'needProfessions': {
                                            return selfProperties.itemPayload.schema.inner.attributes.needProfessions.length != 6 && selfProperties.itemPayload.schema.inner.attributes.needProfessions.length != 0;
                                        }
                                        case 'needLevel': {
                                            return selfProperties.itemPayload.schema.inner.attributes.needLevel > 1;
                                        }
                                        default: {
                                            return true;
                                        }
                                      }
                                    })()"
                                    class="attribute" :data-stat="currentStat" :data-fulfilling="(() => {
                                switch(currentStat) {
                                    case 'needLevel': {
                                        return heroLvl >= Number(selfProperties.itemPayload.schema.inner.attributes.needLevel);
                                    }
                                    case 'needProfessions': {
                                        return heroProfession == null ||  selfProperties.itemPayload.schema.inner.attributes.needProfessions.indexOf(heroProfession) > -1;
                                    }
                                    case 'cooldownTime': {

                                        return selfProperties.itemPayload.schema.inner.attributes.cooldownTime.length == 1 || selfProperties.itemPayload.schema.inner.attributes.cooldownTime[1] <= (new Date().getTime() / 1000);
                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            })()">
                                <span
                                    v-if="Translations.attributes[currentStat]"
                                    v-html="Translations.attributes[currentStat].apply(null, [selfProperties.itemPayload.schema.inner.attributes[currentStat]])"
                                />
<!--                                    <span-->
<!--                                        v-else-->
<!--                                    >-->
<!--                                        Problem z: {{Translations.attributes[currentStat]}}-->
<!--                                    </span>-->
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="price" v-if="priceFormatter(selfProperties.itemPayload.schema.inner.price) != '0'">
                            <span>{{ `Wartość: ${priceFormatter(selfProperties.itemPayload.schema.inner.price)}`
                                }}</span>
                            <div :data-type="selfProperties.itemPayload.schema.inner.currency" />
                        </div>
                    </div>
                </div>
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
                    const differenceLevel = heroLvl - selfProperties.npcPayload.schema.inner.lvl;
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
