import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSSRApp} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {ItemTipContent} from '../dist/virtigia-tips.es.js';

const definition = {deck:'retro',kind:'unit',strength:6,hero:false,rows:['close'],abilities:['spy'],generatedOnly:false};
const item = card => ({id:'playing-card',name:'Karta testowa',category:'playingCards',rarity:'common',attributes:{playingCard:{...definition,...card}}});
const render = (value, tipVersion='modern') => renderToString(createSSRApp(ItemTipContent,{item:value,tipVersion}));

test('playing cards show translated type, deck, strength, row and ability in every layout', async () => {
    for (const version of ['modern','retro','legacy']) {
        const html = await render(item(),version);
        assert.match(html,/Typ: Karta do gry/);
        assert.match(html,/Talia:[\s\S]*Retro/);
        assert.match(html,/Rodzaj karty:[\s\S]*Jednostka/);
        assert.match(html,/Siła karty:[\s\S]*>6</);
        assert.match(html,/Rząd:[\s\S]*Zwarcie/);
        assert.match(html,/Szpieg/);
        assert.match(html,/Dobierasz do dwóch kart ze swojej talii/);
        assert.doesNotMatch(html,/Nieznany typ|Nieznany stat/);
    }
});

test('zero strength remains visible and agile units explain the permanent row choice',async()=>{
    const html = await render(item({strength:0,rows:['close','ranged'],abilities:[]}));
    assert.match(html,/Siła karty:[\s\S]*>0</);
    assert.match(html,/Zwarcie \/ Dystans/);
    assert.match(html,/Karta pozostaje w wybranym rzędzie/);
});

test('heroes describe immunities and generated units explain their deck restriction',async()=>{
    const html=await render(item({strength:15,hero:true,generatedOnly:true,abilities:['medic']}));
    assert.match(html,/★ Bohater/);
    assert.match(html,/Odporny na pogodę/);
    assert.match(html,/Nie można go zabrać manekinem ani wskrzesić medykiem/);
    assert.match(html,/Medyk/);
    assert.match(html,/Nie można jej dołączyć do talii/);
});

test('special, weather and leader cards do not pretend to have unit strength',async()=>{
    for(const [kind,ability,label] of [['special','decoy','Specjalna'],['weather','storm','Pogoda'],['leader','foltest_lord','Dowódca']]){
        const html=await render(item({kind,strength:null,rows:[],abilities:[ability]}));
        assert.match(html,new RegExp(label));
        assert.doesNotMatch(html,/Siła karty:|Rząd:/);
        if(kind==='leader') assert.match(html,/raz na mecz/);
    }
});

test('all supported abilities have readable names and effect descriptions',async()=>{
    const labels={spy:'Szpieg',medic:'Medyk',bond:'Więź',morale:'Morale',horn:'Róg',muster:'Braterstwo',scorch:'Pożoga',scorch_c:'Pożoga zwarcia',avenger:'Przemiana',frost:'Mróz',fog:'Mgła',rain:'Deszcz',storm:'Sztorm',clear:'Czyste niebo',decoy:'Manekin',foltest_king:'Przywołaj mgłę',foltest_lord:'Usuń pogodę',foltest_siegemaster:'Róg oblężenia',foltest_son:'Pożoga zwarcia',foltest_steelforged:'Pożoga oblężenia'};
    for(const [ability,label] of Object.entries(labels)){
        const html=await render(item({abilities:[ability]}));
        assert.ok(html.includes(label),ability);
        assert.match(html,/playing-card-tip__ability[^>]*><strong[^>]*>[\s\S]+?<\/strong><div[^>]*>[\s\S]+?<\/div>/);
        assert.doesNotMatch(html,/Nieznany stat/);
    }
});

test('card text and future identifiers are escaped and descriptions are shown only once',async()=>{
    const malicious='<img src=x onerror=alert(1)>';
    const value=item({deck:malicious,kind:malicious,rows:[malicious],abilities:[malicious]});
    value.attributes.description=malicious;
    const html=await render(value);
    assert.doesNotMatch(html,/<img src=x|<script/);
    assert.match(html,/&lt;img/);
    assert.equal((html.match(/playing-card-tip__description/g)||[]).length,1);
    assert.doesNotMatch(html,/data-stat="description"/);
});

test('missing or malformed metadata does not break the item tooltip',async()=>{
    for(const playingCard of [null,undefined,[],false,'invalid']){
        const html=await render({...item(),attributes:{playingCard}});
        assert.match(html,/Typ: Karta do gry/);
        assert.match(html,/Brak danych karty/);
    }
    const html=await render(item({strength:'invalid',rows:[null,{},'close'],abilities:[false,{},'spy']}));
    assert.match(html,/Zwarcie/); assert.match(html,/Szpieg/);
    assert.doesNotMatch(html,/\[object Object\]|Siła karty:/);
});

test('other item categories do not render card metadata',async()=>{
    const html=await render({...item(),category:'rings'});
    assert.doesNotMatch(html,/playing-card-tip|Talia:|Siła karty:/);
});
