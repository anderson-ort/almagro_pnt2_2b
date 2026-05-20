import { computed, ref } from "vue";
import { defineStore } from "pinia";

const useTheme = () => {
    // manerjar el estado
    // state
    //
    const theme = ref("light");

    //getter
    //
    const isDark = computed(() => theme.value === "dark");

    //action
    const toggle = () => {
        theme.value = theme.value === "dark" ? "light" : "dark";
    };

    return {
        theme,
        isDark,
        toggle,
    };
};

export const useThemeStore = defineStore("theme", useTheme, { persist: true });
