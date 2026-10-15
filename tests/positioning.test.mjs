import {test, afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {createSSRApp, markRaw} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {useToolTip, RockTip} from '../dist/virtigia-tips.es.js';
const originalWindow=globalThis.window;
afterEach(()=>{globalThis.window=originalWindow;useToolTip().triggerOut(useToolTip().state.value.target);});
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
async function place(targetRect,tipSize,viewport=[1000,700],direction='top',bounds){
 globalThis.window={innerWidth:viewport[0],innerHeight:viewport[1],scrollX:0,scrollY:0};
 const api=useToolTip();
 const target=markRaw({dataset:bounds?{targetBounds:bounds}:{},getBoundingClientRect:()=>targetRect});
 api.setToolTipElement({getBoundingClientRect:()=>({width:tipSize[0],height:tipSize[1]})});
 await api.triggerEnter(target,{modifiers:{[direction]:true}});
 return {api,x:api.state.value.positionX,y:api.state.value.positionY};
}
test('tall equipment tooltip fits left without covering its source',async()=>{
 const {x,y}=await place(rect(800,300,32,32),[350,620]);
 assert.equal(x,446);assert.equal(y,6);assert.ok(x+350<800);
});
test('uses right side when neither vertical side fits and only right has space',async()=>{
 const {x,y}=await place(rect(40,300,32,32),[350,620]);
 assert.equal(x,76);assert.equal(y,6);
});
test('includes the gap and viewport padding when testing vertical fit',async()=>{
 const {x,y}=await place(rect(800,305,32,32),[350,300],[1000,640]);
 assert.equal(x,446);assert.equal(y,171);
});
test('respects explicit direction, flips at viewport edges and includes page scroll',async()=>{
 const {api,x}=await place(rect(20,200,32,32),[200,100],[1000,700],'left');
 assert.equal(x,56);
 window.scrollX=10;window.scrollY=100;
 api.reposition('right');
 assert.equal(api.state.value.positionX,66);assert.equal(api.state.value.positionY,266);
});
test('uses canvas target bounds for both side choice and final position',async()=>{
 const {x,y}=await place(rect(0,0,1000,700),[350,620],[1000,700],'top','800,300,32,32');
 assert.equal(x,446);assert.equal(y,6);
});
test('recalculates after asynchronous tooltip growth',async()=>{
 const {api}=await place(rect(800,300,32,32),[350,100]);
 assert.equal(api.state.value.positionY,196);
 api.setToolTipElement({getBoundingClientRect:()=>({width:350,height:620})});
 api.reposition();assert.equal(api.state.value.positionX,446);assert.equal(api.state.value.positionY,6);
});
test('oversized tips stay anchored inside the viewport without negative coordinates',async()=>{
 const {x,y}=await place(rect(170,200,32,32),[350,900],[390,600]);
 assert.ok(x>=6);assert.ok(y>=6);assert.ok(x+350<=384);
});
test('tooltip never intercepts pointer events even when no non-overlapping placement exists',async()=>{
 const html=await renderToString(createSSRApp(RockTip,{tipVersion:'modern'}));
 assert.match(html,/pointer-events:none/);
});

test('ignores malformed canvas bounds',async()=>{
 const {x,y}=await place(rect(800,300,32,32),[350,620],[1000,700],'top','bad,0,32,32');
 assert.equal(x,446);assert.equal(y,6);
});
test('does not position a tooltip after the pointer has already left',async()=>{
 const {api}=await place(rect(800,300,32,32),[350,620]);
 const target=api.state.value.target;
 const pending=api.triggerEnter(target);
 api.triggerOut(target);
 await pending;
 assert.equal(api.state.value.opened,false);
 assert.equal(api.state.value.positionX,-9999);
});
