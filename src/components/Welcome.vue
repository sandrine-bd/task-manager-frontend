<script setup>
import { api } from '@/services/api.js'
import {onMounted, ref} from 'vue'

const title = ref("")

onMounted(async () => {
    try {
        const response = await api.getHello()
        title.value = ref(response.data)
    } catch (e) {
        title.value = "Erreur de chargement";
    }
})

</script>

<template>
    <p id="welcome-page">{{ title }}</p>
</template>

<style scoped></style>
