// // workaround to import "@minify-html/js" (https://github.com/wilsonzlin/minify-html/issues/65)
// import type * as minify from "@minify-html/js"
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const minifyHtml = require("@minify-html/js") as typeof minify;
import minifier from 'html-minifier';

export function minifyHTML(htmlContents: string) {
  return minifier.minify(htmlContents, {
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
  });
  // return minifyHtml.minify(htmlContents, minifyHtml.createConfiguration({
  //   do_not_minify_doctype: true,
  //   ensure_spec_compliant_unquoted_attribute_values: true,
  //   keep_closing_tags: true,
  //   keep_html_and_head_opening_tags: true,
  //   keep_spaces_between_attributes: true,
  //   keep_comments: false,
  //   minify_js: true,
  //   minify_css: true,
  //   remove_bangs: true,
  //   remove_processing_instructions: false
  // }));
}

export function injectHTML(htmlContents: string, injectHTML: string) {
  if (!htmlContents.includes("</body>")) {
    throw new Error("HTML file must contain a closing </body> tag.");
  }
  return htmlContents.replace("</body>", injectHTML + "\n</body>");
}