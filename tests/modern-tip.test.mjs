import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSSRApp} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {ItemTipContent, RockTip, useToolTip} from '../dist/virtigia-tips.es.js';
const item={id:'meat',name:'Mięso <test>',src:'/meat.png',category:'consumable',rarity:'unique',price:20,attributes:{restoreHealthPoints:23,needLevel:10}};
test('modern item content includes its image, translated effects and requirements',async()=>{
 const html=await renderToString(createSSRApp(ItemTipContent,{item,tipVersion:'modern',heroLvl:1}));
 assert.match(html,/modern-tip-item-icon/); assert.match(html,/src="\/meat.png"/);
 assert.match(html,/Mięso &lt;test&gt;/); assert.match(html,/23/); assert.match(html,/data-fulfilling="false"/);
});
test('existing default and legacy item tips keep their previous image-free markup',async()=>{
 for(const tipVersion of [undefined,'legacy','retro']){
  const html=await renderToString(createSSRApp(ItemTipContent,{item,...(tipVersion?{tipVersion}:{})}));
  assert.doesNotMatch(html,/modern-tip-item-icon/);
 }
});
test('RockTip opts into modern rendering while retaining the retro default',async()=>{
 const {state}=useToolTip();state.value.itemPayload={schema:{inner:item,showId:false}};
 const modern=await renderToString(createSSRApp(RockTip,{tipVersion:'modern'}));
 assert.match(modern,/data-version="modern"/);assert.match(modern,/modern-tip-item-icon/);
 const retro=await renderToString(createSSRApp(RockTip));
 assert.match(retro,/data-version="retro"/);assert.doesNotMatch(retro,/modern-tip-item-icon/);
 state.value.itemPayload=false;
});
test('modern content without an image or visible title has no broken or duplicate image',async()=>{
 assert.doesNotMatch(await renderToString(createSSRApp(ItemTipContent,{item:{...item,src:undefined},tipVersion:'modern'})),/modern-tip-item-icon/);
 assert.doesNotMatch(await renderToString(createSSRApp(ItemTipContent,{item,tipVersion:'modern',showTitle:false})),/modern-tip-item-icon/);
});

test('modern header puts type below name and quality below header; retro keeps the original order',async()=>{
 const modern=await renderToString(createSSRApp(ItemTipContent,{item:{...item,attributes:{upgradedByPercent:12}},tipVersion:'modern'}));
 assert.ok(modern.indexOf('class="name"')<modern.indexOf('class="category"'));
 assert.ok(modern.indexOf('class="category"')<modern.indexOf('class="modern-item-quality"'));
 assert.ok(modern.indexOf('class="modern-item-quality"')<modern.indexOf('class="upgrade-percent"'));
 const retro=await renderToString(createSSRApp(ItemTipContent,{item}));
 assert.ok(retro.indexOf('class="rarity"')<retro.indexOf('class="category"'));
 assert.doesNotMatch(retro,/modern-item-quality|modern-missing-stats/);
});
test('modern comparison renders equipped item, signed differences and missing bonuses on both sides',async()=>{
 const worn={id:'worn-ring',name:'Stary pierścień',category:'rings',rarity:'common',attributes:{health:614,strength:10}};
 const hovered={id:'bag-ring',name:'Nowy pierścień',category:'rings',rarity:'unique',attributes:{health:232,criticalChance:3,attackSpeed:18}};
 const {state}=useToolTip();state.value.itemPayload={schema:{inner:hovered,showId:false}};
 const modern=await renderToString(createSSRApp(RockTip,{tipVersion:'modern',equippedItems:[worn]}));
 assert.match(modern,/modern-comparison/);assert.match(modern,/Wyposażony/);
 assert.match(modern,/Stary pierścień/);assert.match(modern,/Nowy pierścień/);
 assert.match(modern,/positive[^>]*> \(\+382\)/);assert.match(modern,/negative[^>]*> \(-382\)/);
 assert.equal((modern.match(/Brakujące statystyki:/g)||[]).length,2);
 const retro=await renderToString(createSSRApp(RockTip,{equippedItems:[worn]}));
 assert.doesNotMatch(retro,/modern-comparison|Wyposażony|Stary pierścień/);
 state.value.itemPayload={schema:{inner:worn,showId:false}};
 assert.doesNotMatch(await renderToString(createSSRApp(RockTip,{tipVersion:'modern',equippedItems:[worn]})),/modern-comparison/);
 state.value.itemPayload=false;
});
test('modern scalar differences retain translated units and upgrade styles stay modern-only',async()=>{
 const html=await renderToString(createSSRApp(ItemTipContent,{item:{id:'new',name:'Nowy',category:'rings',attributes:{criticalChance:5}},comparisonItem:{id:'old',name:'Stary',category:'rings',attributes:{criticalChance:2}},tipVersion:'modern'}));
 assert.match(html,/\(\+3%\)/);
 const retro=await renderToString(createSSRApp(ItemTipContent,{item:{...item,attributes:{health:100}},comparisonItem:{...item,id:'other',attributes:{health:50}}}));
 assert.doesNotMatch(retro,/modern-stat-difference|modern-missing-stats/);
});


