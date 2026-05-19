<script setup>
import Card from '../components/Card.vue'
import {ref} from 'vue'
import {useAuth} from '../composables/useAuth.js'
import { useRouter } from 'vue-router'
 


// para cuando el usuario esta autenticado
const { isAuthenticated, signOut, user } = useAuth()
const router = useRouter()


const tarjetitas = ref([])

tarjetitas.value = [
  {
    header: "Plan Básico",
    precio: 1000,
    contenidoHtml: `
      <ul>
        <li>Acceso limitado</li>
        <li>Soporte por email</li>
      </ul>
    `
  },
  {
    header: "Plan Pro",
    precio: 2500,
    contenidoHtml: `
      <div>
        <h4>Beneficios</h4>
        <p>Acceso completo a todos los módulos</p>
        <button>Comprar</button>
      </div>
    `
  },
  {
    header: "Plan Enterprise",
    precio: 5000,
    contenidoHtml: `
      <section>
        <h3>Solución empresarial</h3>
        <p>Incluye soporte prioritario y SLA</p>
        <a href="#">Contactar ventas</a>
      </section>
    `
  }
];


// solo cuando esta authenticado o el usuario esta disponible en la app
const handleSignOut = async () => {

  try {
    await signOut()
    router.push("/")
    console.log('Sesion cerrada')

  } catch (error) {
  }
}



const infoDesdeElHijo = (card) =>{
  console.log(`Me acciono el hijo! -> ${card.precio} -> ${card.nombre}`)
}

const logAlert = ({header}) => {alert(header)}




</script>

<template>
    <h1> Mostrar Tarjetas </h1>
    
    <div v-if="isAuthenticated">
    
    <p>
    Usuario autenticado:
    {{ user?.email }}
    </p>
    
    <button @click="handleSignOut">
    Sign Out
    </button>
    
    </div>
  
  <hr/>
  

  <Card v-for='tarjeta in tarjetitas' 
    :header="tarjeta.header" 
    :precio="tarjeta.precio"
    @clickPadre="infoDesdeElHijo"
    @clickAlert="logAlert"
    >
    
  
  </Card>

</template>
