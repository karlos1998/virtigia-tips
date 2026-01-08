<script setup lang="ts">

import RockTip from "./RockTip/components/rockTip.vue";
import { renderRockTipToHtml } from "./index";

// import './RockTip/styles/style.css'

// @ts-ignore
import chainsaw from "./assets/chainsaw2.gif?url";

// @ts-ignore
import smokczarny from "./assets/smokczarny.gif?url";
import {ref} from "vue";

const npcPayload = {
  schema: {
    inner: {
      name: 'Potulny Smok',
      lvl: 666,
      rank: 'TITAN',
      isAggressive: false,
    }
  }
}

console.log('Rendered HTML:', renderRockTipToHtml(npcPayload, 500, 'w', '', true));

// Test with different hero levels to see level color changes
const aggressiveNpcPayload = {
  schema: {
    inner: {
      name: 'Agresywny Smok',
      lvl: 666,
      rank: 'TITAN',
      isAggressive: true,
    }
  }
}

// Test with hero level much higher than NPC (should be green for aggressive)
console.log('High level hero vs aggressive NPC:', renderRockTipToHtml(aggressiveNpcPayload, 800, 'w', '', true));

// Test with hero level much lower than NPC (should be red for aggressive)
console.log('Low level hero vs aggressive NPC:', renderRockTipToHtml(aggressiveNpcPayload, 300, 'w', '', true));

// Test with hero level close to NPC (should be yellow for aggressive)
console.log('Equal level hero vs aggressive NPC:', renderRockTipToHtml(aggressiveNpcPayload, 660, 'w', '', true));

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
      name: 'Potulny Smok',
      lvl: 666,
      rank: 'TITAN',
      isAggressive: false,
    }" :src="smokczarny" />

    <img v-tip.npc="{
      name: 'Agresywny Smok',
      lvl: 666,
      rank: 'TITAN',
      isAggressive: true,
    }" :src="smokczarny" />

    <img v-tip.item='{
      name: "Piła",
      price: 777,
      currency: "honor",
      rarity: "artefact",
      category: "twoHanded",
      attributes: {"teleportTo":[1,1,1,"Test"], "allBaseAttributes":10000,"physicalDamage":[160000,200000],"fireDamage":199998,"health":160000,"needLevel":100,"description":" 1000 do wycinania drzew","attackSpeed":2000,"upgradePercent":100, "upgradedByPercent": 5, "reducedLevelRequirement": 3, "timeToDisappear": 300, "expiresOn": 1757766959, "stamina": 60, "impossibleToRemove": true, "percentageUpgradeCommon": 5, "percentageUpgradeUnique": 10, "percentageUpgradeHeroic": 15, "percentageUpgradeLegendary": 20, "upgradeableCategories": ["boots", "armors", "helmets"], "reduceLevelRequirementCommon": 1, "reduceLevelRequirementUnique": 2, "reduceLevelRequirementHeroic": 3, "reduceLevelRequirementLegendary": 4, "unbindsOwnerBound": true, "unbindsPermanentlyBound": true, "combatFlee": true, "openMail": true, "openAuction": true}
    }' :src="chainsaw" />

    <img v-tip.item='{
      name: "Testowy kotek",
      price: 100,
      currency: "gold",
      rarity: "common",
      category: "pet",
      attributes: {"petSrc": "https://micc.garmory-cdn.cloud/obrazki/pets/premium/kot01-1.gif", "petActions": ["Miaucz"], "description": "Testowy zwierzak do celów demonstracyjnych"}
    }' :src="chainsaw" />

  </div>

  <hr>
  <div>
    <span>Test render tip html</span>
    <span v-html="renderRockTipToHtml(aggressiveNpcPayload, 800, 'w', '', true)" />
    koniec.
  </div>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 20px;
}
</style>
