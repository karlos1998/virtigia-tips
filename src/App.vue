<script setup lang="ts">

import RockTip from "./RockTip/components/rockTip.vue";
import { renderRockTipToHtml } from "./index";
import type { NpcPayload } from "./RockTip/typings/payloads";

// import './RockTip/styles/style.css'

// @ts-ignore
import chainsaw from "./assets/chainsaw2.gif?url";

// @ts-ignore
import smokczarny from "./assets/smokczarny.gif?url";
import luk from "./assets/luk91.gif?url";
import loots from "./assets/loots.png?url";
import loots2 from "./assets/loots2.png?url";
import {computed, onMounted, ref} from "vue";
import type { Profession } from "./RockTip/typings/schematics";

type TipVersion = 'retro' | 'legacy';

const staticPlayer = {
  name: 'Hrabia_Kamien',
  level: 288,
  profession: 'w' as Profession,
  clan: 'Virtigia Team',
};

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

const renderedAggressiveNpcHtml = ref('');
const tipVersion = ref<TipVersion>('retro');
const isLegacyTipVersion = computed({
  get: () => tipVersion.value === 'legacy',
  set: (enabled: boolean) => {
    tipVersion.value = enabled ? 'legacy' : 'retro';
  },
});

onMounted(() => {
  renderedAggressiveNpcHtml.value = renderRockTipToHtml(aggressiveNpcPayload, 800, 'w', true);
});


</script>

