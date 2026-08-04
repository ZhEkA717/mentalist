import {AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnDestroy, signal, TemplateRef, viewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiCalendar} from '@taiga-ui/core/components/calendar';
import {TuiDay, TuiMonth} from '@taiga-ui/cdk/date-time';
import {TuiLoader} from '@taiga-ui/core';
import {TuiNotificationService} from '@taiga-ui/core/components/notification';
import {catchError, EMPTY, finalize} from 'rxjs';
import {TelegramService, RequestForm} from '../../services/telegram.service';
import {SocialsComponent} from '../socials/socials.component';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initRevealOnScroll} from '../../utils/scroll-animations';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ReactiveFormsModule, TuiCalendar, TuiLoader, SocialsComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsSectionComponent implements AfterViewInit, OnDestroy {
  private telegram = inject(TelegramService);
  private readonly notifications = inject(TuiNotificationService);
  private readonly el = inject(ElementRef);

  protected successTpl = viewChild<TemplateRef<unknown>>('successNotification');
  protected errorTpl = viewChild<TemplateRef<unknown>>('errorNotification');
  protected validationTpl = viewChild<TemplateRef<unknown>>('validationNotification');

  protected readonly currentYear = new Date().getFullYear();
  protected submitting = signal(false);
  protected validationMessage = signal('');

  readonly form = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    phone: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    eventDate: new FormControl<TuiDay | null>(null),
    city: new FormControl('', {nonNullable: true}),
    eventType: new FormControl('', {nonNullable: true}),
    comment: new FormControl('', {nonNullable: true}),
  });

  protected calendarOpen = false;
  protected calendarMonth = new TuiMonth(new Date().getFullYear(), new Date().getMonth());

  ngAfterViewInit(): void {
    initRevealOnScroll(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
  }

  protected toggleCalendar(): void {
    this.calendarOpen = !this.calendarOpen;
    if (this.calendarOpen) {
      const date = this.form.get('eventDate')?.value;
      if (date) {
        this.calendarMonth = new TuiMonth(date.year, date.month);
      }
    }
  }

  protected closeCalendar(): void {
    this.calendarOpen = false;
  }

  protected onDayClick(day: TuiDay): void {
    this.form.get('eventDate')?.setValue(day);
    this.calendarOpen = false;
  }

  protected formatDate(day: TuiDay | null): string {
    if (!day) return '';
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];
    return `${day.day} ${months[day.month]} ${day.year}`;
  }

  protected onSubmit(): void {
    if (this.submitting()) return;

    if (this.form.invalid) {
      const missing: string[] = [];
      if (this.form.get('name')?.hasError('required')) missing.push('Имя');
      if (this.form.get('phone')?.hasError('required')) missing.push('Телефон или Telegram');

      this.validationMessage.set(`Пожалуйста, заполните: ${missing.join(', ')}`);
      this.notifications.open(this.validationTpl(), {
        autoClose: 6000,
        block: 'start',
        inline: 'end',
        closable: true,
        icon: '',
      }).subscribe();
      return;
    }

    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const data: RequestForm = {
      name: raw.name,
      phone: raw.phone,
      eventDate: raw.eventDate ? this.formatDate(raw.eventDate) : '',
      city: raw.city,
      eventType: raw.eventType,
      comment: raw.comment,
    };

    this.telegram.submitForm(data)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
        catchError(() => {
          this.notifications.open(this.errorTpl(), {
            autoClose: 7000,
            block: 'start',
            inline: 'end',
            closable: false,
            icon: '',
          }).subscribe();
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.form.reset();
        this.notifications.open(this.successTpl(), {
          autoClose: 5000,
          block: 'start',
          inline: 'end',
          closable: false,
          icon: '',
        }).subscribe();
      });
  }
}
