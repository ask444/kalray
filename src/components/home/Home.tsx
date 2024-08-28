
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

import React, { useState, useEffect, useContext, useRef } from 'react';
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

const Home: React.FC = () => {
    const { leftBarShown, onToggleLeftBarShown } = useContext(AppContext);

    const [todos, setTodos] = useState<Todo[]>([]);
    const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);
    const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'id', order: 'asc' });
    const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1 });
    const [filter, setFilter] = useState<string>('');
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [isInfiniteScroll, setIsInfiniteScroll] = useState<boolean>(false); // State for scroll mode

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.title = 'Tasks to do';

        if (!leftBarShown) {
            onToggleLeftBarShown(true);
        }
        // eslint-disable-next-line
    }, [leftBarShown, onToggleLeftBarShown]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await appService.getToDoList();
                setTodos(response.data);
                setPagination(prev => ({ ...prev, totalPages: Math.ceil(response.data.length / 10) }));
                setDisplayedTodos(response.data.slice(0, 10)); // Load initial data
            } catch (error) {
                console.error('Failed to fetch todos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    useEffect(() => {
        if (isInfiniteScroll) {
            const handleScroll = () => {
                if (loaderRef.current) {
                    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
                    if (scrollHeight - scrollTop <= clientHeight + 100) {
                        fetchMoreTodos();
                    }
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isInfiniteScroll, displayedTodos]);

    const fetchMoreTodos = () => {
        if (!isInfiniteScroll) return;

        setLoading(true);
        const nextPage = Math.ceil(displayedTodos.length / 10) + 1;
        if (nextPage <= pagination.totalPages) {
            const start = (nextPage - 1) * 10;
            const end = start + 10;
            setDisplayedTodos(prev => [...prev, ...todos.slice(start, end)]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!isInfiniteScroll) {
            const start = (pagination.currentPage - 1) * 10;
            const end = start + 10;
            setDisplayedTodos(todos.slice(start, end));
        }
    }, [pagination.currentPage, todos, isInfiniteScroll]);

    useEffect(() => {
        if (!isInfiniteScroll) {
            const filtered = todos.filter(todo => todo.content.toLowerCase().includes(filter.toLowerCase()));
            setPagination(prev => ({ ...prev, totalPages: Math.ceil(filtered.length / 10) }));
            const start = (pagination.currentPage - 1) * 10;
            const end = start + 10;
            setDisplayedTodos(filtered.slice(start, end));
        }
    }, [filter, todos, pagination.currentPage, isInfiniteScroll]);

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

    const handleAddTask = async (content: string) => {
        const newTask: Todo = {
            id: Math.max(...todos.map(todo => todo.id), 0) + 1,
            content,
            done: false,
            done_time: null,
        };

        setTodos([...todos, newTask]);
        setFilter(filter); // Trigger filtering to apply changes
        setModalState({ isOpen: false });
    };

    const handleUpdateTask = async (updatedTodo: Todo) => {
        const updatedTodos = todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
        setTodos(updatedTodos);
        setFilter(filter); // Trigger filtering to apply changes
        setModalState({ isOpen: false });
    };

    const handleDeleteTask = (id: number) => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        setFilter(filter); // Trigger filtering to apply changes
    };

    const handleMarkDone = (id: number) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, done: true, done_time: new Date().toISOString() } : todo
        );
        setTodos(updatedTodos);
        setFilter(filter); // Trigger filtering to apply changes
    };

    const handleMarkUndone = (id: number) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, done: false, done_time: null } : todo
        );
        setTodos(updatedTodos);
        setFilter(filter); // Trigger filtering to apply changes
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > pagination.totalPages) return;
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleToggleModal = (todo?: Todo) => {
        setModalState({ isOpen: !modalState.isOpen, todo });
    };

    const handleToggleMode = () => {
        setIsInfiniteScroll(prev => !prev);
        if (!isInfiniteScroll) {
            setPagination({ currentPage: 1, totalPages: 1 });
            setDisplayedTodos(todos.slice(0, 10));
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

                    <button onClick={handleToggleMode}>
                        {isInfiniteScroll ? 'Switch to Pagination' : 'Switch to Infinite Scroll'}
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
                                    <td colSpan={5} className="loader">Loading...</td>
                                </tr>
                            ) : (
                                displayedTodos.map(todo => (
                                    <tr key={todo.id} className={todo.done ? 'strikethrough' : ''}>
                                        <td>{todo.id}</td>
                                        <td>{todo.content}</td>
                                        <td>{todo.done ? 'Yes' : 'No'}</td>
                                        <td>{formatDate(todo.done_time)}</td>
                                        <td>
                                            <button onClick={() => handleMarkDone(todo.id)}>Mark Done</button>
                                            <button onClick={() => handleMarkUndone(todo.id)}>Mark Undone</button>
                                            <button onClick={() => handleUpdateTask(todo)}>Edit</button>
                                            <button onClick={() => handleDeleteTask(todo.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {!isInfiniteScroll && (
                        <div className="pagination">
                            <button disabled={pagination.currentPage === 1} onClick={() => handlePageChange(pagination.currentPage - 1)}>Previous</button>
                            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                            <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => handlePageChange(pagination.currentPage + 1)}>Next</button>
                        </div>
                    )}

                    {isInfiniteScroll && <div ref={loaderRef} className="loader">Loading more...</div>}
                </div>
            </div>
        </div>
    );
};

export default Home;

