// src/pdfWorker.js
import { pdfjs } from "react-pdf";

// ✅ Worker'ı pdfjs-dist içinden al (react-pdf ile aynı dependency ağacından)
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;