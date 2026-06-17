'use client';

import { useState } from 'react';

import { BookingForm } from '@/components/BookingForm/BookingForm';
import { ConfirmationScreen } from '@/components/ConfirmationScreen/ConfirmationScreen';
import type { BookingFormData } from '@/types/booking';

import styles from './BookingPage.module.scss';

export function BookingPage() {
  const [booking, setBooking] = useState<BookingFormData | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.logoMark} aria-hidden="true">
            S
          </span>
          <span className={styles.logoText}>SAVEUR</span>
        </header>

        <section className={styles.layout} aria-label="Бронирование столика">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Онлайн-бронирование</p>
            <h1>Столик для особенного вечера</h1>
            <p className={styles.lead}>
              Выберите удобные дату и время — мы подготовим всё к вашему приходу.
            </p>

            <div className={styles.details}>
              <div>
                <span>Часы бронирования</span>
                <strong>12:00–22:00</strong>
              </div>
              <div>
                <span>Размер компании</span>
                <strong>До 12 гостей</strong>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            {booking ? (
              <ConfirmationScreen booking={booking} onReset={() => setBooking(null)} />
            ) : (
              <BookingForm onSuccess={setBooking} />
            )}
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Москва, Большая Никитская, 12</span>
          <span>+7 (495) 000-00-00</span>
        </footer>
      </div>
    </main>
  );
}
