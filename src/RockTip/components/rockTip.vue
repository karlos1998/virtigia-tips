<script lang="ts" setup>
// import { useToolTip } from '@/tooltips/module.ts';
import {computed, onMounted, ref, version, watch} from 'vue';
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

function resolveTroopColor(side?: string): string | undefined {
    const normalizedSide = side?.toLowerCase();
    switch(normalizedSide) {
        case 'team': return 'team';
        case 'opponent': return 'opponent';
    }
    return undefined;
}

function resolveAdvantageLevel(heroLvl, npcData){
    const differenceLevel = npcData.lvl - heroLvl;
    // Only apply level-based coloring if NPC is aggressive
    if (npcData.isAggressive) {
        if(differenceLevel < -13) return 'high';
        else if (differenceLevel > 10) return 'low'
        return 'equal';
    } else {
        // For non-aggressive NPCs, always show yellow (equal)
        return 'equal';
    }
}

const rarities = {
    "legendary": "legendarny",
    "artefact": "artefakt",
    "heroic": "heroiczny",
    "unique": "unikatowy",
    "common": "pospolity",
    "upgraded": "ulepszony",
};

function resolveOtherColor(relation?: string): string | undefined {
    const normalizedRelation = relation?.toLowerCase();
    if (normalizedRelation === 'friend') {
        return 'friend';
    }
    if (normalizedRelation === 'enemy' || normalizedRelation === 'enemy_clan') {
        return 'enemy';
    }
    if (normalizedRelation === 'clan_member') {
        return 'clan';
    }
    if (normalizedRelation === 'ally_clan') {
        return 'ally';
    }
    return undefined;
}

