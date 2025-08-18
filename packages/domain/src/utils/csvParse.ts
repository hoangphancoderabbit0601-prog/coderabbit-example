import { OrderCSVRow } from '@factory/order';
import { parse } from 'csv-parse';
import fs from 'fs';

export const getCSVHeaders = async (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const headers: string[] = [];

    const readStream = fs.createReadStream(filePath);
    const parser = parse({
      to_line: 1,
      skip_empty_lines: true,
      trim: true,
    });

    readStream.pipe(parser);

    parser.on('data', (row) => {
      headers.push(...row);
    });

    parser.on('end', () => {
      readStream.close();
      resolve(headers);
    });

    parser.on('error', (err) => {
      readStream.destroy();
      reject(err);
    });
  });
};

export const getCSVBody = async (filePath: string): Promise<OrderCSVRow[]> => {
  return new Promise((resolve, reject) => {
    const body: OrderCSVRow[] = [];
    let currentLine = 2;

    const readStream = fs.createReadStream(filePath);
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    readStream.pipe(parser);

    parser.on('data', (row: OrderCSVRow) => {
      currentLine++;
      body.push(row);
    });

    parser.on('end', () => {
      readStream.close();
      resolve(body);
    });

    parser.on('error', (err) => {
      readStream.destroy();
      reject(new Error(`Row ${currentLine}: ${err.message}`));
    });

    readStream.on('error', (err) => {
      reject(err);
    });
  });
};
