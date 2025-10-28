import axios from 'axios'

const apiClient = axios.create({
    baseURL: '/tasks', // Le proxy redirige vers http://localhost:8080/tasks
    headers: {
        'Content-Type': 'application/json',
    },
})

// Ajouter un intercepteur pour logger les requêtes
apiClient.interceptors.request.use((request) => {
    console.log('Starting Request', request)
    return request
})

export const api = {
    getHello() {
        return apiClient.get(`/hello`)
    },
    getTasks() {
        return apiClient.get(API_URL)
    },
    addTask(description) {
        return apiClient.post(API_URL, {description})
    },
    completeTask(id) {
        return apiClient.put(`${API_URL}/${id}/complete`)
    },
    deleteTask(id) {
        return apiClient.delete(`${API_URL}/${id}`)
    }
}