<template>
  <div id="app">
    <label class="tip-version-switch">
      <span>retro</span>
      <input v-model="isLegacyTipVersion" type="checkbox">
      <span>legacy</span>
    </label>
    <br/>

    <RockTip
        :hero-lvl="500"
        :hero-profession="'w'"
        :tip-version="tipVersion"
    />


    <span v-tip="'Moja postać'">Zwykly tip tekstowy</span>

    <hr>
    <img v-tip.item='{
      name: "Paczka rumianku",
      price: 50,
      currency: "gold",
      rarity: "common",
      category: "consumable",
      attributes: {
        "quantity": 5,
        "canSplit": true,
        "description": "Przykładowy przedmiot ze stosem możliwym do podzielenia."
      }
    }' :src="chainsaw" />

    <img v-tip.item='{
      name: "Piła",
      price: 777,
      currency: "honor",
      rarity: "artefact",
      category: "twoHanded",
      attributes: {"upgradedWith": {name: "Ametystowe wzmocnienie", value: 4,},"isPermanentlyBounded": true,"teleportTo":[1,1,1,"Test"], "allBaseAttributes":10000,"physicalDamage":[160000,200000],"fireDamage":199998,"health":160000,"needLevel":100,"description":" 1000 do wycinania drzew","attackSpeed":2000,"upgradePercent":100, "upgradedByPercent": 5, "reducedLevelRequirement": 3, "timeToDisappear": 300, "expiresOn": 1757766959, "stamina": 60, "impossibleToRemove": true, "percentageUpgradeCommon": 5, "percentageUpgradeUnique": 10, "percentageUpgradeHeroic": 15, "percentageUpgradeLegendary": 20, "upgradeableCategories": ["boots", "armors", "helmets"], "reduceLevelRequirementCommon": 1, "reduceLevelRequirementUnique": 2, "reduceLevelRequirementHeroic": 3, "reduceLevelRequirementLegendary": 4, "unbindsOwnerBound": true, "unbindsPermanentlyBound": true, "combatFlee": true, "openDeposit": true, "openClanDeposit": true, "openMail": true, "openAuction": true, "arrowPreservationChancePercent": 90}
    }' :src="chainsaw" />
    
    <img v-tip.item='{
      name: "Ukłucie nieskończoności",
      price: 777,
      currency: "gold",
      rarity: "legendary",
      category: "distances",
      attributes: {
    "needProfessions": ["t"],
    "needAgility": "500",
    "needLevel": "83",

    "enemyEvasionReduction": "19",
    "arrowPhysicalDamage": "31",
    "enchancementPoints": "13",
    "enemyManaReduction": "17",
    "physicalAbsorption": "28",
    "allBaseAttributes": "19",
    "physicalCritPower": "33",
    "absorptionDestroy": "21",
    "upgradedByPercent": "12",
    "poisonResistance": "18",
    "magicalCritPower": "27",
    "deepWoundChance": ["14", "33"],
    "chanceToCounter": "11",
    "lightResistance": "22",
    "frostResistance": "17",
    "fireResistance": "28",
    "physicalDamage": ["12", "1000"],
    "criticalChance": "13",
    "defenseDestroy": "21",
    "armorPuncture": "17",
    "energyDestroy": "14",
    "poisonDamage": [3, 333],
    "attackSpeed": "17",
    "description": "Testowy item",
    "evadePoints": 19,
    "lightDamage": "3350",
    "frostDamage": ["4", "4444"],
    "fireDamage": "888",

    "legendaryBon": ["superCriticalHitChance", "14"],

    "lootedWith": {
      "looterName": "Ronnie Radke",
      "looterGender": "M",
      "groupInfo": ["Miss Bayonetta"],
      "timestamp": 1779065913,
      "npcName": "Upiór z Elancji"
    },

    "upgradedWith": {
      "name": "Upiorne ulepszenie",
      "value": 12,
    },
    "isPermanentlyBounded": true,
    "health": "44",
    "energy": "31",
    "mana": "38"
    }}' :src="luk" />

    <img v-tip.item='{
      name: "Testowy kotek",
      price: 100,
      currency: "gold",
      rarity: "upgraded",
      category: "pet",
      attributes: {
        "quantity": 1,
        "canSplit": false,
        "maxQuantity": 4,
        "isPermanentlyBounded": true,
        "petSrc": "https://micc.garmory-cdn.cloud/obrazki/pets/premium/kot01-1.gif", "petActions": ["Miaucz"], "description": "Testowy zwierzak do celów demonstracyjnych"}
    }' :src="chainsaw" />

    <img v-tip.item='{
      name: "Klucz do pokoju",
      price: 5,
      currency: "dragonTear",
      rarity: "unique",
      category: "keys",
      attributes: {
        "quantity": 5,
        "canSplit": true,
        "maxQuantity": 4,
        "description": "Zajazd u Makiny",
        "hotelRoom": {
          "id": 3,
          "name": "Zajazd u Makiny - pokój 2",
          "rentedUntil": 1779065913854
        }
      }
    }' :src="chainsaw" />
    <img v-tip.item='{
      name: "Skórzana Sakwa",
      price: 2500,
      currency: "gold",
      rarity: "heroic",
      category: "pouches",
      attributes: {
        "bagCapacity": 12,
        "storableCategories": ["consumable", "keys", "quests", "golds"],
        "needLevel": 40,
        "description": "Lekka sakwa na drobiazgi i przedmioty użytkowe."
      }
    }' :src="chainsaw" />

    <img v-tip.item='{
      name: "Rumianek",
      category: "renewable",
      attributes: {
        "bagCapacity": 12,
        "storableCategories": ["consumable", "keys", "quests", "golds"],
        "needLevel": 40,
        "description": "Lekka sakwa na drobiazgi i przedmioty użytkowe."
      }
    }' :src="chainsaw" />

    <img v-tip.item='{
      name: "test niszczenia many i energii",
      category: "blessings",
      attributes: {
        "energyDestroy": 50,
        "enemyManaReduction": 50,
      }
    }' :src="chainsaw" />
    <hr>
    <span v-tip.html.green="'TEST'">Zielony tip dla postow na forum</span>
    <hr>
    <div data-v-ab641444="" data-v-c52eacc3="" id="loots" data-vrt-id="desktop.loots.window">
      <div data-v-ab641444="" id="loots_header_label">
        <span data-v-ab641444="" class="gfont" name="Łupy">Łupy</span></div>
        <div data-v-ab641444="" class="center">
          <table data-v-ab641444="">
            <tbody data-v-ab641444=""><tr data-v-ab641444=""><td data-v-ab641444="" class="loot-wrapper">
              <div data-v-ab641444="" class="loot"><div data-v-ab641444="" class="item common">
                <img v-tip.item='{
                  name: "Piła",
                  price: 777,
                  currency: "honor",
                  rarity: "artefact",
                  category: "twoHanded",
                  attributes: {"teleportTo":[1,1,1,"Test"], "allBaseAttributes":10000,"physicalDamage":[160000,200000],"fireDamage":199998,"health":160000,"needLevel":100,"description":" 1000 do wycinania drzew","attackSpeed":2000,"upgradePercent":100, "upgradedByPercent": 5, "reducedLevelRequirement": 3, "timeToDisappear": 300, "expiresOn": 1757766959, "stamina": 60, "impossibleToRemove": true, "percentageUpgradeCommon": 5, "percentageUpgradeUnique": 10, "percentageUpgradeHeroic": 15, "percentageUpgradeLegendary": 20, "upgradeableCategories": ["boots", "armors", "helmets"], "reduceLevelRequirementCommon": 1, "reduceLevelRequirementUnique": 2, "reduceLevelRequirementHeroic": 3, "reduceLevelRequirementLegendary": 4, "unbindsOwnerBound": true, "unbindsPermanentlyBound": true, "combatFlee": true, "openDeposit": true, "openClanDeposit": true, "openMail": true, "openAuction": true, "arrowPreservationChancePercent": 90}
                }' :src="chainsaw" />  
              </div></div>
            <div data-v-ab641444="" class="loot-decision">
              <b data-v-ab641444="" class="yes sel" data-vrt-id="desktop.loots.item.48c8b653-c4d6-434d-af1c-bf78fa6c42d5.choice.want"></b>
              <b data-v-ab641444="" class="no" data-vrt-id="desktop.loots.item.48c8b653-c4d6-434d-af1c-bf78fa6c42d5.choice.dont"></b>
              <!---->
            </div>
          </td>
        </tr>
      </tbody></table></div><button data-v-ab641444="" id="loots_button" data-vrt-id="desktop.loots.button.confirm"></button><div data-v-ab641444="" id="loots_counter">14</div><div data-v-ab641444="" id="loots_bag">Miejsca w torbie:<br data-v-ab641444="">31</div></div>
    <hr>
    <img v-tip.npc="{
      name: 'Agresywny Smok',
      lvl: 10,
      rank: 'ELITE',
      isAggressive: true,
    }" :src="smokczarny" />

    <img v-tip.npc="{
      name: 'Agresywny Smok',
      lvl: 500,
      rank: 'ELITE_II',
      isAggressive: true,
      inGroup: true,
    }" :src="smokczarny" />

    <img v-tip.npc="{
      name: 'Potulny Smok',
      lvl: 666,
      rank: 'ELITE_III',
      isAggressive: false,
    }" :src="smokczarny" />

    <img v-tip.npc="{
      name: 'Potulny Smok',
      lvl: 666,
      rank: 'HERO',
      isAggressive: false,
    }" :src="smokczarny" />

    <img v-tip.npc="{
      name: 'Agresywny Smok',
      lvl: 666,
      rank: 'TITAN',
      isAggressive: true,
    }" :src="smokczarny" />

    <hr>
    <div>
      <span>Tip listu gończego (other):</span>
      <span v-tip.other="{
        name: 'Endriu',
        level: 81,
        profession: 'w',
        wanted: true,
      }" style="cursor: pointer; color: #00ff00; font-weight: bold;">
        Endriu (81w)
      </span>
    </div>
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

    <div>
      <span>Tip wroga (other enemy):</span>
      <span v-tip.other="{
        name: 'Wrogi_Gracz',
        level: 120,
        profession: 't',
        clan: 'Nieprzyjaciele',
        relation: 'enemy'
      }" style="cursor: pointer; color: #ff5555; font-weight: bold;">
        Wrogi_Gracz (120t)
      </span>
    </div>

    <div>
      <span>Tip wrogiego klanu (other enemy clan):</span>
      <span v-tip.other="{
        name: 'Klanowy_Wrog',
        level: 130,
        profession: 'h',
        clan: 'Wrogowie',
        relation: 'enemy_clan'
      }" style="cursor: pointer; color: #ff7777; font-weight: bold;">
        Klanowy_Wrog (130h)
      </span>
    </div>

    <div>
      <span>Tip klanowicza (other clan member):</span>
      <span v-tip.other="{
        name: 'Klanowicz',
        level: 140,
        profession: 'p',
        clan: 'Virtigia Team',
        relation: 'clan_member'
      }" style="cursor: pointer; color: #ffaa33; font-weight: bold;">
        Klanowicz (140p)
      </span>
    </div>

    <div>
      <span>Tip sojusznika (other ally clan):</span>
      <span v-tip.other="{
        name: 'Sojusznik',
        level: 150,
        profession: 'b',
        clan: 'Sprzymierzeni',
        relation: 'ally_clan'
      }" style="cursor: pointer; color: #ffcc55; font-weight: bold;">
        Sojusznik (150b)
      </span>
    </div>

    <div>
      <span>Tip troop 1 (troop team):</span>
      <span v-tip.troop="{
        name: 'Ronnie Radke',
        lvl: 83,
        profession: 't',
        currentHp: 1000,
        maxHp: 1600,
        ac: 192,
        fireRes: 10,
        iceRes: 29,
        lightRes: 27,
        poisonRes: 40,
        side: 'team',
      }">
        Ronnie Radke (83t)
      </span>
    </div>
    <div>
      <span>Tip troop 2 (troop opponent):</span>
      <span v-tip.troop="{
        name: 'Razulag Oklash',
        lvl: 47,
        profession: 'm',
        currentHp: 40,
        maxHp: 60,
        ac: 43,
        fireRes: 10,
        iceRes: 0,
        lightRes: 20,
        poisonRes: 40,
        side: 'opponent',
      }">
        Razulag Oklash (47m)
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
        rarity: 'artefact',
        ownerName: 'Hrabia_Kamien'
      }" style="cursor: pointer; color: #8ff; font-weight: bold;">
        Pet Mruczek
      </span>
    </div>

    <div>
      <span>Tip przejścia (gate):</span>
      <span v-tip.gate="{
        name: 'Biblioteka Andarum',
        levelCapTop: 93,
        levelCapBottom: 83,
        locked: true,
      }">
        Biblioteka Andarum
      </span>
    </div>

  </div>

  <hr>
    <img v-tip.item='{
      name: "Piła",
      price: 777,
      currency: "honor",
      rarity: "artefact",
      category: "twoHanded",
      attributes: {"teleportTo":[1,1,1,"Test"], "allBaseAttributes":10000,"physicalDamage":[160000,200000],"fireDamage":199998,"health":160000,"needLevel":100,"description":" 1000 do wycinania drzew","attackSpeed":2000,"upgradePercent":100, "upgradedByPercent": 5, "reducedLevelRequirement": 3, "timeToDisappear": 300, "expiresOn": 1757766959, "stamina": 60, "impossibleToRemove": true, "percentageUpgradeCommon": 5, "percentageUpgradeUnique": 10, "percentageUpgradeHeroic": 15, "percentageUpgradeLegendary": 20, "upgradeableCategories": ["boots", "armors", "helmets"], "reduceLevelRequirementCommon": 1, "reduceLevelRequirementUnique": 2, "reduceLevelRequirementHeroic": 3, "reduceLevelRequirementLegendary": 4, "unbindsOwnerBound": true, "unbindsPermanentlyBound": true, "combatFlee": true, "openDeposit": true, "openClanDeposit": true, "openMail": true, "openAuction": true, "arrowPreservationChancePercent": 90}
    }' :src="chainsaw" />
  <div>
    <span>Test render tip html </span>
    <span v-html="renderedAggressiveNpcHtml" />
    koniec.
  </div>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 20px;
}

