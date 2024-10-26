import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'wepink';
  logado : boolean = false;
  artista: any | undefined;
  temArtista: boolean = false;

  constructor(private router: Router){
  }

  async ngOnInit(): Promise<void> {
  }
}
