<script setup>

    const props = defineProps({
        header: {type:String,required:true},
        precio: {type:Number, default:0}
    })


    const emit = defineEmits(
        ['clickPadre', 'clickAlert']
    )


    const handleClickAlert = () =>{
        emit('clickPadre', {precio:props.precio, nombre:"hijo"})
        emit('clickAlert', {header:props.header})
    }


</script>
<template>
    <div>
        <h1>{{header}}</h1>
        <p> {{precio}} </p>
        <button @click="handleClickAlert" >Hol soy un btn</button>
        <hr/>
        <slot />
    </div>

</template>