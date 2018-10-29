/**
 * @author todd.ma
 * @date 2018/10/17
 */

const fs = require('fs');
const os = require('os');
const readme = 'README.md';

const mds = fs.readdirSync('./')
    .filter( name => name!==readme && name.endsWith('.md') )
    .sort( (f1, f2) => {
        const stat1 = fs.statSync(`./${f1}`);
        const stat2 = fs.statSync(`./${f2}`);

        return stat2.ctimeMs - stat1.ctimeMs;
    });

const content = fs.readFileSync(readme, {
    encoding:'utf-8'
});

fs.writeFileSync(readme, content.replace('- ', `- [${mds[0]}](/${mds[0]})${os.EOL}- `))


