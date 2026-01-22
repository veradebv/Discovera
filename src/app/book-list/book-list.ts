import { Component } from '@angular/core';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent {
  books = [
    { title: 'The Midnight Library', author: 'Matt Haig', rating: 4.2 },
    { title: 'Atomic Habits', author: 'James Clear', rating: 4.5 },
    { title: 'Norwegian Wood', author: 'Haruki Murakami', rating: 4.0 },
  ];
}