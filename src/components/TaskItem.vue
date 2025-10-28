<template>
  <li class="task-item">
    <span :class="{ done: task.state === 'terminé' }" :style="{ textDecoration: task.state === 'terminé' ? 'line-through' : 'none' }">
      {{ task.description }} ({{ task.state }})
    </span>
    <button @click="$emit('complete')" :disabled="task.state === 'terminé'">Terminer</button>
    <button @click="$emit('delete')">Supprimer</button>
  </li>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.task-item {
  margin-bottom: 0.5rem;
}
.task-item button {
  margin-left: 0.5rem;
  cursor: pointer;
}
.done {
  text-decoration: line-through;
  color: gray;
}
</style>
