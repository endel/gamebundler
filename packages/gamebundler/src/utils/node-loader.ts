// https://github.com/nodejs/modules/issues/307#issuecomment-764560656
import { URL } from 'url'

export const resolve = async (specifier: any, context: any, defaultResolve: any) => {
  const result = await defaultResolve(specifier, context, defaultResolve);
  const child = new URL(result.url);

  if (
    child.protocol === 'nodejs:' ||
    child.protocol === 'node:' ||
    child.pathname.includes('/node_modules/')
  ) {
    return result;
  }

  const isAssetBundle = (/\.bundle\.m?js$/.test(child.pathname));

  return (isAssetBundle)
    ? { url: child.href + '?id=' + Math.random().toString(36).substring(3), }
    : { url: child.href, }
}