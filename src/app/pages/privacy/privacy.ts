import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div class="prose prose-sm space-y-4">
        <h2 class="text-xl font-bold">Information we collect</h2>
        <p class="text-gray-700">
          Readly stores your book preferences and reviews locally in your browser's storage.
          We do not collect personal information beyond what you explicitly provide.
        </p>

        <h2 class="text-xl font-bold">Data Storage</h2>
        <p class="text-gray-700">
          All your book data and reviews are stored locally on your device.
          We do not send this data to external servers.
        </p>

        <h2 class="text-xl font-bold">Third-party services</h2>
        <p class="text-gray-700">
          Discovera currently does not use third-party analytics or tracking services.
        </p>

        <h2 class="text-xl font-bold">Contact</h2>
        <p class="text-gray-700">
          If you have questions about this privacy policy, please contact us through the information
          provided on our website.
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {}
