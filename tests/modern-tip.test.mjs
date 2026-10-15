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
