<script setup>
import Card from '../components/Card.vue'
import {ref} from 'vue'


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



const infoDesdeElHijo = (card) =>{
  console.log(`Me acciono el hijo! -> ${card.precio} -> ${card.nombre}`)
}

const logAlert = ({header}) => {alert(header)}

</script>

<template>
  <h1> Mostrar Tarjetas </h1>
  <hr/>
  

  <Card v-for='tarjeta in tarjetitas' 
    :header="tarjeta.header" 
    :precio="tarjeta.precio"
    @clickPadre="infoDesdeElHijo"
    @clickAlert="logAlert"
    >
    
  
  </Card>

</template>