.tip-version-switch {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  margin-bottom: 12px;
  user-select: none;
}

.tip-version-switch input {
  appearance: none;
  background: #2f343a;
  border: 1px solid #777;
  border-radius: 999px;
  cursor: pointer;
  height: 22px;
  margin: 0;
  position: relative;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  width: 42px;
}

.tip-version-switch input::before {
  background: #fff;
  border-radius: 50%;
  content: "";
  height: 16px;
  left: 2px;
  position: absolute;
  top: 2px;
  transition: transform 0.15s ease;
  width: 16px;
}

.tip-version-switch input:checked {
  background: #5a7cff;
  border-color: #5a7cff;
}

.tip-version-switch input:checked::before {
  transform: translateX(20px);
}




#loots[data-v-ab641444] {
    box-sizing: border-box;
    z-index: 444;
    border-style: solid;
    border-width: 41px 32px 17px 49px;
    border-image: url(/src/assets/loots2.png) 41 32 17 49 fill round;
    height: 176px;
    position: absolute;
    top: 400px;
    left: 760px;
}

loots .loot[data-v-ab641444] {
    background: #040 url(/assets/loots.png) -180px -58px;
    width: 48px;
    height: 48px;
    margin: auto
}

loots .loot[data-v-ab641444] {
    background: #040 url(/src/assets/loots.png) -180px -58px;
    width: 48px;
    height: 48px;
    margin: auto
}

