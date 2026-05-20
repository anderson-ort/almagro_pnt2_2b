import { ref, computed } from "vue";
import { defineStore } from "pinia";

const counterStorageFunction = () => {
    // State
    const counter = ref(0);

    // Getters
    const doubleCounter = computed(() => counter.value ** 2);

    // Actions
    const increment = () => counter.value++;
    const decrement = () => counter.value--;

    const reset = () => (counter.value = 0);

    return { counter, doubleCounter, increment, decrement, reset };
};

export const useCounterStore = defineStore("counter", counterStorageFunction, {
    persist: true,
});
