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

export interface HoursBalance {
    totalMinutes: number;
    lastUpdated: string;
}