withDefaults(defineProps<TipProps>(), {
  heroLvl: 500,
  tipVersion: 'retro',
  heroProfession: null,
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
        if(selfProperties.ripPayload) {
            return 'rip';
        }
        if(selfProperties.petPayload) {
            return 'pet';
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
        if(selfProperties.troopPayload) {
            return 'troop';
        }
        if(selfProperties.gatePayload) {
            return 'gate';
        }
    })()"
         :data-version="tipVersion";
         :data-color="(() => {
           if (selfProperties.otherPayload) {
             return resolveOtherColor(selfProperties.otherPayload.schema.inner.relation) ?? selfProperties.target?.dataset.color;
           }
           if (selfProperties.troopPayload) {
             return resolveTroopColor(selfProperties.troopPayload.schema.inner.side) ?? selfProperties.target?.dataset.color;
           }
           return selfProperties.target?.dataset.color;
         })()"
         ref="element">
        <div class="tip-wrapper">
            <div class="corners">
                <div class="leftTop" />
                <div class="rightBottom" />
            </div>
            <template v-if="selfProperties.otherPayload">
                <div class="inner text-sharpen">
                    <div class="nickname" :class="{ 'crimson-brotherhood': selfProperties.otherPayload.schema.inner.brotherhoodMember }">
                        <b>{{ selfProperties.otherPayload.schema.inner.name }}</b>
                    </div>
                    <template v-if="selfProperties.otherPayload.schema.inner.wanted">
                        <div class="wanted">
                            Poszukiwany listem gończym
                        </div>
                    </template>
                    <template v-if="tipVersion != 'legacy'">
                        <div class="level">
                            <span>Lvl: ({{ `${selfProperties.otherPayload.schema.inner.level}${selfProperties.otherPayload.schema.inner.profession}` }})</span>
                        </div>
                    </template>
                    <template v-if="tipVersion == 'legacy'">
                        <div class="level">
                            <span>Lvl: {{ `${selfProperties.otherPayload.schema.inner.level}${selfProperties.otherPayload.schema.inner.profession}` }}</span>
                        </div>
                    </template>
                    <template v-if="selfProperties.otherPayload.schema.inner.blessing">
                        <div class="blessing">
                            <span>Błogosławieństwo</span>
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
            <template v-if="selfProperties.troopPayload">
                <div class="inner text-sharpen" >
                    <div class="name">
                        <b>{{ selfProperties.troopPayload.schema.inner.name }}</b>
                    </div>
                    <div class="level">
                        Lvl: ({{ selfProperties.troopPayload.schema.inner.lvl }}{{ selfProperties.troopPayload.schema.inner.profession }})
                    </div>
                    <div class="health">
                        Życie: {{ Math.round(selfProperties.troopPayload.schema.inner.currentHp/selfProperties.troopPayload.schema.inner.maxHp * 1000)/10 }}%
                    </div>
                    <div class="armor">
                        Pancerz: {{ selfProperties.troopPayload.schema.inner.ac }}
                    </div>
                    <div class="resistance" style="justify-content: center; display: flex;">
                        Odp.: 
                        <div style="color: red">{{ selfProperties.troopPayload.schema.inner.fireRes }}</div>/
                        <div style="color: yellow">{{ selfProperties.troopPayload.schema.inner.lightRes }}</div>/
                        <div style="color: lightblue">{{ selfProperties.troopPayload.schema.inner.iceRes }}</div>/
                        <div style="color: green">{{ selfProperties.troopPayload.schema.inner.poisonRes }}</div>
                    </div>
                </div>
            </template>
            <template v-if="selfProperties.ripPayload">
                <div class="inner text-sharpen">
                    <div class="rip-title">
                        <b>{{ `Ś.p. ${selfProperties.ripPayload.schema.inner.nick}` }}</b>
                    </div>
                    <div class="rip-level">
                        {{ `Lvl: ${selfProperties.ripPayload.schema.inner.lvl}${selfProperties.ripPayload.schema.inner.profession}` }}
                    </div>
                    <div v-if="selfProperties.ripPayload.schema.inner.reason" class="rip-reason">
                        {{ `${String(selfProperties.ripPayload.schema.inner.gender).toLowerCase() === 'f' ? 'Zabita' : 'Zabity'} przez: ${selfProperties.ripPayload.schema.inner.reason}` }}
                    </div>
                    <div v-if="selfProperties.ripPayload.schema.inner.description" class="rip-description">
                        {{ selfProperties.ripPayload.schema.inner.description }}
                    </div>
                </div>
            </template>
            <template v-if="selfProperties.petPayload">
                <div class="inner text-sharpen">
                    <div class="pet-name">
                        <b>{{ selfProperties.petPayload.schema.inner.name }}</b>
                    </div>
                    <div v-if="selfProperties.petPayload.schema.inner.rarity && selfProperties.petPayload.schema.inner.rarity != 'common'"
                            class="pet-rarity"
                            :data-type="selfProperties.petPayload.schema.inner.rarity">
                        <i>{{ rarities[selfProperties.petPayload.schema.inner.rarity] }}</i>
                    </div>
                    <div class="pet-owner">
                        {{ `Właściciel: ${selfProperties.petPayload.schema.inner.ownerName}` }}
                    </div>
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
                          v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.attributes.upgradedByPercent"
                          class="upgrade-percent"
                      >
                        <span
                            v-html="Translations.attributes.upgradedByPercent(selfProperties.itemPayload.schema.inner.attributes.upgradedByPercent)"></span>
                      </div>
                      <div
                          v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.attributes.reducedLevelRequirement"
                          class="reduced-level-requirement"
                      >
                        <span
                            v-html="Translations.attributes.reducedLevelRequirement(selfProperties.itemPayload.schema.inner.attributes.reducedLevelRequirement)"></span>
                      </div>
                        <!-- Display outfit image if useOutfit attribute exists -->
                        <div v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.attributes.useOutfit && selfProperties.itemPayload.schema.inner.attributes.useOutfit.src" 
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
                        <div v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.category != 'renewable'" class="bonuses">
