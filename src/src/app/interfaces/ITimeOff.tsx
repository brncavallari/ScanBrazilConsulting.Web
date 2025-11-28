export interface ITimeOffData {
  hour: string;
  startDate: Date;
  endDate: Date;
  userEmail: string;
  remark: string;
}

export interface ITimeOff {
  hour: number;
  startDate: number;
  endDate: number;
  userEmail: string;
  protocol: string;
  remark: string;
  status: number;
  createdAt: number;
  approver: string;
  description: string;
}


export interface TimeOffDetailModalProps {
  timeOff: ITimeOff | null;
  isOpen: boolean;
  onClose: () => void;
}
