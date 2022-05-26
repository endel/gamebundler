import fs from "fs/promises";

export class File {
  constructor(
    private extension: string,
    private contents: string,
  ) {}

  async write(filename) {
    await fs.writeFile(`${filename}.${this.extension}`, this.contents);
  }

  toJSON() {
    return `filename.${this.extension}`;
  }
}

export const enqueuedFiles: File[] = [];

export function outputFile(extension: string, contents: string) {
  const file = new File(extension, contents);

  enqueuedFiles.push(file);

  return file;
}

