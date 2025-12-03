export function formatHourToHM(value: number) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue);
  const minutes = Math.round((absValue - hours) * 60);
  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
}

export function fileToBase64(file: File): string | PromiseLike<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export function formatTime(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue / 60);
  const minutes = absValue % 60;
  const formatted = `${hours}h ${minutes}m`;
  return isNegative ? `-${formatted}` : formatted;
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateCreateHhmm = (timestamp: number): string => {
  const date = new Date(timestamp);
  const datePart = date.toLocaleDateString('pt-BR');
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return `${datePart} ${timePart}`;
};

export function formatDateAll(dateString?: string): string {
  if (!dateString || dateString == '0001-01-01T00:00:00') return "—";
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Data Inválida";
    }
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}