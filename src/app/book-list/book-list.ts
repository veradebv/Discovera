import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent {
  books = [
    { id: 0, title: 'The Midnight Library', author: 'Matt Haig', rating: 4.2 },
    { id: 1, title: 'Atomic Habits', author: 'James Clear', rating: 4.5 },
    { id: 2, title: 'Norwegian Wood', author: 'Haruki Murakami', rating: 4.0 },
  ];
}