<template>
    <div class="task-manager">
        <h2>Mes tâches</h2>

        <form @submit.prevent="addNewTask">
            <input v-model="newTask" placeholder="Nouvelle tâche" required />
            <button type="submit">Ajouter</button>
        </form>

        <ul v-if="tasks.length">
            <TaskItem
                v-for="task in tasks"
                :key="task.id"
                :task="task"
                @complete="markAsComplete"
                @delete="deleteTask"
            />
        </ul/
        <p v-else>Aucune tâche enregistrée.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TaskItem from './TaskItem.vue';
import { api } from '@/services/api.js';

const tasks = ref([]);
const newTask = ref('');

async function fetchTasks() {
    const response = await api.getTasks();
    tasks.value = response.data;
}

async function addNewTask() {
    if (!newTask.value.trim()) return;
    await api.addTask(newTask.value);
    newTask.value = '';
    await fetchTasks();
}

async function markAsComplete(id) {
    await api.completeTask(id);
    await fetchTasks;
}

async function deleteTask(id) {
    await api.deleteTask(id);
    await fetchTasks();
}

onMounted(fetchTasks);
</script>

<style scoped>
.task-manager {
    max-width: 500px;
    margin: 20px auto;
}
form {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}
ul {
    list-style: none;
    paddding: 0;
}
</style>