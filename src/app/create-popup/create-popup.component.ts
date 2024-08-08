import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-create-popup',
  templateUrl: './create-popup.component.html',
  styleUrls: ['./create-popup.component.css']
})
export class CreatePopupComponent {
  uploadProgress: number = 0;
  thumbnailUrl: string | ArrayBuffer | null = null;
  private apiUrl = 'https://localhost:7290';

  constructor(
    public dialogRef: MatDialogRef<CreatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string },  // Inject userId
    private http: HttpClient
  ) {}

  uploadFile(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    } else {
      console.error('File input element not found');
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        // Pass userId as metadata with the file
        const metadata = `userId:${this.data.userId}`;
        formData.append('metadata', metadata);

        const fullApiUrl = `${this.apiUrl}/api/Feeds/create`;

        // Log the full API URL being called
        console.log(`API URL being called: ${fullApiUrl}`);

        // Log the FormData contents
        console.log('FormData contents:');
        console.log('File:', file);
        console.log('Metadata:', metadata);

        this.http.post(fullApiUrl, formData, {
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
        }, error => {
            console.error('Upload failed:', error.message);
            alert('Upload failed: ' + error.message);
        });
    } else {
        console.error('No file selected');
    }
}


  close(): void {
    this.dialogRef.close();
  }
}
