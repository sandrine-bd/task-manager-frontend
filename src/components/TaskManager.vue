<template>
  <div>
    <h2>Liste des tâches</h2>

    <!-- Formulaire d'ajout -->
    <div class="add-task">
      <input
        v-model="newTaskDescription"
        placeholder="Nouvelle tâche"
        @keyup.enter="addTask"
      />
      <button @click="addTask">Ajouter</button>
    </div>

    <!-- Liste des tâches -->
    <ul>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @complete="completeTask(task.id)"
        @delete="deleteTask(task.id)"
      />
    </ul>

    <!-- Message si pas de tâches -->
    <p v-if="tasks.length === 0">Aucune tâche pour le moment.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api.js'
import TaskItem from './TaskItem.vue'

export default {
  name: 'TaskManager',
  components: { TaskItem },
  setup() {
    const tasks = ref([])
    const newTaskDescription = ref('')

    // Récupérer toutes les tâches
    const fetchTasks = async () => {
      try {
        const response = await api.getTasks()
        tasks.value = response.data
        console.log('Tâches récupérées :', tasks.value) // <-- vérifie
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error)
      }
    }

    // Ajouter une nouvelle tâche
    const addTask = async () => {
      if (!newTaskDescription.value.trim()) return
      try {
        const response = await api.addTask(newTaskDescription.value)
        tasks.value.push(response.data) // ajoute la nouvelle tâche
        newTaskDescription.value = '' // vide le champ
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error)
      }
    }

    // Marquer une tâche comme terminée
    const completeTask = async (id) => {
      try {
        await api.completeTask(id)
        await fetchTasks() // rafraîchit la liste
      } catch (error) {
        console.error('Erreur lors de la complétion de la tâche :', error)
      }
    }

    // Supprimer une tâche
    const deleteTask = async (id) => {
      try {
        await api.deleteTask(id)
        tasks.value = tasks.value.filter(t => t.id !== id)
        if (task) task.state = 'terminé'
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche :', error)
      }
    }

    onMounted(fetchTasks)

    return { tasks, newTaskDescription, addTask, completeTask, deleteTask }
  }
}
</script>

<style scoped>
.add-task {
  margin-bottom: 1rem;
}
.add-task input {
  padding: 0.5rem;
  width: 200px;
  margin-right: 0.5rem;
}
.add-task button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>
