import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  generatedUsername: string = '';
  deviceId: string = '';

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit() {
    this.checkAndSetUserInfo();
  }

  async checkAndSetUserInfo(): Promise<void> {
    try {
      // Initialize FingerprintJS
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.deviceId = result.visitorId;

      localStorage.setItem('deviceId', this.deviceId);
      this.setCookie('deviceId', this.deviceId, 365 * 5); // Set cookie for 5 years

      const metadata = await this.collectUserMetadata();
      this.userService.checkAndGenerateUser(metadata).subscribe(
        (response: any) => {
          const { username } = response;
          if (username) {
            this.generatedUsername = username;
            this.setCookie('username', username, 365 * 5); // Set cookie for 5 years
            console.log('Username:', username);
          } else {
            console.error('Invalid API response:', response);
          }
        },
        (error: any) => {
          console.error('Error checking/generating user:', error);
        }
      );
    } catch (error) {
      console.error('Error collecting user metadata:', error);
    }
  }

  async collectUserMetadata(): Promise<{ deviceId: string; userAgent: string; browserInfo: string }> {
    try {
      const userAgent = navigator.userAgent;
      const browserInfo = this.getBrowserInfo();

      return {
        deviceId: this.deviceId,
        userAgent: userAgent,
        browserInfo: browserInfo
      };
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }

  getBrowserInfo(): string {
    const { appName, appVersion, platform } = navigator;
    return `AppName: ${appName}, AppVersion: ${appVersion}, Platform: ${platform}`;
  }

  setCookie(name: string, value: string, days: number) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  getCookie(name: string): string {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return '';
  }
}
