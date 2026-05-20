import { supabase } from "@/lib/supabase";

import { defineStore } from "pinia";
import { ref, computed } from "vue";

const authStore = () => {
    const user = ref(null);
    const loading = ref(false);

    // getter
    //
    const isAuthenticated = computed(() => user.value !== null);

    const signIn = async (email, password) => {
        loading.value = true;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        loading.value = false;

        if (error) throw error;

        user.value = data.user;

        return;
    };

    const signUp = async (email, password) => {
        loading.value = true;
        const { data, error } = await supabase.auth.signUp({ email, password });
        loading.value = false;
        if (error) throw error;

        if (data.user && data.session) {
            user.value = data.user;
        }
        return;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        user.value = null;
    };

    const initAuthListener = () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            user.value = session?.user ?? null;
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            user.value = session?.user ?? null;
        });
    };

    return {
        user,
        loading,
        isAuthenticated,
        initAuthListener,
        signIn,
        signUp,
        signOut,
    };
};

export const useAuthStore = defineStore("auth", authStore, {
    persist: {
        pick: ["user"],
    },
});
