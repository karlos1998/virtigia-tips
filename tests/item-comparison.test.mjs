import {test} from 'node:test';
import assert from 'node:assert/strict';
import {findEquippedComparison,attributeDifference,missingComparisonStats} from '../dist/virtigia-tips.es.js';
const item=(id,category,attributes={})=>({id,category,attributes,name:id});
test('comparison uses equipment slots, ignores consumables, self and empty slots',()=>{
 const ring=item('ring','rings'), sword=item('sword','oneHanded');
 assert.equal(findEquippedComparison(item('new','rings'),[sword,ring]),ring);
 assert.equal(findEquippedComparison(item('bow','distances'),[sword,ring]),sword);
 assert.equal(findEquippedComparison(item('aux','auxiliary'),[item('shield','shields')])?.id,'shield');
 assert.equal(findEquippedComparison(item('meat','consumable'),[ring]),undefined);
 assert.equal(findEquippedComparison(item('helm','helmets'),[ring]),undefined);
 assert.equal(findEquippedComparison(ring,[ring]),undefined);
});
test('numeric deltas preserve negative values and array shape without comparing metadata or effects as numbers',()=>{
 assert.deepEqual(attributeDifference(100,40),[60]);
 assert.deepEqual(attributeDifference(-6,4),[-10]);
 assert.deepEqual(attributeDifference([10,30],[15,20]),[-5,10]);
 assert.equal(attributeDifference([10,30],20),undefined);
 assert.equal(attributeDifference('10','20'),undefined);
 assert.equal(attributeDifference(0,0),undefined);
 assert.equal(attributeDifference(NaN,10),undefined);
 assert.equal(attributeDifference(undefined,10),undefined);
});
test('missing bonuses excludes quantity and limits, while recognizing zero and null as absent',()=>{
 const current=item('old','rings',{health:0,strength:null});
 const other=item('new','rings',{health:200,strength:20,quantity:5,maxQuantity:10,needLevel:100});
 assert.deepEqual(new Set(missingComparisonStats(current,other)),new Set(['health','strength']));
 assert.deepEqual(missingComparisonStats(current),[]);
});
