import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ToolTipDirective, useToolTip} from '../dist/virtigia-tips.es.js';

function fakeElement() {
 const listeners = {};
 return {
  dataset: {},
  addEventListener: (type, handler) => { listeners[type] = handler; },
  contains: () => false,
  hover: () => listeners.mouseenter({buttons: 0}),
 };
}

test('item tip shows stats changed in place after the tile was rendered (e.g. an upgrade)', async () => {
 const item = {id: 'sword', name: 'Miecz', category: 'oneHanded', rarity: 'common', attributes: {strength: 10}};
 const el = fakeElement();
 ToolTipDirective.mounted(el, {value: item, modifiers: {item: true}});

 // The bag service replaces the attributes of the same item object; the tile does not re-render.
 item.attributes = {strength: 11, upgradedByPercent: 10};
 await el.hover();

 const {state} = useToolTip();
 assert.deepEqual(state.value.itemPayload.schema.inner.attributes, {strength: 11, upgradedByPercent: 10});
 state.value.opened = false;
 state.value.itemPayload = false;
});
