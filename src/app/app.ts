import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout';

/**
 * Root App Component
 * @Component marks this class as an Angular component
 * - selector: name used to embed this component in templates
 * - standalone: true enables standalone API without NgModule
 * - imports: declares dependencies for this component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Root component - minimal logic, delegates to child components
}