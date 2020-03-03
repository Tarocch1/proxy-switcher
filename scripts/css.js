const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const css = require('css');

const antdCssPath = path.resolve(__dirname, '../node_modules/antd/dist/antd.css');
const cssPath = path.resolve(__dirname, '../src/styles/antd.css');

if (fs.existsSync(antdCssPath)) {
  const antdCss = fs.readFileSync(antdCssPath, {
    encoding: 'utf8',
  });
  const antdCssAst = css.parse(antdCss);
  const ruleIndex = antdCssAst.stylesheet.rules.findIndex(
    rule => rule.type === 'rule' && _.isEqual(rule.selectors, ['html', 'body']),
  );
  if (ruleIndex >= 0) {
    antdCssAst.stylesheet.rules.splice(ruleIndex, 1);
  }
  const cssCode = css.stringify(antdCssAst);
  fs.writeFileSync(cssPath, cssCode);
} else {
  console.error(`${antdCssPath} not found!`);
  process.exit(1);
}
