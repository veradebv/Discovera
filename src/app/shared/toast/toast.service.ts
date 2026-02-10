import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  show(message: string, type: ToastType = 'info', durationMs = 4000): void {
    const toast: ToastMessage = {
      id: this.generateId(),
      message,
      type,
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (isPlatformBrowser(this.platformId)) {
      window.setTimeout(() => this.dismiss(toast.id), durationMs);
    }
  }

  dismiss(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  }
}
