<script setup lang="ts">

import RockTip from "./RockTip/components/rockTip.vue";
import { renderRockTipToHtml } from "./index";
import type { NpcPayload } from "./RockTip/typings/payloads";

// import './RockTip/styles/style.css'

// @ts-ignore
import chainsaw from "./assets/chainsaw2.gif?url";

// @ts-ignore
import smokczarny from "./assets/smokczarny.gif?url";
import {ref} from "vue";
import type { Profession } from "./RockTip/typings/schematics";

const staticPlayer = {
  name: 'Hrabia_Kamien',
  level: 288,
  profession: 'w' as Profession,
  clan: 'Virtigia Team',
};

const npcPayload: NpcPayload = {
  schema: {
    inner: {
      name: 'Potulny Smok',
      lvl: 666,
      inGroup: false,
      rank: 'TITAN',
      isAggressive: false,
    }
  }
}

console.log('Rendered HTML:', renderRockTipToHtml(npcPayload, 500, 'w', '', true));

// Test with different hero levels to see level color changes
const aggressiveNpcPayload: NpcPayload = {
  schema: {
    inner: {
      name: 'Agresywny Smok',
      lvl: 666,
      inGroup: false,
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
        :hero-lvl="500"
        :hero-profession="'w'"
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

    <img v-tip.item='{
      name: "Klucz do pokoju",
      price: 5,
      currency: "dragonTear",
      rarity: "common",
      category: "keys",
      attributes: {
        "description": "Zajazd u Makiny",
        "hotelRoom": {
          "id": 3,
          "name": "Zajazd u Makiny - pokój 2",
          "rentedUntil": 1779065913854
        }
      }
    }' :src="chainsaw" />

    <hr>
    <div>
      <span>Tip gracza (other):</span>
      <span v-tip.other="{
        name: staticPlayer.name,
        level: staticPlayer.level,
        profession: staticPlayer.profession,
        clan: staticPlayer.clan,
        blessing: true,
        role: 'Mistrz Gry'
      }" style="cursor: pointer; color: #00ff00; font-weight: bold;">
        {{ staticPlayer.name }} ({{ staticPlayer.level }}{{ staticPlayer.profession }})
      </span>
    </div>

    <div>
      <span>Tip przyjaciela (other friend):</span>
      <span v-tip.other="{
        name: 'Przyjazny_Gracz',
        level: 100,
        profession: 'm',
        clan: 'Virtigia Team',
        relation: 'friend'
      }" style="cursor: pointer; color: #00ff00; font-weight: bold;">
        Przyjazny_Gracz (100m)
      </span>
    </div>

    <div>
      <span>Tip Karmazynowe Bractwo (other):</span>
      <span v-tip.other="{
        name: 'Karmazynowy_Msciciel',
        level: 250,
        profession: 'b',
        clan: 'Karmazynyn',
        brotherhoodMember: true
      }" style="cursor: pointer; color: #ff0000; font-weight: bold;">
        Karmazynowy_Msciciel (250b)
      </span>
    </div>

    <hr>
    <div>
      <span>Tip nagrobka (rip):</span>
      <span v-tip.rip="{
        nick: 'Zlomiarz',
        lvl: 100,
        profession: 'w',
        gender: 'm',
        reason: 'Smok Cienia',
        description: 'Prawi ludzie giną młodo'
      }" style="cursor: pointer; color: #ddd; font-weight: bold;">
        RIP Zlomiarz
      </span>
    </div>

    <div>
      <span>Tip peta (pet):</span>
      <span v-tip.pet="{
        name: 'Mruczek',
        ownerName: 'Hrabia_Kamien'
      }" style="cursor: pointer; color: #8ff; font-weight: bold;">
        Pet Mruczek
      </span>
    </div>

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
