import { supabase } from "../lib/supabase.js";
import { ref } from 'vue'

export const useAuth = () => {
    const user = ref(null)
    const isAuthenticated = ref(false)


    supabase.auth.onAuthStateChange(
        (e, session) => {
            user.value = session?.user ?? null
            isAuthenticated.value = !!session?.user
        }
    )


    const init = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        user.value = session?.user ?? null
        isAuthenticated.value = !!session?.user
    }

    init()


    const signIn = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) throw error

        return data
    }
    const signUp = async ({ email, password }) => {

        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) throw error

        return data

    }

    const signOut = async () => {
        const { data, error } = await supabase.auth.signOut({ email, password })

        if (error) throw error

    }
    return {
        user, isAuthenticated, signIn, signUp, signOut
    }

}