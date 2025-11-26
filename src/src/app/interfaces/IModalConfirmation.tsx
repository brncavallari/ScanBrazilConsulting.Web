export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  subMessage?:string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean; 
}