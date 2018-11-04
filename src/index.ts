import * as fs from 'fs';
import * as readline from 'readline';
import { fromReadLine } from './streams/InvertedIndexStream';

const rl = readline.createInterface({
    input: fs.createReadStream('sample.txt'),
    crlfDelay: Infinity
});

fromReadLine(rl).subscribe(x => console.log(x));