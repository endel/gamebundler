import path from 'path';

const pkgPath = path.resolve(path.dirname((new URL(import.meta.url)).pathname), "..");

export const templatePath = path.resolve(pkgPath, "template");