<!--                            <template v-if="itemOrders?.tags.isUnidentified">-->
<!--                                <div class="attribute text-center" :data-stat="'unidentified'">-->
<!--                                    Przedmiot niezidentyfikowany-->
<!--                                </div>-->
<!--                            </template>-->
                            <template v-for="currentStat of itemOrders?.bonuses">
                                <div class="attribute" :data-stat="currentStat">
                                <span
                                    v-if="Translations.attributes[currentStat] && currentStat !== 'petSrc'"
                                    v-html="`${Translations.attributes[currentStat].apply(null, [selfProperties.itemPayload.schema.inner.attributes[currentStat]])}`"
                                />
                                <span
                                    v-else-if="currentStat === 'petSrc'"
                                    v-html="Translations.attributes.petSrc(selfProperties.itemPayload.schema.inner.attributes[currentStat], selfProperties.itemPayload.schema.inner.attributes)"
                                />
                                    <div v-else><b>Nieznany stat: {{ currentStat }}</b></div>
                                </div>
                            </template>
                        </div>
                        <div v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.category != 'renewable'" class="actions">
                            <template v-for="currentStat of itemOrders?.actions">
                                <div class="attribute" :data-stat="currentStat">
                                <span
                                    v-if="Translations.attributes[currentStat]"
                                    v-html="`${Translations.attributes[currentStat].apply(null, [selfProperties.itemPayload.schema.inner.attributes[currentStat]])}`"
                                />
                                    <div v-else><b>Nieznana akcja: {{ currentStat }}</b></div>
                                </div>
                            </template>
                        </div>
                        <div v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.category != 'renewable'" class="tags">
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
                        <div v-if="selfProperties.itemPayload.schema.inner.attributes && selfProperties.itemPayload.schema.inner.category != 'renewable'" class="requires">
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
                        <div class="price" v-if="selfProperties.itemPayload.schema.inner.price && priceFormatter(selfProperties.itemPayload.schema.inner.price) != '0'">
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
                    <template v-if="tipVersion == 'legacy'">
                        <div class="level" :advantage="(resolveAdvantageLevel(heroLvl, selfProperties.npcPayload.schema.inner))">
                            <span>{{ `Lvl: ${selfProperties.npcPayload.schema.inner.lvl}${selfProperties.npcPayload.schema.inner.inGroup ? " (grp)" : ""}` }}</span>
                        </div>
                    </template>
                    <template v-if="selfProperties.npcPayload.schema.inner.rank">
                        <div class="rank" :rank="selfProperties.npcPayload.schema.inner.rank">
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
                    <template v-if="tipVersion != 'legacy'">
                        <div class="level" :advantage="(resolveAdvantageLevel(heroLvl, selfProperties.npcPayload.schema.inner))">
                            <span>{{ `${selfProperties.npcPayload.schema.inner.lvl} lvl${selfProperties.npcPayload.schema.inner.inGroup ? ", grp" : ""}` }}</span>
                        </div>
                    </template>
                </div>
            </template>
            <template v-if="selfProperties.gatePayload">
                <div class="inner text-sharpen">
                    <div class="name">
                        {{ selfProperties.gatePayload.schema.inner.name }}
                    </div>
                    <div v-if="selfProperties.gatePayload.schema.inner.levelCapTop && selfProperties.gatePayload.schema.inner.levelCapBottom">
                        Przejście dostępne od {{ selfProperties.gatePayload.schema.inner.levelCapBottom }} do {{ selfProperties.gatePayload.schema.inner.levelCapTop }} poziomu
                    </div>
                    <div v-else-if="selfProperties.gatePayload.schema.inner.levelCapTop">
                        Przejście dostępne do {{ selfProperties.gatePayload.schema.inner.levelCapTop }} poziomu
                    </div>
                    <div v-else-if="selfProperties.gatePayload.schema.inner.levelCapBottom">
                        Przejście dostępne od {{ selfProperties.gatePayload.schema.inner.levelCapBottom }} poziomu
                    </div>
                    <div v-if="selfProperties.gatePayload.schema.inner.locked">
                        (Wymaga klucza)
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style src="src/RockTip/assets/rock-tip.css">

</style>
