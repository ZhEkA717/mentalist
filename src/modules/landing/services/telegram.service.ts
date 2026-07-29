import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig, cloudflareWorkerUrl } from '../../../app/config';

export interface RequestForm {
  name: string;
  phone: string;
  eventDate: string;
  city: string;
  eventType: string;
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private app = initializeApp(firebaseConfig);
  private db = getFirestore(this.app);

  async submitForm(data: RequestForm): Promise<void> {
    // Firestore — не блокирует отправку, ошибка не фатальна
    addDoc(collection(this.db, 'requests'), {
      ...data,
      createdAt: new Date().toISOString(),
    }).catch(() => {
      console.warn('Firestore save failed (non-critical)');
    });

    // Отправка в Telegram через Worker
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(cloudflareWorkerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки в Telegram');
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
