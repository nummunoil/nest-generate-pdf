import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/generatePDF')
  generatePDF() {
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        { text: 'Heading', fontSize: 25 },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: [
              ['First', 'Second', 'Third', 'The last one'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              ['Val 1', 'Val 2', 'Val 3', 'Val 4'],
            ],
          },
        },
        { text: 'google', link: 'http://google.com', pageBreak: 'before' },
        { qr: 'text in QR', foreground: 'green', background: 'white' },
      ],
      defaultStyle: {
        font: 'Helvetica',
      },
    };

    const options = {};
    const file_name = 'PDF' + new Date().getTime() + '.pdf';
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(file_name));
    pdfDoc.end();
    return { file_name: file_name };
  }
}
