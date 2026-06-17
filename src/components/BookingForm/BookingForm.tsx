'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import type { BookingFormData } from '@/types/booking';
import {
  BOOKING_TIME_SLOTS,
  getBookingDateRange,
  normalizePhoneForStorage,
  validateDate,
  validateGuests,
  validateName,
  validatePhone,
  validateTime,
} from '@/utils/validation';

import styles from './BookingForm.module.scss';

interface BookingFormProps {
  onSuccess: (booking: BookingFormData) => void;
}

interface FieldErrorProps {
  id: string;
  message?: string;
}

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className={styles.error} id={id} role="alert">
      {message}
    </p>
  );
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const dateRange = useMemo(() => getBookingDateRange(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await wait(1500);

    onSuccess({
      ...data,
      name: data.name.trim().replace(/\s+/g, ' '),
      phone: normalizePhoneForStorage(data.phone),
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <p className={styles.step}>Шаг 1 из 1</p>
        <h2>Забронировать столик</h2>
        <p>Все поля обязательны. Подтверждение появится сразу после отправки.</p>
      </div>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="name">Имя гостя</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Анна"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={errors.name ? styles.inputError : undefined}
            {...register('name', {
              validate: (value) => validateName(value) ?? true,
            })}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Номер телефона</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (999) 123-45-67"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={errors.phone ? styles.inputError : undefined}
            {...register('phone', {
              validate: (value) => validatePhone(value) ?? true,
            })}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="date">Дата</label>
            <input
              id="date"
              type="date"
              min={dateRange.min}
              max={dateRange.max}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? 'date-error' : undefined}
              className={errors.date ? styles.inputError : undefined}
              {...register('date', {
                validate: (value) => validateDate(value) ?? true,
              })}
            />
            <FieldError id="date-error" message={errors.date?.message} />
          </div>

          <div className={styles.field}>
            <label htmlFor="time">Время</label>
            <select
              id="time"
              aria-invalid={Boolean(errors.time)}
              aria-describedby={errors.time ? 'time-error' : undefined}
              className={errors.time ? styles.inputError : undefined}
              {...register('time', {
                validate: (value) => validateTime(value) ?? true,
              })}
            >
              <option value="">Выберите</option>
              {BOOKING_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <FieldError id="time-error" message={errors.time?.message} />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="guests">Количество гостей</label>
          <select
            id="guests"
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? 'guests-error' : undefined}
            className={errors.guests ? styles.inputError : undefined}
            {...register('guests', {
              setValueAs: (value: string) => Number(value),
              validate: (value) => validateGuests(value) ?? true,
            })}
          >
            <option value="0">Выберите</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
          <FieldError id="guests-error" message={errors.guests?.message} />
        </div>

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Бронирую...
            </>
          ) : (
            'Забронировать столик'
          )}
        </button>
      </form>
    </div>
  );
}
