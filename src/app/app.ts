import { Component, signal } from '@angular/core';
import { BookListComponent } from './book-list/book-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Discovera');
}