import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe to safely transform values
 * Example: {{ rating | safeNumber:1 }} → displays with 1 decimal
 */
@Pipe({
  name: 'safeNumber',
  standalone: true,
})
export class SafeNumberPipe implements PipeTransform {
  transform(value: number, decimals: number = 0): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return value.toFixed(decimals);
  }
}

/**
 * Custom pipe for truncating text
 * Example: {{ 'Long text...' | truncate:20 }} → 'Long text...'
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
