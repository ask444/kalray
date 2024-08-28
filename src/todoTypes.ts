// src/types.ts

export interface Todo {
    id: number;
    content: string;
    done: boolean;
    done_time: string | null;
}

export interface SortOptions {
    field: keyof Todo;
    order: 'asc' | 'desc';
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
}

export interface ModalState {
    isOpen: boolean;
    todo?: Todo;
    content?: string; // Add this property if you need it
}

