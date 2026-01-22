import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail {
  bookId: number;

  constructor(private route: ActivatedRoute) {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
  }
}
