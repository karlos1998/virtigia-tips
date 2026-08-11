<script setup lang="ts">
import {computed} from 'vue';
import {Attributes} from '../constants/attributes';
import {Translations} from '../constants/translations';
import type {ItemPayload} from '../typings/payloads';
import type {ItemTipContentProps} from '../typings/schematics';
import {priceFormatter} from '../utilities/priceFormatter';

const props = withDefaults(defineProps<ItemTipContentProps>(), {
    heroLvl: 500,
    heroProfession: null,
    showId: false,
    showTitle: true,
});

const payload = computed<ItemPayload>(() => ({
    schema: {
        inner: props.item,
        showId: props.showId,
    },
}));
const itemOrders = computed(() => Attributes.getOrdersList(payload.value));

type ItemAttributes = Record<string, any>;
type AttributeTranslation = (value: any, attributes?: ItemAttributes) => string | undefined;
const attributeTranslations = Translations.attributes as Record<string, AttributeTranslation>;

function renderItemAttribute(attributeName: string, attributes: ItemAttributes): string {
    return attributeTranslations[attributeName]?.(attributes[attributeName], attributes) ?? '';
}

function shouldShowLimit(attributeName: string): boolean {
    const attributes = props.item.attributes;

    switch (attributeName) {
        case 'needProfessions':
            return Array.isArray(attributes.needProfessions)
                && attributes.needProfessions.length !== 6
                && attributes.needProfessions.length !== 0;
        case 'needLevel':
            return Number(attributes.needLevel) > 1;
        default:
            return true;
    }
}

function isLimitFulfilled(attributeName: string): boolean {
    const attributes = props.item.attributes;

    switch (attributeName) {
        case 'needLevel':
            return props.heroLvl >= Number(attributes.needLevel);
        case 'needProfessions':
            return props.heroProfession == null
                || !Array.isArray(attributes.needProfessions)
                || attributes.needProfessions.includes(props.heroProfession);
        case 'cooldownTime':
            return !Array.isArray(attributes.cooldownTime)
                || attributes.cooldownTime.length === 1
                || Number(attributes.cooldownTime[1]) <= Date.now() / 1000;
        default:
            return false;
    }
}
</script>

<template>
    <div class="item-tip-content inner text-sharpen">
        <div
            v-if="showTitle || item.attributes?.upgradedByPercent || item.attributes?.reducedLevelRequirement || item.attributes?.useOutfit?.src"
            class="header"
        >
            <template v-if="showTitle">
                <div v-if="showId">
                    <i>ID: {{ item.id }}</i>
                </div>
                <div class="name">
                    <span>{{ item.name }}</span>
                </div>
                <div
                    v-if="item.rarity && item.rarity !== 'common'"
                    class="rarity"
                    :data-type="item.rarity"
                >
                    <span>* </span>
                    <span class="inner">{{ Translations.rarities[item.rarity] ?? item.rarity }}</span>
                    <span> *</span>
                </div>
            </template>

            <div v-if="item.attributes?.upgradedByPercent" class="upgrade-percent">
                <span v-html="Translations.attributes.upgradedByPercent(item.attributes.upgradedByPercent)" />
            </div>
            <div v-if="item.attributes?.reducedLevelRequirement" class="reduced-level-requirement">
                <span v-html="Translations.attributes.reducedLevelRequirement(item.attributes.reducedLevelRequirement)" />
            </div>
            <div
                v-if="item.attributes?.useOutfit?.src"
                class="outfit-image"
                :style="{
                    backgroundImage: `url(${item.attributes.useOutfit.src})`,
                    backgroundPosition: '0 0',
                    width: '32px',
                    height: '48px',
                    margin: '5px auto',
                    display: 'block',
                }"
            />
        </div>

        <div class="struct">
            <div class="category">
                <span v-if="item.category && Translations.categories[item.category]">
                    Typ: {{ Translations.categories[item.category] }}
                </span>
                <b v-else>Nieznany typ: {{ item.category || '-' }}</b>
            </div>

            <div v-if="item.attributes && item.category !== 'renewable'" class="bonuses">
                <div v-for="currentStat of itemOrders.bonuses" :key="currentStat" class="attribute" :data-stat="currentStat">
                    <span
                        v-if="Translations.attributes[currentStat]"
                        v-html="renderItemAttribute(currentStat, item.attributes)"
                    />
                    <div v-else><b>Nieznany stat: {{ currentStat }}</b></div>
                </div>
            </div>

            <div v-if="item.attributes && item.category !== 'renewable'" class="actions">
                <div v-for="currentStat of itemOrders.actions" :key="currentStat" class="attribute" :data-stat="currentStat">
                    <span
                        v-if="Translations.attributes[currentStat]"
                        v-html="renderItemAttribute(currentStat, item.attributes)"
                    />
                    <div v-else><b>Nieznana akcja: {{ currentStat }}</b></div>
                </div>
            </div>

            <div v-if="item.attributes && item.category !== 'renewable'" class="tags">
                <div v-for="currentStat of itemOrders.tags" :key="currentStat" class="attribute" :data-stat="currentStat">
                    <span
                        v-if="Translations.attributes[currentStat]"
                        v-html="renderItemAttribute(currentStat, item.attributes)"
                    />
                    <div v-else><b>Nieznany tag: {{ currentStat }}</b></div>
                </div>
            </div>

            <div v-if="item.attributes && item.category !== 'renewable'" class="requires">
                <div
                    v-for="currentStat of itemOrders.limits"
                    v-show="shouldShowLimit(currentStat)"
                    :key="currentStat"
                    class="attribute"
                    :data-stat="currentStat"
                    :data-fulfilling="isLimitFulfilled(currentStat)"
                >
                    <span
                        v-if="Translations.attributes[currentStat]"
                        v-html="renderItemAttribute(currentStat, item.attributes)"
                    />
                </div>
            </div>
        </div>

        <div class="footer">
            <div v-if="item.price && priceFormatter(item.price) !== '0'" class="price">
                <span>Wartość: {{ priceFormatter(item.price) }}</span>
                <div v-if="item.currency" :data-type="item.currency" />
            </div>
        </div>
    </div>
