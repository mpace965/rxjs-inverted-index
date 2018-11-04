import * as fs from 'fs';
import * as readline from 'readline';
import { fromEvent, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

interface ILineNumber {
    lineNumber: number;
    lineText: string;
}

const rl = readline.createInterface({
    input: fs.createReadStream('sample.txt'),
    crlfDelay: Infinity
});

const closeStream: Observable<void> = fromEvent<void>(rl, 'close');
const lineStream: Observable<string> = fromEvent<string>(rl, 'line').pipe(takeUntil(closeStream));

const lineNumberStream: Observable<ILineNumber> = lineStream.pipe(
    map<string, ILineNumber>((value: string, index: number) => {
        return {
            lineNumber: index + 1,
            lineText: value
        }
    })
);

lineNumberStream.subscribe(x => console.log(x));