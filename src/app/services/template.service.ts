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

    // Logic for Blob handling would go here in a real implementation:
    // this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
    //   const fileName = `Template_TC_${id}.xlsx`;
    //   const objectUrl = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = objectUrl;
    //   a.download = fileName;
    //   a.click();
    //   URL.revokeObjectURL(objectUrl);
    // });

    console.log(`Triggering Excel template download for ID: ${id} from ${url}`);
  }
}