</template>

<style>
.item-tip-content {
    display: grid;
    gap: 0.35rem;
    color: var(--rockTip-static--color-text, #fff);
    font: 0.7rem var(--rockTip-font, Verdana, Arial, sans-serif);
    line-height: 1.35;
}

.item-tip-content > .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.item-tip-content > .header > .name,
.item-tip-content > .header > .rarity {
    color: var(--rockTip-item--color-headerName, #fff4c8);
    font-weight: bold;
    text-align: center;
    word-break: break-word;
}

.item-tip-content > .header > .rarity[data-type='legendary'],
.item-tip-content .attribute[data-stat='legendaryBon'] {
    color: var(--rockTip-item--rarity-legendary, #f44);
}

.item-tip-content > .header > .rarity[data-type='artefact'] {
    color: var(--rockTip-item--rarity-artefact, #f66);
}

.item-tip-content > .header > .rarity[data-type='heroic'] {
    color: var(--rockTip-item--rarity-heroic, #5ca8ff);
}

.item-tip-content > .header > .rarity[data-type='unique'],
.item-tip-content > .header > .rarity[data-type='upgraded'] {
    color: var(--rockTip-item--rarity-unique, #ffe45c);
}

.item-tip-content > .header > .upgrade-percent {
    color: #fd0;
    font-size: 0.9em;
    font-weight: bold;
    text-align: center;
}

.item-tip-content > .header > .reduced-level-requirement {
    color: #9fac28;
    font-size: 0.9em;
    font-weight: bold;
    text-align: center;
}

.item-tip-content > .struct {
    display: grid;
    gap: 0.2rem;
}

.item-tip-content .attribute [data-role='value'] {
    color: var(--rockTip-item--color-statValue, #ffdc73);
}

.item-tip-content > .struct > .requires > .attribute {
    font-weight: bold;
}

.item-tip-content > .struct > .requires > .attribute[data-fulfilling='true'] {
    color: var(--rockTip-item--color-fulfillOk, #8fd277);
}

.item-tip-content > .struct > .requires > .attribute[data-fulfilling='false'] {
    color: var(--rockTip-item--color-fulfillErr, #ff655c);
}

.item-tip-content > .footer > .price {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}
</style>
