import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) { }

  /**
   * Triggers the download of a template for the given test case ID.
   * @param id The test case ID.
   * @param headers Optional array of header strings to include in the CSV.
   */
  downloadExcelTemplate(id: string, headers: string[] = []): void {
    // API CALL: GET /api/templates/generate-excel?id={id}
    const url = `/api/templates/generate-excel?id=${id}`;

    console.log(`Triggering template download for ID: ${id} from ${url}`);

    // Mocking the download as a CSV file to avoid "file format or extension is not valid" errors
    // during frontend-only development since we are generating a raw Blob.
    const csvContent = headers.length > 0 ? headers.join(',') : 'ID,Dataset Name,Records,Status';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.triggerBrowserDownload(blob, `Template_TC_${id}.csv`);

    // In a real production environment, the backend would generate a valid .xlsx file:
    /*
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      this.triggerBrowserDownload(blob, `Template_TC_${id}.xlsx`);
    });
    */
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