test('cleansing scroll explains its effect in modern and retro item tips', async () => {
 for (const tipVersion of ['modern', 'retro']) {
  const html = await renderToString(createSSRApp(ItemTipContent, {
   item: {id: 'cleansing-scroll', name: 'Zwój Oczyszczenia', category: 'upgrades', rarity: 'common', attributes: {removesUpgrade: true}},
   tipVersion
  }));
  assert.match(html, /Usuwa ulepszenie z wybranego przedmiotu/);
 }
});

test('NPC tooltip displays an active finder and hides an expired finder', async () => {
 const {state} = useToolTip();
 const inner = {name: 'Heros', rank: 'HERO', lvl: 80, finderName: 'Gracz <test>'};
 try {
  state.value.npcPayload = {schema: {inner: {...inner, finderExpiresAt: Date.now() + 60_000}}};
  const active = await renderToString(createSSRApp(RockTip));
  assert.match(active, /npc-finder__label">Znalazca<\/span><span class="npc-finder__name">Gracz &lt;test&gt;/);
  state.value.npcPayload = {schema: {inner: {...inner, finderExpiresAt: Date.now() - 1}}};
  const expired = await renderToString(createSSRApp(RockTip));
  assert.doesNotMatch(expired, /Znalazca/);
 } finally {
  state.value.npcPayload = false;
 }
});
test('character tips show the linked Discord account in every tip version',async()=>{
 const {state}=useToolTip();
 state.value.otherPayload={schema:{inner:{name:'Gracz',level:50,profession:'w',wanted:false,discordName:'gracz<dc>'}}};
 for(const tipVersion of ['modern','retro','legacy']){
  const html=await renderToString(createSSRApp(RockTip,{tipVersion}));
  assert.match(html,/class="tip-discord"/);assert.match(html,/Discord:/);assert.match(html,/gracz&lt;dc&gt;/);
 }
 state.value.otherPayload={schema:{inner:{name:'Gracz',level:50,profession:'w',wanted:false}}};
 for(const tipVersion of ['modern','retro']){
  assert.doesNotMatch(await renderToString(createSSRApp(RockTip,{tipVersion})),/tip-discord/);
 }
 state.value.otherPayload=false;
});
test('discordTipHtml escapes the name and is empty without a Discord account',async()=>{
 const {discordTipHtml}=await import('../dist/virtigia-tips.es.js');
 assert.match(discordTipHtml('a<b>'),/tip-discord__name">a&lt;b&gt;</);
 assert.equal(discordTipHtml(null),'');assert.equal(discordTipHtml('  '),'');
});

test('Classic and Modern show the wanted label only for wanted characters', async () => {
 const {state} = useToolTip();
 try {
  for (const wanted of [true, false]) {
   state.value.otherPayload = {schema: {inner: {name: 'Gracz', level: 50, profession: 'w', wanted}}};
   for (const tipVersion of ['retro', 'modern']) {
    const html = await renderToString(createSSRApp(RockTip, {tipVersion}));
    assert.equal(html.includes('Poszukiwany listem gończym'), wanted);
   }
  }
 } finally {
  state.value.otherPayload = false;
 }
});
