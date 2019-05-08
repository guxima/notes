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

let content = `
# TABLE OF CONTENTS

${mds.map(title => `- [${title}](/${encodeURIComponent(title)})`).join(os.EOL)}
`;

fs.writeFileSync(readme, content);


