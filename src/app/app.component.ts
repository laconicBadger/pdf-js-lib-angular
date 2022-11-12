import { Component, VERSION } from '@angular/core';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { createWorker } from 'tesseract.js';
import { getDocument, PDFPageProxy, PDFDocumentProxy } from 'pdfjs-dist';

// TODO
// - caste pdf seite als canvas mit pdf-lib
//

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // properties
  page1download: HTMLAnchorElement;
  page2download: HTMLAnchorElement;
  // methods
  filePicked(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
    }
    let myfile: File = fileList[0]; //      <----- take first file in filelist
    const reader = new FileReader();
    reader.readAsDataURL(myfile);
    reader.onload = () => {
      console.log('reader.result:', reader.result);
      //this.loadPDF(reader.result, myfile.name);
      this.loadPDF(reader.result);
    };
  }

  async loadPDF(pdfBytes: ArrayBuffer | string) {
    const pdfDOC = await PDFDocument.load(pdfBytes);
    console.log('PDFDoc:', pdfDOC);
    const newDoc1 = await PDFDocument.create();
    const newDoc2 = await PDFDocument.create();
    const copiedPages1 = await newDoc1.copyPages(pdfDOC, [0]);
    const copiedPages2 = await newDoc2.copyPages(pdfDOC, [1]);
    newDoc1.addPage(copiedPages1[0]);
    newDoc2.addPage(copiedPages2[0]);

    const doc1Bytes = await newDoc1.save();
    const doc2Bytes = await newDoc2.save();

    //console.log('doc1bytes:', doc1Bytes);
    var blob = new Blob([doc1Bytes], { type: 'application/pdf' });
    var blobPage1 = new Blob([doc1Bytes], { type: 'application/pdf' });
    var blobPage2 = new Blob([doc2Bytes], { type: 'application/pdf' });

    var link = document.createElement('a');
    this.page1download = document.createElement('a');
    this.page1download.href = window.URL.createObjectURL(blobPage1);
    this.page1download.download = 'seite1.pdf';
    this.page2download = document.createElement('a');
    this.page2download.href = window.URL.createObjectURL(blobPage2);
    this.page2download.download = 'seite2.pdf';
    link.href = window.URL.createObjectURL(blob);
    link.download = 'page1.pdf';

    //link.click();
  }

  downloadPage1() {
    this.page1download.click();
  }

  downloadPage2() {
    this.page2download.click();
  }
}
