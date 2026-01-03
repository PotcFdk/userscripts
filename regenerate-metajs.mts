import { writeFileSync, readFileSync, readdirSync, statSync, existsSync } from 'fs';

type NamedData = {name: string, lines: string[]};
type NamedNullableData = {name: string, lines: string[] | null};
type NamedMeta = {name: string, meta: string};

const isDirectory = (name: string) => statSync(name).isDirectory();
const hasUserscriptFile = (name: string) => existsSync(`${name}/${name}.user.js`);
const hasData = (input: NamedNullableData): input is NamedData => input.lines !== null;

const readUserscriptFile = (name: string): NamedData => ({
    name,
    lines: readFileSync(`${name}/${name}.user.js`, 'utf8').split(/[\r\n]+/)
});

const writeMetaFile = ({name, meta}: NamedMeta) => writeFileSync(`${name}/${name}.meta.js`, meta, 'utf8');

const extractMetaBlock = ({name, lines}: NamedData): NamedNullableData => ({
    name,
    lines: lines.slice(0, lines.indexOf('// ==/UserScript==') + 1).length ? lines.slice(0, lines.indexOf('// ==/UserScript==') + 1) : null
})

const joinMetaBlock = ({name, lines}: NamedData): NamedMeta => ({
    name,
    meta: lines.join('\n') + '\n'
});

readdirSync('.')
    .filter(isDirectory)
    .filter(hasUserscriptFile)
    .map(readUserscriptFile)
    .map (extractMetaBlock)
    .filter(hasData)
    .map (joinMetaBlock)
    .forEach(writeMetaFile);
