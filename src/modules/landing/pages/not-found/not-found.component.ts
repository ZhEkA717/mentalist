import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="not-found">
      <div class="not-found__content">
        <div class="not-found__code">404</div>
        <h1 class="not-found__title">Страница не найдена</h1>
        <p class="not-found__text">Возможно, ссылка устарела или была введена с ошибкой. Вернитесь на главную страницу.</p>
        <a class="not-found__link" routerLink="/">На главную</a>
      </div>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: #0a0a0a;
    }

    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      font-family: Montserrat, sans-serif;
    }

    .not-found__content {
      max-width: 560px;
    }

    .not-found__code {
      font-size: clamp(72px, 18vw, 140px);
      font-weight: 700;
      line-height: 1;
      background: linear-gradient(90deg, #80724C -17.31%, #E6CC89 93.14%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .not-found__title {
      font-size: clamp(20px, 4vw, 28px);
      font-weight: 600;
      margin: 20px 0 12px;
      color: #DFC784;
    }

    .not-found__text {
      font-size: 15px;
      font-weight: 300;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 32px;
    }

    .not-found__link {
      display: inline-block;
      padding: 14px 36px;
      color: #DFC784;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: 1px solid rgba(223, 199, 132, 0.4);
      border-radius: 4px;
      transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    }

    .not-found__link:hover {
      color: #0a0a0a;
      background: #DFC784;
      border-color: #DFC784;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Страница не найдена — Александр Шишук');
  }
}
