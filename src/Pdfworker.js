// src/pdfWorker.js
import { pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Vite için worker URL
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;