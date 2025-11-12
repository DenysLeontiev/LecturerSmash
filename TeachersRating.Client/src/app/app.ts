import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PresenceService } from './services/presence/presence.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  private presenceService = inject(PresenceService);

  async ngOnInit(): Promise<void> {
    await this.presenceService.startConection();
  }

  ngOnDestroy(): void {
    this.presenceService.stopHubConnection();
  }
}
