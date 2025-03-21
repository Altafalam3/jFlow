import PDFParser from "pdf2json";

/**
 * parsePDF - Parses a PDF file and returns its text content.
 *
 * @param {string} pdfPath - The path to the PDF file.
 * @returns {Promise<string>} - Resolves to the PDF's raw text content.
 */
export const parsePDF = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.loadPDF(pdfPath);
  });
};
