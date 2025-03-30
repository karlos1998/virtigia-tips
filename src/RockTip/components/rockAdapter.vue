<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";

import type { ItemPayload, OtherPayload, NpcPayload, HtmlPayload } from "../typings/payloads";
import detectMount from "../components/detectMount.vue";
import rockTip from "../components/rockTip.vue";

const selfProperties = defineProps<{
    otherPayload?: OtherPayload,
    itemPayload?: ItemPayload,
    htmlPayload?: HtmlPayload
    npcPayload?: NpcPayload,
    direction: "bottom" | "right" | "left" | "top",
}>();
const adapterInstance = getCurrentInstance();
const adapterState = reactive({
    "interaction": "desktop",
    "direction": selfProperties.direction || "top",
    "visible": false,
});

const adapterHandlers = {
    onTouchStart: function() {
        adapterMethods.updateDirection();
        adapterMethods.updatePosition();
        adapterState.interaction = 'mobile';
        adapterState.visible = !adapterState.visible;
        return true;
    },
    onTouchMove: function() {
        adapterState.visible = false;
        return true;
    },
    onMouseOver: function() {
        adapterMethods.updateDirection();
        adapterMethods.updatePosition();
        adapterState.interaction = 'desktop';
        adapterState.visible = true;
        return true;
    },
    onMouseOut: function() {
        if(adapterState.interaction !== 'desktop') {
            return false;
        };
        adapterMethods.resetStyle();
        adapterState.visible = false;
        return true;
    },
    onScroll: function() {
        adapterState.visible = false;
        return true;
    },
};
const adapterMethods = {
    updateDirection: function(retryCount: number = 0) {
        if(retryCount >= 1000) {
            return false;
        };
        const currentAdapter = document.querySelector<HTMLDivElement>(`.rockAdapter[uid='${adapterInstance.uid}']`);
        if(!currentAdapter) {
            return false;
        };
        const adapterContainer = currentAdapter.querySelector(".container");
        if(!adapterContainer) {
            return requestAnimationFrame(() => adapterMethods.updateDirection(retryCount + 1));
        };
        const containerRect = adapterContainer.getBoundingClientRect();
        if(containerRect.top <= 0) {
            adapterState.direction = "bottom";
        };
        if(containerRect.left <= 0) {
            adapterState.direction = "right";
        };
        if(containerRect.right >= window.innerWidth) {
            adapterState.direction = "left";
        };
        if(containerRect.bottom >= window.innerHeight) {
            adapterState.direction = "top";
        };
        return true;
    },
    updatePosition: function() {
        const currentAdapter = document.querySelector<HTMLDivElement>(`.rockAdapter[uid='${adapterInstance.uid}']`);
        if(!currentAdapter) {
            return false;
        };
        const adapterFormat = currentAdapter.getAttribute("format");
        if(!["other", "html", "npc"].includes(adapterFormat)) {
            return false;
        };
        const adapterParent = currentAdapter.parentElement;
        const parentRect = adapterParent.getBoundingClientRect();

        currentAdapter.style.height = `${(parentRect.height / 16).toFixed(4)}rem`;
        currentAdapter.style.width = `${(parentRect.width / 16).toFixed(4)}rem`;
        return true;
    },
    resetStyle: function() {
        const currentAdapter = document.querySelector<HTMLDivElement>(`.rockAdapter[uid='${adapterInstance.uid}']`);
        if(!currentAdapter) {
            return false;
        };
        currentAdapter.removeAttribute("style");
        return true;
    },
    onMounted: function(rootElement: HTMLElement) {
        document.addEventListener("touchmove", adapterHandlers.onTouchMove);
        document.addEventListener("scroll", adapterHandlers.onScroll);
        rootElement.addEventListener("touchstart", adapterHandlers.onTouchStart);
        rootElement.addEventListener("mouseover", adapterHandlers.onMouseOver);
        rootElement.addEventListener('mouseout', adapterHandlers.onMouseOut);
        return true;
    },
};
</script>

