import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {cloudflareWorkerUrl, firebaseConfig} from '@app/config';
import {Observable, timeout} from 'rxjs';
import type {addDoc, collection, Firestore} from 'firebase/firestore';

export interface RequestForm {
  name: string;
  phone: string;
  eventDate: string;
  city: string;
  eventType: string;
  comment: string;
}

interface FirestoreTools {
  db: Firestore;
  addDoc: typeof addDoc;
  collection: typeof collection;
}

let firestoreToolsPromise: Promise<FirestoreTools> | null = null;

function getFirestoreTools(): Promise<FirestoreTools> {
  if (!firestoreToolsPromise) {
    firestoreToolsPromise = Promise.all([import('firebase/app'), import('firebase/firestore')]).then(
      ([appModule, firestoreModule]) => ({
        db: firestoreModule.getFirestore(appModule.initializeApp(firebaseConfig)),
        addDoc: firestoreModule.addDoc,
        collection: firestoreModule.collection,
      })
    );
    firestoreToolsPromise.catch(() => {
      firestoreToolsPromise = null;
    });
  }
  return firestoreToolsPromise;
}

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private http = inject(HttpClient);

  submitForm(data: RequestForm): Observable<string> {
    // Firestore — не блокирует отправку, ошибка не фатальна
    void getFirestoreTools()
      .then(({db, addDoc, collection}) => addDoc(collection(db, 'requests'), {
        ...data,
        createdAt: new Date().toISOString(),
      }))
      .catch(() => {
        console.warn('Firestore save failed (non-critical)');
      });

    // Отправка в Telegram через Worker
    return this.http.post(cloudflareWorkerUrl, data, {
      responseType: 'text',
    }).pipe(
      timeout(10000),
    )
  }
}
