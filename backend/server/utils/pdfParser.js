import PDFParser from "pdf2json";
import path from "path";

/**
 * parsePDF - Parses a PDF file and returns its text content.
 *
 * @param {string} pdfPath - The absolute path to the PDF file.
 * @returns {Promise<string>} - Resolves to the PDF's raw text content.
 */
export const parsePDF = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1); // Create a new instance for each call

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF parsing error:", errData);
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = pdfParser.getRawTextContent();
      console.log("Parsed PDF text length:", text.length);
      resolve(text);
    });

    // Ensure we resolve the absolute path
    pdfParser.loadPDF(path.resolve(pdfPath));
  });
};
