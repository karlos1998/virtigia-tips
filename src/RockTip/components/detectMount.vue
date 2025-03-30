
<script lang="ts" setup>
defineProps<{
    "callback": Function,
}>();
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    "name": "detectMount",
    "mounted": function() {
        return this.callback(this.$el.parentElement);
    },
});
</script>

<template>
    <slot></slot>
</template>