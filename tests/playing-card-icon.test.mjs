import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSSRApp,h} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {PlayingCardIcon} from '../dist/virtigia-tips.es.js';

test('every row and ability has an accessible vector icon', async () => {
 const types=['close','ranged','siege','spy','medic','bond','morale','horn','muster','scorch','scorch_c','avenger','frost','fog','rain','storm','clear','decoy','foltest_king','foltest_lord','foltest_siegemaster','foltest_son','foltest_steelforged','unit','special','weather','leader'];
 for(const type of types){
  const html=await renderToString(createSSRApp({render:()=>h(PlayingCardIcon,{type})}));
  assert.match(html, new RegExp(`data-card-icon="${type}"`));
  assert.match(html, /aria-label="[^\"]+"/);
  assert.match(html, /<path d="M/);
 }
});

test('siege and medic have distinct symbols and Polish labels',async()=>{
 const render=type=>renderToString(createSSRApp({render:()=>h(PlayingCardIcon,{type})}));
 const siege=await render('siege'), medic=await render('medic');
 assert.match(siege,/aria-label="Oblężenie"/);
 assert.match(medic,/aria-label="Medyk"/);
 assert.notEqual(siege.match(/<path d="([^"]+)/)[1],medic.match(/<path d="([^"]+)/)[1]);
});
