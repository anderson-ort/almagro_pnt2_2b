import { reactive } from 'vue'
import { useAuth } from './useAuth.js'
import { useRouter } from 'vue-router'

export const useAuthForm = () => {

    const router = useRouter()

    const { signIn, signUp } = useAuth()


    const form = reactive({
        email: '',
        password: '',
        isLogin: true,
        loading: false,
        error: ''
    })


    const isValidForm = () => (!form.email.trim() || !form.password.trim())


    const login = async () => {
        await signIn({ email: form.email, password: form.password })
        router.push("/dashboard")
    }

    const register = async () => {
        await signUp({ email: form.email, password: form.password })
        form.isLogin = true
    }



    const submit = async () => {
        console.log("Click session activada")

        console.log({email:form.email,pass: form.password})
        
        if (isValidForm()) return

        form.loading = true
        form.error = ''

        if (form.isLogin) {
            console.log("SignIn Process")
            await login()
            return
        }

        console.log("Register Process")
        await register()

        form.loading = false
    }


    const toggleMode = () => {
        form.isLogin = !form.isLogin
        form.error = ''
    }

    return {
        form, submit, toggleMode
    }
}