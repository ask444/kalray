
import './Home.sass';



/*
    Setup:
        - Calling "yarn install" & "yarn start" should run this simple project.

    Task:

        - Show a list of things to be done on a table. Also, allow add, update, and delete operations on the list.
        - Use appService for retrieving the todo list from the server. The implementation of getToDoList function should not be touched.

    Responsibilities:

        1- Display: Show tasks to be done on the table.

        2- Sorting by column: Allow the user to click a button on the table header and order the rows in ascending or descending order by a particular column.

        3- Pagination: There could be many rows, paginate the results and provide a way to see all the pages. There can be a maximum of 10 tasks on each page.

        4- Filtering: Have an input box on top of the table to filter the rows by the content in a case-insensitive manner.

        5- Adding a new task: Have an input box and a button to add a new task to do. Initially, the task should have done_time = null. Each task should have a distinct ID.

        6- Marking a task as done: Allow the user to mark tasks as done. When a task is marked as done, change the text styling to strikethrough. Set the current time as done_time for that task.

        7- Marking a task as undone: Allow the user to mark the task as undone. When a task is undone, change the text styling back to normal and set done_time = null.

        8- Updating the task content: Allow the user to update task content with a button similar to the done/undone toggle above. The user should be able to change the content.

        9- Deleting a task: Allow the user to delete a task row on the table. This could be done via a button.

        10- Styling: Style the table, buttons, and controls as you wish to make it attractive enough. Do not worry about responsiveness.

    Bonus tasks:

        1- Adding/updating a new item: Instead of an input element and a button at the bottom of the table, manage the form inside a modal.

        2- Unit tests: Write unit tests to test the rendering process of the components.

        3- Typescript usage: Define TypeScript interfaces whenever necessary. All functions and arguments should be typed.
*/

import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Todo, SortOptions, Pagination, ModalState } from '../../todoTypes';
import appService from '../../services/appService';
import { AppContext } from '../../context/AppContext';
import './Home.css';
import TopBar from '../topbar/TopBar';

// Utility function to format date
const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