<template>
    <slot v-if="selfProperties.otherPayload">
        <detectMount :callback="adapterMethods.onMounted">
            <div :uid="adapterInstance.uid" class="rockAdapter" format="other">
                <slot v-if="adapterState.visible">
                    <div class="container" :direction="adapterState.direction">
                        <rockTip :otherPayload="selfProperties.otherPayload" />
                    </div>
                </slot>
            </div>
        </detectMount>
    </slot>

    <slot v-if="selfProperties.htmlPayload">
        <detectMount :callback="adapterMethods.onMounted">
            <div :uid="adapterInstance.uid" class="rockAdapter" format="html">
                <slot v-if="adapterState.visible">
                    <div class="container" :direction="adapterState.direction">
                        <rockTip :htmlPayload="selfProperties.htmlPayload" />
                    </div>
                </slot>
            </div>
        </detectMount>
    </slot>

    <slot v-if="selfProperties.itemPayload">
        <div :uid="adapterInstance.uid" class="rockAdapter" format="item" draggable="true" :rank="selfProperties.itemPayload.schema.inner.rarity"
            :style="{
                transform: `translate(${((selfProperties.itemPayload.schema.position.x / 16).toFixed(4))}rem, ${(selfProperties.itemPayload.schema.position.y / 16).toFixed(4)}rem)`
            }"
            @touchstart="adapterHandlers.onTouchStart"
            @mouseover="adapterHandlers.onMouseOver"
            @mouseout="adapterHandlers.onMouseOut"
        >
            <slot v-if="adapterState.visible">
                <div class="container" :direction="adapterState.direction">
                    <rockTip :itemPayload="selfProperties.itemPayload" />
                </div>
            </slot>
            <img :src="selfProperties.itemPayload.schema.inner.src" />
        </div>
    </slot>

    <slot v-if="selfProperties.npcPayload">
        <detectMount :callback="adapterMethods.onMounted">
            <div
                class="rockAdapter"
                format="npc"
                draggable="true"
                :uid="adapterInstance.uid"
            >
                <slot v-if="adapterState.visible">
                    <div class="container" :direction="adapterState.direction">
                        <rockTip :npcPayload="selfProperties.npcPayload" />
                    </div>
                </slot>
            </div>
        </detectMount>
    </slot>
</template>

<style scoped>
.rockAdapter:hover {
    z-index: 9999;
}
.rockAdapter[format='item'] {
    pointer-events: all;
    position: absolute;
    cursor: grab;
    height: 2rem;
    width: 2rem;
}
.rockAdapter[format='item'][rank='legendary'] {
    box-shadow: inset 0px 0px 0px 1px hsl(315deg, 100%, 35%);
}
.rockAdapter[format='item'][rank='artefact'] {
    box-shadow: inset 0px 0px 0px 1px hsl(0deg, 100%, 30%);
}
.rockAdapter[format='item'][rank='upgraded'] {
    box-shadow: inset 0px 0px 0px 1px hsl(60deg, 100%, 50%);
}
.rockAdapter[format='item'][rank='heroic'] {
    box-shadow: inset 0px 0px 0px 1px hsl(200deg, 100%, 55%);
}
.rockAdapter[format='item'][rank='unique'] {
    box-shadow: inset 0px 0px 0px 1px hsl(45deg, 70%, 42%);
}

.rockAdapter[format='other'],
.rockAdapter[format='html'],
.rockAdapter[format='npc'] {
    pointer-events: none;
    position: absolute;
}

.rockAdapter > .container[direction='bottom'] {
    transform: translate(-50%);
    top: calc(100% + 0.25rem);
}

.rockAdapter > .container[direction='right'] {
    transform: translate(calc(7.5%), calc(-50%));
}
.rockAdapter > .container[direction='left'] {
    transform: translate(calc(-100% - 1.25rem), calc(-50%));
}
.rockAdapter > .container[direction='top'] {
    transform: translate(-50%);
    bottom: calc(100% + 0.25rem);
}
.rockAdapter > .container {
    pointer-events: none;
    position: absolute;
    z-index: 9999;
    height: max-content;
    width: max-content;
    left: 50%;
}
</style>
