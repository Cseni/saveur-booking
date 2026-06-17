const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё\s-]+$/u;

export const BOOKING_TIME_SLOTS = Array.from(
  { length: 11 },
  (_, index) => `${String(index + 12).padStart(2, '0')}:00`,
);

export function validateName(value: string): string | null {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 'Введите имя гостя';
  }

  if (normalizedValue.length < 2) {
    return 'Имя должно содержать минимум 2 символа';
  }

  if (!NAME_PATTERN.test(normalizedValue)) {
    return 'Используйте только буквы, пробелы и дефис';
  }

  return null;
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizePhoneForStorage(value: string): string {
  const digits = normalizePhone(value);

  if (digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.startsWith('7')) {
    return `+${digits}`;
  }

  return value.trim();
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) {
    return 'Введите номер телефона';
  }

  const digits = normalizePhone(value);

  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) {
    return null;
  }

  return 'Введите корректный номер: +7 или 8, затем 10 цифр';
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return null;
  }

  return startOfLocalDay(parsedDate);
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getBookingDateRange(now: Date = new Date()): {
  min: string;
  max: string;
} {
  const today = startOfLocalDay(now);

  return {
    min: toDateInputValue(today),
    max: toDateInputValue(addDays(today, 90)),
  };
}

export function validateDate(value: string, now: Date = new Date()): string | null {
  if (!value) {
    return 'Выберите дату';
  }

  const selectedDate = parseDateInput(value);

  if (!selectedDate) {
    return 'Введите корректную дату';
  }

  const today = startOfLocalDay(now);
  const lastAvailableDate = addDays(today, 90);

  if (selectedDate < today) {
    return 'Дата не может быть раньше сегодняшнего дня';
  }

  if (selectedDate > lastAvailableDate) {
    return 'Бронирование доступно максимум на 90 дней вперёд';
  }

  return null;
}

export function validateTime(value: string): string | null {
  if (!value) {
    return 'Выберите время';
  }

  if (!BOOKING_TIME_SLOTS.includes(value)) {
    return 'Выберите время с 12:00 до 22:00';
  }

  return null;
}

export function validateGuests(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 12) {
    return 'Выберите количество гостей от 1 до 12';
  }

  return null;
}
