#!/usr/bin/env node

import * as fs from 'fs';
import * as readline from 'readline';
import { fromReadLine } from './streams/InvertedIndexStream';
import { argParse, IInvertedIndexArgs } from './ArgumentParser';

const args: IInvertedIndexArgs = argParse();

const rl = readline.createInterface({
    input: fs.createReadStream(args.filePath),
    crlfDelay: Infinity
});

fromReadLine(rl).subscribe(x => console.log(x));