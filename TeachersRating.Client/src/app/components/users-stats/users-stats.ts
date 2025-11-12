import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-stats',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './users-stats.html',
  styleUrl: './users-stats.scss'
})
export class UsersStats implements OnInit, OnDestroy {

  public presenceService = inject(PresenceService);

  async ngOnInit() {
    await this.presenceService.joinAdminGroup();
  }

  async ngOnDestroy() {
    await this.presenceService.leaveAdminGroup();
  }
}
