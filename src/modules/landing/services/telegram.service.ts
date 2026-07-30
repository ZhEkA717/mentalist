import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {initializeApp} from 'firebase/app';
import {addDoc, collection, getFirestore} from 'firebase/firestore';
import {cloudflareWorkerUrl, firebaseConfig} from '../../../app/config';
import {delay, Observable, timeout} from 'rxjs';

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
  private http = inject(HttpClient);

  submitForm(data: RequestForm): Observable<string> {
    // Firestore — не блокирует отправку, ошибка не фатальна
    addDoc(collection(this.db, 'requests'), {
      ...data,
      createdAt: new Date().toISOString(),
    }).catch(() => {
      console.warn('Firestore save failed (non-critical)');
    });

    // Отправка в Telegram через Worker + минимум 1 секунда ожидания
    return this.http.post(cloudflareWorkerUrl, data, {
      responseType: 'text',
    }).pipe(
      timeout(10000),
      delay(300),
    )
  }
}
