import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-headerh',
  templateUrl: './headerh.component.html',
  styleUrls: ['./headerh.component.css']
})
export class HeaderhComponent implements OnInit {
  @Input() generatedUsername: string = '';
  loginId: string = '';
  userId: string = '';  // Add userId to store the GUID
  deviceId: string = '';

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit() {
    this.checkAndSetUserInfo();
  }

  async checkAndSetUserInfo(): Promise<void> {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.deviceId = result.visitorId;
      console.log('Device ID:', this.deviceId);

      const metadata = await this.collectUserMetadata();
      console.log('Metadata:', metadata);

      this.userService.checkOrGenerateUser(metadata).subscribe(
        (response: any) => {
          console.log('API response:', response);
          const { id, username } = response;
          if (id && username) {
            this.userId = id;  // Set the userId from the API response
            this.generatedUsername = username;
            console.log('Username:', username);
            console.log('User ID:', id);
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

  async collectUserMetadata(): Promise<{ deviceId: string; userAgent: string; browserInfo: string; os: string; ip: string }> {
    try {
      const ipResponse = await this.http.get<{ ip: string }>('https://api.ipify.org?format=json').toPromise();
      const userAgent = navigator.userAgent;
      const browserInfo = this.getBrowserInfo();
      const os = this.getOperatingSystem();

      return {
        deviceId: this.deviceId,
        userAgent: userAgent,
        browserInfo: browserInfo,
        os: os,
        ip: ipResponse ? ipResponse.ip : 'unknown'
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

  getOperatingSystem(): string {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    if (/Windows/.test(platform)) {
      return 'Windows';
    } else if (/Mac/.test(platform)) {
      return 'Mac OS';
    } else if (/Linux/.test(platform)) {
      return 'Linux';
    } else if (/Android/.test(userAgent)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/.test(platform)) {
      return 'iOS';
    }
    return 'unknown';
  }

  validateLoginId() {
    if (this.loginId.trim().length !== 36) {
      alert('Invalid ID. Please enter a valid unique ID.');
    }
  }
}
