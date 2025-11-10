export interface ExpenseItem {
    id: string;
    type: string;
    value: number;
}

export interface RefoundPayload {
    expense: ExpenseItem[];
    totalSpent: number;
    advance: number;
    userName: string;
}

export interface ReceiptFile {
    name: string | null | undefined;
    file: File;
    preview: string;
}

export interface Expense {
    id: number;
    type: string;
    value: string;
}