// Modal Component
const Modal: React.FC<{
    isOpen: boolean;
    content: string;
    onClose: () => void;
    onSave: (content: string) => void;
    onUpdate: (content: string) => void;
    isEditing: boolean;
}> = ({ isOpen, content, onClose, onSave, onUpdate, isEditing }) => {
    const [taskContent, setTaskContent] = useState(content);

    useEffect(() => {
        setTaskContent(content); // Set initial value when modal is opened
    }, [content]);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{isEditing ? 'Edit Task' : 'Add Task'}</h2>
                <input
                    type="text"
                    value={taskContent}
                    onChange={(e) => setTaskContent(e.target.value)}
                    placeholder="Task content"
                />
                <div className="modal-buttons">
                    <button onClick={() => isEditing ? onUpdate(taskContent) : onSave(taskContent)}>
                        {isEditing ? 'Update' : 'Save'}
                    </button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const Home: React.FC = () => {
    const { leftBarShown, onToggleLeftBarShown } = useContext(AppContext);

    const [todos, setTodos] = useState<Todo[]>([]);
    const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);
    const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'id', order: 'asc' });
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1 });
    const [filter, setFilter] = useState<string>('');
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [modalContent, setModalContent] = useState<string>('');
    const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [infiniteScroll, setInfiniteScroll] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'Tasks to do';

        if (!leftBarShown) {
            onToggleLeftBarShown(true);
        }
    }, [leftBarShown, onToggleLeftBarShown]);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await appService.getToDoList();
            setTodos(response.data);
            setPagination(prev => ({ ...prev, totalPages: Math.ceil(response.data.length / 10) }));
            if (infiniteScroll) {
                // Infinite scroll handling
                setDisplayedTodos(response.data.slice(0, 10));
            } else {
                // Pagination handling
                setDisplayedTodos(response.data.slice(0, 10)); // Load initial data
            }
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        } finally {
            setLoading(false);
        }
    }, [infiniteScroll]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    useEffect(() => {
        const filtered = todos.filter(todo => todo.content.toLowerCase().includes(filter.toLowerCase()));
        const start = (pagination.currentPage - 1) * 10;
        const end = start + 10;
        setDisplayedTodos(filtered.slice(start, end));
        setPagination(prev => ({ ...prev, totalPages: Math.ceil(filtered.length / 10) }));
    }, [filter, todos, pagination.currentPage]);

    useEffect(() => {
        if (infiniteScroll && loaderRef.current) {
            const handleScroll = () => {
                if (loaderRef.current) {
                    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
                    if (scrollTop + clientHeight >= scrollHeight - 5) {
                        handleLoadMore();
                    }
                }
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [infiniteScroll, todos]);

    const handleSort = (field: keyof Todo) => {
        setSortOptions(prev => ({
            field,
            order: prev.order === 'asc' ? 'desc' : 'asc',
        }));
    };

    useEffect(() => {
        const sorted = [...todos].sort((a, b) => {
            const aField = a[sortOptions.field];
            const bField = b[sortOptions.field];

            if (aField == null && bField == null) return 0;
            if (aField == null) return sortOptions.order === 'asc' ? 1 : -1;
            if (bField == null) return sortOptions.order === 'asc' ? -1 : 1;

            if (aField > bField) return sortOptions.order === 'asc' ? 1 : -1;
            if (aField < bField) return sortOptions.order === 'asc' ? -1 : 1;
            return 0;
        });
        setTodos(sorted);
    }, [sortOptions]);

    const handleAddTask = (content: string) => {
        const newTask: Todo = {
            id: Math.max(...todos.map(todo => todo.id), 0) + 1,
            content,
            done: false,
            done_time: null,
        };

        // Simulate a service call
        setTodos(prev => [...prev, newTask]);
        setDisplayedTodos(prev => [...prev, newTask]);
        setModalState({ isOpen: false });
        setCurrentTodo(null);
    };

    const handleUpdateTask = (updatedContent: string) => {
        if (!currentTodo) return;

        const updatedTodo = { ...currentTodo, content: updatedContent };

        // Simulate a service call
        setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
        setDisplayedTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
        setModalState({ isOpen: false });
        setCurrentTodo(null);
    };

    const handleDeleteTask = (id: number) => {
        // Simulate a service call
        setTodos(todos.filter(todo => todo.id !== id));
        setDisplayedTodos(todos.filter(todo => todo.id !== id));
    };

    const handleMarkDone = (id: number) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, done: true, done_time: new Date().toISOString() } : todo
        );
        setTodos(updatedTodos);
        setDisplayedTodos(updatedTodos);
    };

    const handleMarkUndone = (id: number) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, done: false, done_time: null } : todo
        );
        setTodos(updatedTodos);
        setDisplayedTodos(updatedTodos);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > pagination.totalPages) return;
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleToggleModal = (todo?: Todo) => {
        if (todo) {
            setModalContent(todo.content);
            setCurrentTodo(todo);
            setModalState({ isOpen: true });
        } else {
            setModalContent('');
            setCurrentTodo(null);
            setModalState({ isOpen: true });
        }
    };

    const handleSaveTask = (content: string) => {
        if (currentTodo) {
            handleUpdateTask(content);
        } else {
            handleAddTask(content);
        }
    };

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages) {
            const nextPage = pagination.currentPage + 1;
            setPagination(prev => ({ ...prev, currentPage: nextPage }));
            setDisplayedTodos(todos.slice(0, nextPage * 10));
        }
    };

    return (
        <div>
            <TopBar label="Tasks to do" />

            <div className="home">
                <div className="home-content">
                    <input
                        type="text"
                        placeholder="Filter tasks..."
                        value={filter}
                        onChange={handleFilterChange}
                    />

                    <button onClick={() => handleToggleModal()}>Add Task</button>
                    <button onClick={() => setInfiniteScroll(prev => !prev)}>
                        Toggle {infiniteScroll ? 'Pagination' : 'Infinite Scroll'}
                    </button>

                    <table className="todo-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>ID</th>
                                <th onClick={() => handleSort('content')}>Content</th>
                                <th onClick={() => handleSort('done')}>Done</th>
                                <th onClick={() => handleSort('done_time')}>Done Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5}>Loading...</td>
                                </tr>
                            ) : displayedTodos.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>No tasks found</td>
                                </tr>
                            ) : (
                                displayedTodos.map(todo => (
                                    <tr key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                                        <td>{todo.id}</td>
                                        <td>{todo.content}</td>
                                        <td>{todo.done ? 'Yes' : 'No'}</td>
                                        <td>{formatDate(todo.done_time)}</td>
                                        <td>
                                            <button onClick={() => handleToggleModal(todo)}>Edit</button>
                                            <button onClick={() => handleMarkDone(todo.id)} disabled={todo.done}>Mark Done</button>
                                            <button onClick={() => handleMarkUndone(todo.id)} disabled={!todo.done}>Mark Undone</button>
                                            <button onClick={() => handleDeleteTask(todo.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {!infiniteScroll && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>{pagination.currentPage} of {pagination.totalPages}</span>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {infiniteScroll && <div ref={loaderRef} style={{ height: '20px', background: '#f0f0f0' }}></div>}
                </div>

                <Modal
                    isOpen={modalState.isOpen}
                    content={modalContent}
                    onClose={() => setModalState({ isOpen: false })}
                    onSave={handleSaveTask}
                    onUpdate={handleUpdateTask}
                    isEditing={!!currentTodo}
                />
            </div>
        </div>
    );
};

export default Home;
