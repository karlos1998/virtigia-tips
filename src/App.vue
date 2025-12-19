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
    "description": "Ten przedmiot nosił przy sobie szalony miś.Ta łapka przynosiła mu szczęście,może i tobie przyniesie?",
    "needProfessions": ['p', 'h'],
    "chanceToCounter": 80,
    "useOutfit": {
      "time": 0,
      "src": "private/clan/135.gif"
    }
  },
  "category": "necklaces",
  "currency": "gold",
  "price": 74079,
  "rarity": "heroic",
  "edited_manually": false,
  "deleted_at": null,
  "category_name": "Naszyjniki",
  // "need_professions": ['w', 'h'],
  "need_level": 110,
  "in_use": false,
  "shops": [],
  "baseNpcs": []
})
</script>

<template>
  <div id="app">
    <RockTip
        base-src='https://margatron.ovh/s3/eyJpdiI6ImdManJnVjMxZmFacU5JRnp6K0FjQmc9PSIsInZhbHVlIjoiTGpBb1hvSkU0aytRRjU2TmdXYjRLM0t1UEJmUk1nT2lQUmc4c05jUkNBd04veTRwS3k2S0hMd3RkTjJ2ZXM3bzMwK0dIa2VpdkJUT0VJZlNNelNpMEdYcHU4SlZ4cXZ1VER3eEYrODRHYjRQdUJwZU1SWFdLbmd6Q1czaGJvUEp3ZXpUWWpRcE1UMURRdE9DMUdqeW5NWnBweDJHYWlLQUVDZmZEOFZhdkk5eXZvcnRLai9kWktpM0d4My8rQzBJZHZWbHdHWDFOejQ0eGR4SFBpdWU1bWkwQzVvVTBDNjA4bVhOYzNLZklqcGloYi9TcTFFTHBOTlJXWUt1QjBtRXdrOFAza3dVUHRZU3VKc05tM1I0d0M2dEV0ZVVseXdsaWVDS2JBb1loOThOVDRTOUZ4d3ZITy9qSFcwT1VwS0RtS3dQZXhmN0lpaHN3UUt4c3dEQU11Q1BCVTNROTBrWVFTaHVmSHBiR2cyOXhTcDFLUTk5dXJYbEdkQklNS1NrblJQbHNxVU4rWFhpN2MxZzhOeFp0M1RnNGFMN1V5bVg5aFlzNlMrckl6Ty9Md2U4VXFZOENDK1JNQ0lVTmExYSIsIm1hYyI6IjczZTFkMmY0MjU2Y2E2ZDY3ZWUyYzg3NTVkYjBjN2Q4NThiZTg3MGFhY2ZmZTI1Y2M5Y2Y4NmQ4MWIxYTc5ZDUiLCJ0YWciOiIifQ=='
    />

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
      currency: "honor",
      rarity: "artefact",
      category: "twoHanded",
      attributes: {"allBaseAttributes":10000,"physicalDamage":[160000,200000],"fireDamage":199998,"health":160000,"needLevel":100,"description":" 1000 do wycinania drzew","attackSpeed":2000,"upgradePercent":100, "upgradedByPercent": 5, "reducedLevelRequirement": 3, "timeToDisappear": 300, "expiresOn": 1757766959, "stamina": 60, "impossibleToRemove": true, "percentageUpgradeCommon": 5, "percentageUpgradeUnique": 10, "percentageUpgradeHeroic": 15, "percentageUpgradeLegendary": 20, "upgradeableCategories": ["boots", "armors", "helmets"], "reduceLevelRequirementCommon": 1, "reduceLevelRequirementUnique": 2, "reduceLevelRequirementHeroic": 3, "reduceLevelRequirementLegendary": 4}
    }' :src="chainsaw" />


<!--    <img v-tip.item="kroliczaLapka" :src="chainsaw" />-->
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 20px;
}
</style>
