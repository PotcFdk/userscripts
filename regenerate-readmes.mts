import { writeFileSync, readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { strictEqual, ok } from 'assert'

const template = (path: string, description: string) => `# ${path}
${description}

## Installation
1. Install a userscript addon for your browser. Violentmonkey is recommended, but other ones such as Greasemonkey or Tampermonkey should also work although they're untested.  
[Violentmonkey for Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)  
[Violentmonkey for Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/eeagobfjdenkkddmbclomhiblgggliao)  
[Violentmonkey for Google Chrome](https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag)
2. [Click Here](https://github.com/PotcFdk/userscripts/raw/master/${path}/${path}.user.js) to open \`https://github.com/PotcFdk/userscripts/raw/master/${path}/${path}.user.js\`.
3. Click \`Install\`.`;

const RGX_DESCRIPTION = /^\/\/ @description\s+(.+)$/m;

function getDescription (path: string) {
    const metaJs = readFileSync (`${path}/${path}.user.js`, 'utf8');
    let match = RGX_DESCRIPTION.exec(metaJs);
    if (match) {
        const description = match[1];
        return description;
    }
}

readdirSync('.')
    .filter(e => statSync(e).isDirectory())
    .filter(name => existsSync(`${name}/${name}.user.js`))
    .forEach(name => {
        const description = getDescription(name);
        
        ok(description);
        strictEqual(typeof description, 'string');
        ok(description.length > 6)

        writeFileSync(`${name}/README.md`, template(name, description), 'utf8');
    });
