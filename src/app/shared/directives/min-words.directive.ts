import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Custom validator: MinWordsValidator
 * Validates that a text input has a minimum number of words
 *
 * Example: <textarea appMinWords="10"></textarea>
 * This ensures the textarea has at least 10 words
 */
@Directive({
  selector: '[appMinWords]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinWordsValidator,
      multi: true,
    },
  ],
})
export class MinWordsValidator implements Validator {
  @Input('appMinWords') minWords: number = 1;

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const wordCount = value.trim().split(/\s+/).length;
    return wordCount >= this.minWords ? null : { minWords: { value } };
  }
}
