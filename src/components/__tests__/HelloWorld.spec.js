import { describe, it, expect, vi } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import HelloWorld from '../Welcome.vue'
import { api } from '@/services/api.js'

vi.mock('@/services/api.js', () => ({
    /* simule le module api.js, ce qui évite les vrais appels HTTP */
    api: {
        getHello: vi.fn(),
    },
}))

describe('HelloWorld', () => {
    it('renders properly', async () => {
        const welcomeMessage = 'Welcome to the Task Manager API!'
        api.getHello.mockResolvedValue({ data: welcomeMessage }) /* simule une réponse API */

        const wrapper =
            mount(HelloWorld) /* monte le composant HelloWorld.vue pour le tester seul */
        await flushPromises() /* synchronisation avec les Promises, nécessaire car on appelle l'API dans onMounted() */
        expect(wrapper.text()).toContain(welcomeMessage) /* vérifie le rendu */
    })
})
