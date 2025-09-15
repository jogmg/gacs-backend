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
) {
  // clean up memory
  const cleanup = () => {
    if (global.gc) {
      global.gc();
    }
  };

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

  // Embed QR code
  const qrImage = await pdfDoc.embedPng(
    Buffer.from(qrCode.split(',')[1], 'base64'),
  );

  page.drawImage(qrImage, {
    x: width / 2 - 52.5,
    y: 55,
    width: 105,
    height: 105,
  });

  const mainColor = rgb(0, 0.05, 0.329);

  // Fetch and embed image in PDFDoc
  if (certificate.student.imgURL) {
    try {
      const res = await fetch(certificate.student.imgURL);
      const imageBytes = await res.arrayBuffer();
      const image = await pdfDoc.embedJpg(Buffer.from(imageBytes));
      const scaledImage = image.scaleToFit(115, 154);

      // Define image position and dimensions
      const imageX = 79.5;
      const imageY = height - 300;
      const imageWidth = scaledImage.width;
      const imageHeight = scaledImage.height;

      // Draw border around the image
      page.drawRectangle({
        x: imageX - 2,
        y: imageY - 2,
        width: imageWidth + 4,
        height: imageHeight + 4,
        borderColor: mainColor,
        borderWidth: 2,
      });

      page.drawImage(image, {
        x: imageX,
        y: imageY,
        width: imageWidth,
        height: imageHeight,
      });
    } catch {
      console.log('Error fetching student image');
    } finally {
      cleanup();
    }
  }

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
    color: mainColor,
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
    color: mainColor,
  });

  // Save and return PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
