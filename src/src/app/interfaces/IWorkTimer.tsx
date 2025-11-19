import type { IRemark } from "./IUser";

export interface UploadWorkTimer {
    fileName: string | null | undefined;
    file: File;
    year: string,
    month: string
}

export interface ClonableIconCardProps {
    title: string;
    value: number;
    color: string;
}

export interface RemarksTableProps {
  remarks: IRemark[];
}

export interface HoursBalance {
    hour: number;
    remark: IRemark[]
}

export interface ImportedFile {
    id: string;
    fileName: string;
    createdAt: number;
    year: string;
    month: string;
}