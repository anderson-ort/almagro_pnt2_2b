import { ref } from "vue"

export const useTasks = () => {
    const taskCards = ref([])
    const errorTask = ref(false)
    const isLoadingTasks = ref(false)

    const getTasks = async () => {
        isLoadingTasks.value = true
        try {
            const response = await fetch("/data/mockData.json")

            if (!response.ok) {
                throw new Error
            }
            const data = await response.json()
        
            taskCards.value = await data.tasks

        } catch (e) {
            errorTask.value = true
            console.log({ error: e.message })
        } finally {
            isLoadingTasks.value = false
        }
    }
    return { taskCards, errorTask, isLoadingTasks, getTasks }
}