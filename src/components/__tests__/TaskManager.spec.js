import { mount, flushPromises } from '@vue/test-utils'
import TaskManager from '../TaskManager.vue'
import {api} from "@/services/api.js";
import { describe, it, expect, vi } from 'vitest'

// Mock de l'API
vi.mock('@/services/api.js', () => ({
    api: {
        getTasks: vi.fn(),
        addTask: vi.fn(),
        completeTask: vi.fn(),
        deleteTask: vi.fn(),
    }
}))

describe('TaskManager.vue - Cas nominaux', () => {

    it("affiche la liste des tâches récupérées depuis l'API", async () => {
        const tasks = [
            { id: '1', description: 'Faire les courses', state: 'en cours' },
            { id: '2', description: 'Réviser', state: 'en cours' },
            { id: '3', description: 'Faire du sport', state: 'en cours' }
        ]
        api.getTasks.mockResolvedValue({ data: tasks })

        const wrapper = mount(TaskManager)
        await flushPromises()

        expect(wrapper.text()).toContain('Faire les courses')
        expect(wrapper.text()).toContain('Réviser')
        expect(wrapper.text()).toContain('Faire du sport')
    })

    it("ajoute une nouvelle tâche et l'affiche", async () => {
        const newTask = { id: '4', description: 'Faire le ménage', state: 'en cours' }
        api.addTask.mockResolvedValue({ data: newTask })
        api.getTasks.mockResolvedValue({ data: [newTask] }) // après ajout

        const wrapper = mount(TaskManager)

        // simule la saisie dans le champ input
        const input = wrapper.find('input')
        await input.setValue('Faire le ménage')

        // clique sur le bouton Ajouter
        const addButton = wrapper.find('button.add-task')
        await addButton.trigger('click')

        await flushPromises()

        expect(wrapper.text()).toContain('Faire le ménage')
        expect(api.addTask).toHaveBeenCalledWith('Faire le ménage')
    })

    it("complète une tâche et appelle l'API correspondante", async () => {
        api.completeTask.mockResolvedValue({})
        const task = { id: '1', description: 'Faire les courses', statut: 'en cours' }

        const wrapper = mount(TaskManager, {
            data() { return { tasks: [task] } }
        })

        // clique sur le bouton Terminer
        const completeButton = wrapper.find('button.complete-task')
        await completeButton.trigger('click')
        await flushPromises()

        expect(api.completeTask).toHaveBeenCalledWith('1')
    })

    it("supprimer une tâche et appelle l'API correspondante", async () => {
        api.deleteTask.mockResolvedValue({})
        const task = { id: '2', description: 'Réviser', state: 'en cours' }

        const wrapper = mount(TaskManager, {
            data() { return { tasks: [task] } }
        })

        // clique sur le bouton Supprimer
        const deleteButton = wrapper.find('button.delete-task')
        await deleteButton.trigger('click')
        await flushPromises()

        expect(api.deleteTask).toHaveBeenCalledWith('2')
    })
})