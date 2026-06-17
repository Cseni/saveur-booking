'use client';

import { useEffect, useRef } from 'react';

import type { BookingFormData } from '@/types/booking';

import styles from './ConfirmationScreen.module.scss';

interface ConfirmationScreenProps {
  booking: BookingFormData;
  onReset: () => void;
}

function formatBookingDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getGuestsLabel(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} гостей`;
  }

  if (lastDigit === 1) {
    return `${count} гость`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} гостя`;
  }

  return `${count} гостей`;
}

export function ConfirmationScreen({ booking, onReset }: ConfirmationScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className={styles.container} aria-labelledby="confirmation-title">
      <div className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img">
          <path d="m6.7 12.4 3.2 3.2 7.4-7.4" />
        </svg>
      </div>

      <p className={styles.eyebrow}>Бронирование подтверждено</p>
      <h2 id="confirmation-title" ref={headingRef} tabIndex={-1}>
        До встречи, {booking.name}!
      </h2>
      <p className={styles.description}>
        Мы зарезервировали столик и будем ждать вас в выбранное время.
      </p>

      <dl className={styles.summary}>
        <div>
          <dt>Дата</dt>
          <dd>{formatBookingDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{booking.time}</dd>
        </div>
        <div>
          <dt>Гости</dt>
          <dd>{getGuestsLabel(booking.guests)}</dd>
        </div>
      </dl>

      <button className={styles.reset} type="button" onClick={onReset}>
        Забронировать ещё
      </button>
    </section>
  );
}
