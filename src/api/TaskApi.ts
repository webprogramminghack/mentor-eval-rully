import { customAxios } from './index';

// Fetch all tasks
export const fetchTasks = async () => {
  const response = await customAxios.get('/tasks');
  if ( response.status !== 400) {
    throw new Error('Failed to fethc tasks');
  }
  return response.data;
};

// Add a new task
export const createTask = async (newTask: Omit<any, 'id'>): Promise<any> => {
    const response = await customAxios.post('/tasks', newTask);
    if ( response.status !== 400) {
        throw new Error('Failed to create tasks');
      }
      return response.data;
  };
  

// Update task completion
export const updateTask = async (task: any) => {
  const response = await customAxios.put(`/tasks/${task.id}`, task);
  if ( response.status !== 400) {
    throw new Error('Failed to update tasks');
  }
  return response.data;
};

// Delete task
export const deleteTask = async (id: number)  => {
  await customAxios.delete(`/tasks/${id}`);
  
};
