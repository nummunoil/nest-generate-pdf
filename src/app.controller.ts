import { Controller, Get, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';
import * as htmlToPdf from 'html-pdf-node';

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
        {
          text: 'This paragraph (consisting of a single line) directly sets top and bottom margin to 20',
          margin: [0, 20],
        },
        {
          text: 'left top right bottom 30 50 20 20',
          margin: [30, 50, 20, 20],
        },
        'hi',
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

  @Get('/genPDF')
  @Header('Content-Type', 'application/pdf')
  async genPDF(@Res() res) {
    const templateHtml = fs.readFileSync('html/hi.html', 'utf8');
    const options = { format: 'A4' };
    const file = { content: templateHtml };

    try {
      const buffer = await htmlToPdf.generatePdf(file, options);
      return res.send(buffer);
    } catch (error) {
      console.log(error);
    }

    // htmlToPdf
    //   .generatePdf(file, options)
    //   .then((pdfBuffer) => {
    //     console.log('PDF Buffer:-', pdfBuffer);
    //     res.send(pdfBuffer);
    //   })
    //   .catch((err) => {
    //     console.log('Error:-', err);
    //   });
  }
}
