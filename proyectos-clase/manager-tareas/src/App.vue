<script setup>
import CardTarea from './components/CardTarea.vue';

function handleTareaAceptada(tarea) {
  console.log('Tarea aceptada:', tarea);
}

</script>

<template>

  <div>

    <h2> Manager Dashboard Bello</h2>

    <CardTarea 
    titulo="Arreglar formulario de Registro" 
    prioridad="Alta"
    :dev="{nombre: 'maria',email: 'maria@gmail.com'}" 
    @tareaAceptada="handleTareaAceptada"
    >
      <p> Amigo, dale prioridad a la tarea</p>
    </CardTarea>


    <!-- van a pasar por un slot -->
    <CardTarea 
      titulo="Comitear el ultimo cambio" 
      prioridad="Media Baja" 
      :dev="{nombre: 'cacho',email: 'cacho@gmail.com'}" 
      @tareaAceptada="handleTareaAceptada"
      >
      
      <div>
        <p>No tiene muchos cambios</p>
        <p>😊</p>
      </div>
    </CardTarea>

  </div>
</template>


<style>
/* Contenedor principal del App */
div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* Opcional: título ocupando toda la fila */
h2 {
  grid-column: 1 / -1;
  margin-bottom: 10px;
}
</style>