import { defineStore } from "pinia";
import { ref } from "vue";

export const useHeroStore = defineStore("heroStore", {
    state: () => ({
        lvl: 100,
        profession: 'w',

    }),
    actions: {

        setLvl(lvl: number) {
            this.lvl = lvl;
        },
        getLvl() {
            return this.lvl;
        },

        setProfession(profession: string) {
            this.profession = profession;
        },

        getProfession() {
            return this.profession;
        }

    }
});
