import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePopupComponent } from '../create-popup/create-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() generatedUsername: string = '';

  constructor(private dialog: MatDialog) {}

  openCreatePopup(): void {
    this.dialog.open(CreatePopupComponent, {
      width: '400px',
      height: '300px'
    });
  }
}
