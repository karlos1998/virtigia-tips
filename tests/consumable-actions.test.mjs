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
