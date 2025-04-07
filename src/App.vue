<script setup lang="ts">

import RockTip from "./RockTip/components/rockTip.vue";

// import './RockTip/styles/style.css'

// @ts-ignore
import chainsaw from "./assets/chainsaw2.gif?url";

// @ts-ignore
import smokczarny from "./assets/smokczarny.gif?url";
import {ref} from "vue";



const kroliczaLapka = ref({
  "id": 2816,
  "name": "Królicza łapka",
  "stats": "nodesc;heroic;lvl=110;opis=Ten przedmiot nosił przy sobie szalony miś.<br>Ta łapka przynosiła mu szczęście,<br>może i tobie przyniesie?",
  "pr": "74079",
  "cl": "13",
  "src": "https://map-editor.margatron.ovh/s3/img/items/nas/naszyjnik26.gif?1734542316",
  "created_at": "2024-12-18T17:18:36.000000Z",
  "updated_at": "2024-12-18T17:18:36.000000Z",
  "attributes": {
    "isUnidentified": true,
    "needLevel": 110,
    "description": "Ten przedmiot nosił przy sobie szalony miś.Ta łapka przynosiła mu szczęście,może i tobie przyniesie?"
  },
  "category": "necklaces",
  "currency": "gold",
  "price": 74079,
  "rarity": "heroic",
  "edited_manually": false,
  "deleted_at": null,
  "category_name": "Naszyjniki",
  "need_professions": [],
  "need_level": 110,
  "in_use": false,
  "shops": [],
  "baseNpcs": []
})
</script>

<template>
  <div id="app">
    <RockTip />

    <span v-tip="'TEST'">Zwykly tip tekstowy</span>

    <hr>
    <span v-tip.html.green="'TEST'">Zielony tip dla postow na forum</span>
    <hr>

    <img v-tip.npc="{
      name: 'Smok',
      lvl: 666,
      rank: 'TITAN',
    }" :src="smokczarny" />

    <img v-tip.item='{
      name: "Piła",
      price: 777,
      currency: "gold",
      rarity: "artefact",
      category: "twoHanded",
      attributes: {"allBaseAttributes":10000,"physicalDamage":[160000,200000],"fireDamage":199998,"health":160000,"needLevel":100,"description":" 1000 do wycinania drzew","attackSpeed":2000,"upgradePercent":100}
    }' :src="chainsaw" />


    <img v-tip.item="kroliczaLapka" :src="chainsaw" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 20px;
}
</style>