#loots.colorized .loot-wrapper.t-her[data-v-ab641444] {
    box-shadow: 0 0 15px 3px #38b8ebe6
}

#loots.colorized .loot-wrapper.t-leg[data-v-ab641444] {
    box-shadow: 0 0 15px 3px #ff8400e6
}

#loots.colorized .loot-wrapper.t-upgraded[data-v-ab641444] {
    box-shadow: 0 0 15px 3px #ff59afe6
}

#loots.colorized .loot-wrapper.t-uniupg[data-v-ab641444] {
    box-shadow: 0 0 15px 3px #fffb00e6
}

#loots.colorized .loot-wrapper.t-art[data-v-ab641444] {
    box-shadow: 0 0 15px 3px #e14046e6
}

#loots #loots_header_label[data-v-ab641444] {
    position: absolute;
    top: -32px;
    left: -36px
}

#loots .center[data-v-ab641444] {
    justify-content: center;
    align-items: center;
    min-width: 222px;
    margin-top: -40px;
    margin-left: -38px;
    margin-right: -22px;
    display: flex
}

#loots_r[data-v-ab641444] {
    background-position: -100px 0;
    width: 34px;
    right: 0
}

#loots_button[data-v-ab641444] {
    background: #040 url(/src/assets/loots.png) -135px 0;
    border: none;
    width: 113px;
    height: 29px;
    position: absolute;
    bottom: -10px;
    right: -26px
}

