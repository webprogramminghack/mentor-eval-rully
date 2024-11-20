import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/TaskApi';
import { Button } from './components/Button';
import { Spinner, Trash } from '@phosphor-icons/react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [newTask, setNewTask] = React.useState('');
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Add Task Mutation
  const addTaskMutation = useMutation<any, Error, Omit<Task, 'id'>>(createTask, {
    onMutate: async (newTask:any) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
  
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    queryClient.setQueryData(['tasks'], [...(previousTasks || []), { ...newTask, id: Math.random() }]);

    
    return { previousTasks };
    },
    onError: (err:any, newTask:any, context: any) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  


  // Update Task Mutation
  const updateTaskMutation = useMutation<Task, Error, any>(updateTask, {
    onMutate: async (updatedTask:any) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      console.log('Previous tasks:', previousTasks);
        queryClient.setQueryData(
        ['tasks'],
        previousTasks?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
  
      return { previousTasks };
    },
    onError: (err:any, updatedTask:any, context: any) => {
      console.log('Error updating task:', err);
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks']});
    },
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation<number>(deleteTask, {
    onMutate: async (taskId:any) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData(['tasks'], previousTasks?.filter((task) => task.id !== taskId));
      return { previousTasks };
    },
    onError: (err:any, taskId:any, context: any) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim()) {
      addTaskMutation.mutate({ text: newTask, completed: false });
      setNewTask('');
    }
  };

  const toggleComplete = (task: any) => {
    updateTaskMutation.mutate({ ...task, completed: !task.completed });
  };

  const removeTask = (taskId: any) => {
    deleteTaskMutation.mutate(taskId);
  };

  return (
    <div className="app">
      <h1 className="heading">Let's Get Things Done!</h1>
      <p className="sub-heading">One Step Closer to Your Goals</p>
      <div className="parent-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Create new task"
            value={newTask}
            onChange={handleInputChange}
          />
          <Button color="purple" onClick={addTask}>
            Add
          </Button>
        </div>
        <div className="list-container">
          {isLoading ? (
            <Spinner className="loader" size={24} />
          ) : (
            <ul className="task-list">
              {tasks?.map((task:any) => (
                <li key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                  />
                  <span className={task.completed ? 'completed' : ''}>
                    {task.text}
                  </span>
                  <button onClick={() => removeTask(task.id)}>
                    <Trash size={24} className="fa fa-trash" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
