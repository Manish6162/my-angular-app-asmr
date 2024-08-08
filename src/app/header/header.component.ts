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
  @Input() userId: string = '';  // Add userId as an input

  constructor(private dialog: MatDialog) {}

  openCreatePopup(): void {
    const dialogRef = this.dialog.open(CreatePopupComponent, {
      width: '400px',
      height: '300px',
      data: { userId: this.userId }  // Pass userId to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Create popup closed');
    });
  }
}
