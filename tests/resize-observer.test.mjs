import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRenderer, nextTick, markRaw} from 'vue';
import {RockTip,useToolTip} from '../dist/virtigia-tips.es.js';

test('defers ResizeObserver layout writes, coalesces events and cancels pending work on unmount',async()=>{
 const originalWindow=globalThis.window, originalObserver=globalThis.ResizeObserver;
 let observerCallback,disconnected=false,reads=0,width=200;
 const frames=new Map();let frameId=0;
 globalThis.window={innerWidth:1000,innerHeight:700,scrollX:0,scrollY:0,addEventListener(){},removeEventListener(){},requestAnimationFrame(cb){frames.set(++frameId,cb);return frameId;},cancelAnimationFrame(id){frames.delete(id);}};
 globalThis.ResizeObserver=class{constructor(cb){observerCallback=cb;}observe(){}disconnect(){disconnected=true;}};
 const node=tag=>markRaw({tag,children:[],props:{},getBoundingClientRect(){reads++;return {width,height:400};}});
 const renderer=createRenderer({
  createElement:node,createText:text=>({...node('#text'),text}),createComment:()=>node('#comment'),
  setText(el,text){el.text=text;},setElementText(el,text){el.text=text;},
  parentNode:el=>el.parent??null,nextSibling:()=>null,
  patchProp(el,key,prev,value){el.props[key]=value;},
  insert(el,parent){el.parent=parent;parent.children.push(el);},remove(){}
 });
 const app=renderer.createApp(RockTip,{tipVersion:'modern'});
 const api=useToolTip();let mounted=false;
 try{
  api.state.value.opened=false;
  const root=node('root');app.mount(root);mounted=true;
  assert.equal(root.children[0].props.style.width,'max-content');
  const target=markRaw({dataset:{},getBoundingClientRect:()=>({left:800,top:300,width:32,height:32})});
  await api.triggerEnter(target);
  const beforeReads=reads;
  width=350;
  observerCallback();observerCallback();observerCallback();
  assert.equal(reads,beforeReads,'observer must not read/write layout during its notification');
  assert.equal(frames.size,1);
  const [id,callback]=frames.entries().next().value;frames.delete(id);callback();await nextTick();
  assert.equal(api.state.value.positionX,446);
  observerCallback();assert.equal(frames.size,1);
  app.unmount();mounted=false;
  assert.equal(frames.size,0);assert.equal(disconnected,true);assert.equal(api.state.value.element,null);
 }finally{
  if(mounted)app.unmount();api.triggerOut(api.state.value.target);
  globalThis.window=originalWindow;globalThis.ResizeObserver=originalObserver;
 }
});
