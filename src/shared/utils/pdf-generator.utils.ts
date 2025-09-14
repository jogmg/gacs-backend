import * as fontkit from '@pdf-lib/fontkit';
import { Buffer } from 'buffer';
import { format } from 'date-fns';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { Certificate } from 'src/certificate/entities/certificate.entity';

export async function generateCertificate(
  certificate: Certificate,
  verificationUrl: string,
): Promise<Buffer> {
  // Load template
  const templatePath = join(
    __dirname,
    '../../../assets/templates/certificate-template.pdf',
  );

  const templateBytes = readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  // Template page
  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();

  // Generate QR code
  const qrCodeData = `${verificationUrl}/${certificate._id}`;
  const qrCode = await QRCode.toDataURL(qrCodeData, { width: 200 });

  // Embed QR code (bottom)
  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrCode.split(',')[1], 'base64'),
  );
  page.drawImage(qrImage, {
    x: (width - 100) / 2,
    y: 55,
    width: 105,
    height: 105,
  });

  // Add Font and Color
  const engagementPath = join(
    __dirname,
    '../../../assets/fonts/Engagement.ttf',
  );
  const engrvrsOldEngPath = join(
    __dirname,
    '../../../assets/fonts/EngrvrsOldEng-BT.ttf',
  );
  const montserratPath = join(
    __dirname,
    '../../../assets/fonts/Montserrat-Bold.ttf',
  );

  const engagementData = readFileSync(engagementPath);
  const engrvrsOldEngData = readFileSync(engrvrsOldEngPath);
  const montserratData = readFileSync(montserratPath);

  const engagementFont = await pdfDoc.embedFont(engagementData);
  const engrvrsOldEngFont = await pdfDoc.embedFont(engrvrsOldEngData);
  const montserratFont = await pdfDoc.embedFont(montserratData);

  const engagementColor = rgb(0, 0, 0);
  const engrvrsOldEngColor = rgb(0, 0.05, 0.329);

  // Add SubHeading Text
  const subHeadingWidth = engagementFont.widthOfTextAtSize(
    `Class Of ${certificate.student.graduationDate.split('-')[0]}`,
    55,
  );
  const subHeadingX = subHeadingWidth / 2;

  page.drawText(
    `Class Of ${certificate.student.graduationDate.split('-')[0]}`,
    {
      x: width / 2 - subHeadingX,
      y: height - 188,
      size: 55,
      font: engagementFont,
      color: engagementColor,
    },
  );

  // Add Name Text
  const nameWidth = engrvrsOldEngFont.widthOfTextAtSize(
    certificate.student.name,
    65,
  );
  const nameX = nameWidth / 2;

  page.drawText(certificate.student.name, {
    x: width / 2 - nameX,
    y: height - 305,
    size: 65,
    font: engrvrsOldEngFont,
    color: engrvrsOldEngColor,
  });

  // Add Date Text
  const dateWidth = montserratFont.widthOfTextAtSize(
    format(certificate.student.graduationDate, 'PPPP'),
    18,
  );
  const dateX = dateWidth / 2;

  page.drawText(format(certificate.student.graduationDate, 'PPPP'), {
    x: width / 2 - dateX,
    y: height - 416,
    size: 18,
    font: montserratFont,
    color: engrvrsOldEngColor,
  });

  // Save and return PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
