<template>
    <li class="task-item">
        <span :class="{ done: task.state === 'terminé' }">{{ task.description }}</span>
        <div>
            <button v-if="task.state !== 'terminé'" @click="$emit('complete', task.id)">Terminer</button>
            <button @click="$emit('delete', task.id)">Supprimer</button>
        </div>
    </li>
</template>

<script setup>
defineProps({ task: Object });
</script>

<style scoped>
.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 6px 0;
}
.done {
    text-decoration: line-through;
    color: gray;
}
</style>