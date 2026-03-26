import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) { }

  /**
   * Triggers the download of an Excel template for the given test case ID.
   * @param id The test case ID.
   */
  downloadExcelTemplate(id: string): void {
    // API CALL: GET /api/templates/generate-excel?id={id}
    const url = `/api/templates/generate-excel?id=${id}`;

    console.log(`Triggering Excel template download for ID: ${id} from ${url}`);

    // Real implementation with Blob handling:
    // this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
    //   this.triggerBrowserDownload(blob, `Template_TC_${id}.xlsx`);
    // });

    // Mocking the download for demo purposes
    const mockBlob = new Blob(['Mock data for Excel template'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    this.triggerBrowserDownload(mockBlob, `Template_TC_${id}.xlsx`);
  }

  private triggerBrowserDownload(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }
}
