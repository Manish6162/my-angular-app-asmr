import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-create-popup',
  templateUrl: './create-popup.component.html',
  styleUrls: ['./create-popup.component.css']
})
export class CreatePopupComponent {
  uploadProgress: number = 0;
  thumbnailUrl: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<CreatePopupComponent>,
    private http: HttpClient
  ) {}

  uploadFile(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post(`https://localhost:7290/api/Feeds/create`, formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          console.log('Upload complete:', event.body);
          this.thumbnailUrl = URL.createObjectURL(file); // Display a thumbnail
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
