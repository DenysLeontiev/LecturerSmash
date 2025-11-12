import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private numberOfOnlineUsersSource: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  public numberOfOnlineUsers$: Observable<number> = this.numberOfOnlineUsersSource.asObservable();

  private hubConnection?: HubConnection;

  private hubUrl: string = environment.hubUrl;

  public async startConection(): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/online`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('NumberOfOnlineUsersChanged', (numberOfOnlineUsers: number) => {
      console.log('========== NumberOfOnlineUsersChanged ==========');
      this.numberOfOnlineUsersSource.next(numberOfOnlineUsers);
    });

    try {
      await this.hubConnection.start();
      console.log('PresenceHub connection established');
    } catch (error) {
      console.log('An error occured during PresenceHub connection: ', error);
    }
  }

  public stopHubConnection(): void {
    this.hubConnection?.stop();
  }

  public async joinAdminGroup(): Promise<void> {
    if (this.hubConnection?.state !== 'Connected') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('========== joined ==========');
    await this.hubConnection?.invoke("JoinAdminGroup");
  }

  public async leaveAdminGroup(): Promise<void> {
    await this.hubConnection?.invoke("LeaveAdminGroup");
  }
}
