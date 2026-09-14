import { Component } from '@angular/core';
import {Router,RouterOutlet} from '@angular/router';
import {ClientNavbarComponent} from '../client-navbar/client-navbar.component';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [ClientNavbarComponent,RouterOutlet],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css'
})
export class ClientHomeComponent {


}
