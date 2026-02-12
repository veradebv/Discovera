import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">Terms of Service</h1>
      <div class="prose prose-sm space-y-4">
        <h2 class="text-xl font-bold">1. Acceptance of Terms</h2>
        <p class="text-gray-700">
          By using Readly, you agree to these Terms of Service.
          If you do not agree, please do not use this service.
        </p>

        <h2 class="text-xl font-bold">2. User Responsibilities</h2>
        <p class="text-gray-700">
          You are responsible for:
        </p>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li>Maintaining the confidentiality of your data</li>
          <li>All reviews and content you post being appropriate</li>
          <li>Complying with applicable laws and regulations</li>
        </ul>

        <h2 class="text-xl font-bold">3. Content Rights</h2>
        <p class="text-gray-700">
          Book titles, authors, and ratings are used for informational purposes.
          All reviews posted by users remain the property of the users.
        </p>

        <h2 class="text-xl font-bold">4. Limitation of Liability</h2>
        <p class="text-gray-700">
          Discovera is provided "as is" without warranties.
          We are not liable for any indirect, incidental, or consequential damages.
        </p>

        <h2 class="text-xl font-bold">5. Changes to Terms</h2>
        <p class="text-gray-700">
          We reserve the right to update these terms at any time.
          Your continued use of the service constitutes acceptance of changes.
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {}
