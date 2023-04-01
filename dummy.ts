/// <reference types="node" resolution-mode="require"/>
import type { readFile as ReadFileT } from "fs/promises";
import { Document } from "../document.js";
import { BaseDocumentLoader } from "./base.js";
import { PDFExtract } from 'pdfjs-extract';
export declare class PDFLoader extends BaseDocumentLoader  {
  constructor(private filePath: string) {}

  async load(): Promise<Document[]> {
    const pdfExtract = new PDFExtract();
    const options = {
      // Add any necessary options for pdfjs-extract here
    };
  
    const data = await pdfExtract.extract(this.filePath, options);
    const rawDocs: Document[] = [];
  
    for (const page of data.pages) {
        let pageContent = '';
        let lastItemType = '';
  
        for (const item of page.content) {
          if (item.type === 'table') {
            // Get the index of the table item
            const tableIndex = page.content.indexOf(item);
  
            // Get the text before the table
            let prevText = '';
            if (lastItemType === 'text') {
              const prevItem = page.content[tableIndex - 1];
              if (prevItem.type === 'text') {
                prevText = prevItem.str;
              }
            }
  
            // Get the text after the table
            let nextText = '';
            const nextItem = page.content[tableIndex + 1];
            if (nextItem && nextItem.type === 'text') {
              nextText = nextItem.str;
            }
  
            // Combine the table with the surrounding text
            const tableText = item.content.map(row => row.join(' ')).join('\n');
            pageContent += `${prevText}\n${tableText}\n${nextText}`;
          } else if (item.type === 'text') {
            pageContent += item.str;
          }
  
          lastItemType = item.type;
        }
  
        // Create a Document object and add it to the rawDocs array
        const doc = new Document({ text: pageContent });
        rawDocs.push(doc);
      }
  
    return rawDocs;
  }
}  



////////////


////


/// <reference types="node" resolution-mode="require"/>
import type { readFile as ReadFileT } from "fs/promises";
import { Document } from "../document.js";
import { BaseDocumentLoader } from "./base.js";
import { PDFExtract } from 'pdfjs-extract';
export declare class PDFLoader extends BaseDocumentLoader  {
  constructor(private filePath: string) {}

  async load(): Promise<string[]> {
    const pdfExtract = new PDFExtract();
    const options = {
      // Add any necessary options for pdfjs-extract here
    };

    const data = await pdfExtract.extract(this.filePath, options);
    const rawDocs: string[] = [];

    for (const page of data.pages) {
      let pageContent = '';

      for (const item of page.content) {
        if (item.type === 'table') {
          // Convert table to text format
          const tableText = item.content.map(row => row.join(' ')).join('\n');
          pageContent += tableText;
        } else if (item.type === 'text') {
          pageContent += item.str;
        }
      }

      rawDocs.push(pageContent);
    }

    return rawDocs;
  }
}
