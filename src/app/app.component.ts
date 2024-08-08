import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  generatedUsername: string = '';

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.checkAndSetUserInfo();
  }

  async checkAndSetUserInfo(): Promise<void> {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const deviceId = result.visitorId;

      const metadata = await this.collectUserMetadata(deviceId);
      this.userService.checkOrGenerateUser(metadata).subscribe(
        (response: any) => {
          const { username } = response;
          if (username) {
            this.generatedUsername = username;
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

  async collectUserMetadata(deviceId: string): Promise<{ deviceId: string; userAgent: string; browserInfo: string; screenResolution: string; timezone: string; hardwareInfo: string; operatingSystem: string; ip: string }> {
    try {
      const userAgent = navigator.userAgent;
      const browserInfo = this.getBrowserInfo();
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hardwareInfo = navigator.hardwareConcurrency ? `CPU Cores: ${navigator.hardwareConcurrency}` : 'Unknown';
      const operatingSystem = this.getOperatingSystem();
      const ip = await this.getIpAddress();

      return {
        deviceId: deviceId,
        userAgent: userAgent,
        browserInfo: browserInfo,
        screenResolution: screenResolution,
        timezone: timezone,
        hardwareInfo: hardwareInfo,
        operatingSystem: operatingSystem,
        ip: ip
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
    let os = 'Unknown';
    const { userAgent } = navigator;
    if (userAgent.indexOf('Win') !== -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
    else if (userAgent.indexOf('X11') !== -1) os = 'UNIX';
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    return os;
  }

  async getIpAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unknown';
    }
  }
}