#loots_button[data-v-ab641444]:hover {
    background-position: -135px -29px
}

#loots_counter[data-v-ab641444] {
    text-align: center;
    color: gold;
    background: #040 url(/src/assets/loots.png) -134px -146px;
    width: 31px;
    height: 23px;
    padding-top: 6px;
    position: absolute;
    bottom: -10px;
    right: 92px
}

#loots_bag[data-v-ab641444] {
    text-align: center;
    color: gold;
    width: 80px;
    font-size: 70%;
    position: absolute;
    bottom: -10px;
    right: 125px
}

#loots TABLE[data-v-ab641444] {
    border-collapse: separate;
    border-spacing: 2px;
    margin: 35px 6px 0
}

#loots TD[data-v-ab641444] {
    vertical-align: top;
    border: 1px solid #6a644b;
    padding: 2px
}

#loots TD.yours[data-v-ab641444] {
    border: 1px solid #ff0
}

#loots .loot[data-v-ab641444] {
    background: #040 url(/src/assets/loots.png) -180px -58px;
    width: 48px;
    height: 48px;
    margin: auto;
    position: relative
}

#loots .nick[data-v-ab641444] {
    color: wheat;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 48px;
    margin-top: 1px;
    margin-bottom: 2px;
    font-size: 12px;
    overflow: hidden
}

#loots .icon[data-v-ab641444] {
    width: 32px;
    height: 32px;
    margin: auto
}

#loots .loot-decision[data-v-ab641444] {
    width: 48px;
    line-height: 11px
}

#loots B[data-v-ab641444] {
    display: inline-block
}

#loots B.no[data-v-ab641444],#loots B.yes[data-v-ab641444] {
    background: #040 url(/src/assets/loots.png) -134px -58px;
    width: 22px;
    height: 22px;
    margin: 1px
}

#loots B.no[data-v-ab641444] {
    background-position: -156px -58px
}

#loots B.need[data-v-ab641444] {
    background: #040 url(/src/assets/loots.png) -134px -102px;
    width: 46px;
    height: 22px;
    margin: 1px
}

#loots B.need.cant-need[data-v-ab641444] {
    display: none
}

#loots B.yes.sel[data-v-ab641444] {
    background-position: -134px -80px
}

#loots B.no.sel[data-v-ab641444] {
    background-position: -156px -80px
}

#loots B.need.sel[data-v-ab641444] {
    background-position: -134px -124px
}

#loots DIV.item[data-v-ab641444] {
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    position: absolute;
    top: 8px;
    left: 8px
}

#loots DIV.item img[data-v-ab641444] {
    width: 100%;
    height: 100%;
    display: block
}
</style>
