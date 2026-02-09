import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">About Discovera</h1>
      <div class="prose prose-sm">
        <p class="text-gray-700 mb-4">
          Welcome to <strong>Discovera</strong> - Your Personal Book Review Platform
        </p>
        <p class="text-gray-700 mb-4">
          Discovera is a simple, elegant web application that helps you discover, track, and review books.
          Whether you're an avid reader or just starting your reading journey, Discovera makes it easy to:
        </p>
        <ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Discover new books and related titles</li>
          <li>Track your reading progress with status updates (Want to Read, Reading, Read)</li>
          <li>Write and share your personal reviews</li>
          <li>Rate books on a 5-star scale</li>
          <li>Search through your reading list</li>
        </ul>
        <p class="text-gray-700 mb-4">
          Built with <strong>Angular 21</strong> and modern web technologies, Discovera provides a responsive,
          fast, and intuitive experience across all devices.
        </p>
        <p class="text-gray-700">
          Start adding books to your collection today and build your personal reading library!
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
