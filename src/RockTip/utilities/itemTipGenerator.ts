import { priceFormatter } from './priceFormatter';
import { Translations } from '../constants/translations';
import { Attributes } from '../constants/attributes';
import type { ItemPayload } from '../typings/payloads';

export interface CreateItemTipOptions {
  heroLvl?: number;
  heroProfession?: string | null;
  baseSrc?: string;
}

export function createItemTip(item: ItemPayload, options: CreateItemTipOptions = {}): string {
  const { heroLvl = 500, heroProfession = null, baseSrc = '' } = options;

  const itemOrders = Attributes.getOrdersList(item);

  let html = '<div class="inner text-sharpen">';

  // Header section
  html += '<div class="header">';

  // ID display
  if (item.schema.showId) {
    html += `<i>ID: ${item.schema.inner.id}</i>`;
  }

  // Name
  html += `<div class="name"><span>${item.schema.inner.name}</span></div>`;

  // Rarity
  if (item.schema.inner.rarity && item.schema.inner.rarity != 'common') {
    html += `<div class="rarity" data-type="${item.schema.inner.rarity}"><span>* </span><span class="inner">${Translations.rarities[item.schema.inner.rarity]}</span><span> *</span></div>`;
  }

  // Upgrade percent
  if (item.schema.inner.attributes.upgradedByPercent) {
    html += `<div class="upgrade-percent"><span>${Translations.attributes.upgradedByPercent(item.schema.inner.attributes.upgradedByPercent)}</span></div>`;
  }

  // Reduced level requirement
  if (item.schema.inner.attributes.reducedLevelRequirement) {
    html += `<div class="reduced-level-requirement"><span>${Translations.attributes.reducedLevelRequirement(item.schema.inner.attributes.reducedLevelRequirement)}</span></div>`;
  }

  // Outfit image
  if (item.schema.inner.attributes.useOutfit && item.schema.inner.attributes.useOutfit.src) {
    html += `<div class="outfit-image" style="background-image: url('${item.schema.inner.attributes.useOutfit.src}'); background-position: 0 0; width: 32px; height: 48px; margin: 5px auto; display: block;"></div>`;
  }

  // Pet image
  if (item.schema.inner.attributes.petSrc) {
    const petActions = item.schema.inner.attributes.petActions || [];
    const horizontalDivisions = 4 + petActions.length;
    const verticalDivisions = 4;

    html += `<div style="text-align: center; margin: 10px 0;">
      <div style="
        width: 48px;
        height: 48px;
        background-image: url('${item.schema.inner.attributes.petSrc}');
        background-size: ${horizontalDivisions * 100}% ${verticalDivisions * 100}%;
        background-position: 0% 0%;
        background-repeat: no-repeat;
        border: 1px solid #8B4513;
        border-radius: 4px;
        display: inline-block;"
        title="Podgląd zwierzaka">
      </div>
    </div>`;
  }

  html += '</div>'; // End header

  // Struct section
  html += '<div class="struct">';

  // Category
  html += '<div class="category">';
  if (item.schema.inner.category && Translations.categories[item.schema.inner.category]) {
    html += `<span>Typ: ${Translations.categories[item.schema.inner.category]}</span>`;
  } else {
    html += `<b>Nieznany typ: ${item.schema.inner.category || '-'}</b>`;
  }
  html += '</div>';

  // Bonuses
  html += '<div class="bonuses">';
  for (const currentStat of itemOrders.bonuses) {
    html += `<div class="attribute" data-stat="${currentStat}">`;
    if (Translations.attributes[currentStat]) {
      if (currentStat === 'petSrc') {
        html += Translations.attributes.petSrc(item.schema.inner.attributes[currentStat], item.schema.inner.attributes);
      } else {
        html += Translations.attributes[currentStat].apply(null, [item.schema.inner.attributes[currentStat]]);
      }
    } else {
      html += `<b>Nieznany stat: ${currentStat}</b>`;
    }
    html += '</div>';
  }
  html += '</div>';

  // Actions
  html += '<div class="actions">';
  for (const currentStat of itemOrders.actions) {
    html += `<div class="attribute" data-stat="${currentStat}">`;
    if (Translations.attributes[currentStat]) {
      html += Translations.attributes[currentStat].apply(null, [item.schema.inner.attributes[currentStat]]);
    } else {
      html += `<b>Nieznana akcja: ${currentStat}</b>`;
    }
    html += '</div>';
  }
  html += '</div>';

  // Tags
  html += '<div class="tags">';
  for (const currentStat of itemOrders.tags) {
    html += `<div class="attribute" data-stat="${currentStat}">`;
    if (Translations.attributes[currentStat]) {
      html += Translations.attributes[currentStat].apply(null, [item.schema.inner.attributes[currentStat]]);
    } else {
      html += `<b>Nieznany tag: ${currentStat}</b>`;
    }
    html += '</div>';
  }
  html += '</div>';

  // Requirements
  html += '<div class="requires">';
  for (const currentStat of itemOrders.limits) {
    const shouldDisplay = (() => {
      switch(currentStat) {
        case 'needProfessions': {
          return item.schema.inner.attributes.needProfessions.length != 6 && item.schema.inner.attributes.needProfessions.length != 0;
        }
        case 'needLevel': {
          return item.schema.inner.attributes.needLevel > 1;
        }
        default: {
          return true;
        }
      }
    })();

    if (shouldDisplay) {
      const fulfilling = (() => {
        switch(currentStat) {
          case 'needLevel': {
            return heroLvl >= Number(item.schema.inner.attributes.needLevel);
          }
          case 'needProfessions': {
            return heroProfession == null || item.schema.inner.attributes.needProfessions.indexOf(heroProfession) > -1;
          }
          case 'cooldownTime': {
            return item.schema.inner.attributes.cooldownTime.length == 1 || item.schema.inner.attributes.cooldownTime[1] <= (new Date().getTime() / 1000);
          }
          default: {
            return false;
          }
        }
      })();

      html += `<div class="attribute" data-stat="${currentStat}" data-fulfilling="${fulfilling}">`;
      if (Translations.attributes[currentStat]) {
        html += Translations.attributes[currentStat].apply(null, [item.schema.inner.attributes[currentStat]]);
      }
      html += '</div>';
    }
  }
  html += '</div>';

  html += '</div>'; // End struct

  // Footer
  html += '<div class="footer">';
  const price = priceFormatter(item.schema.inner.price);
  if (price != '0') {
    html += `<div class="price"><span>Wartość: ${price}</span><div data-type="${item.schema.inner.currency}"></div></div>`;
  }
  html += '</div>';

  html += '</div>'; // End inner

  return html;
}
