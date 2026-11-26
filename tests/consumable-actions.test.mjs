import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSSRApp} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {ItemTipContent} from '../dist/virtigia-tips.es.js';

test('consumable tooltips render the stored shop name and configured combat healing', async () => {
    for (const tipVersion of ['modern', 'retro', 'legacy']) {
        const item = {
            id: 'scroll',
            name: 'Zwój',
            category: 'consumable',
            rarity: 'common',
            attributes: {openShop: {id: 17, name: '<img>'}, combatSelfHeal: 15},
        };
        const html = await renderToString(createSSRApp(ItemTipContent, {item, tipVersion}));
        assert.match(html, /Wywołuje sklep: &lt;img&gt;/);
        assert.match(html, /Leczy 15% punktów życia podczas walki. Można używać raz na walkę\./);
    }
});

test('emotion items describe their emotion instead of an unknown action', async () => {
 const {ItemTipContent} = await import('../dist/virtigia-tips.es.js');
 const {createSSRApp} = await import('vue');
 const {renderToString} = await import('@vue/server-renderer');
 for (const tipVersion of ['modern', 'retro']) {
  const fireworks = await renderToString(createSSRApp(ItemTipContent, {
   item: {id: 'fw', name: 'Fajerwerki', category: 'consumable', rarity: 'common', attributes: {useEmotion: 'fireworks', quantity: 10}},
   tipVersion
  }));
  assert.match(fireworks, /Wyraża emocję: Fajerwerki/);
  assert.match(fireworks, /Użyj przedmiotu, aby pokazać ją nad swoją postacią/);
  assert.doesNotMatch(fireworks, /Przeciągnij/);
  assert.doesNotMatch(fireworks, /Nieznana akcja/);

  const rose = await renderToString(createSSRApp(ItemTipContent, {
   item: {id: 'rose', name: 'Róża', category: 'consumable', rarity: 'common', attributes: {useEmotion: 'roza'}},
   tipVersion
  }));
  assert.match(rose, /wobec innego gracza: Róża/);
  assert.match(rose, /Przeciągnij przedmiot na gracza/);
  assert.doesNotMatch(rose, /nad swoją postacią/);
 }
});
