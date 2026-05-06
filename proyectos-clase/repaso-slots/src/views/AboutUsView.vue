<script setup>
import {useRoute} from 'vue-router'
import {ref} from 'vue'
 
const route = useRoute()

const userEmail = ref('')

userEmail.value = route.params.email

</script>

<template>
    HOLA, {{userEmail}}. SOY UNA VIEW DE ABOUT US
</template>