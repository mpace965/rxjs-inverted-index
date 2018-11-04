import * as fs from 'fs';
import * as readline from 'readline';
import { fromEvent, Observable } from 'rxjs';
import { map, reduce, takeUntil } from 'rxjs/operators';

interface IDocumentLine {
    lineNumber: number;
    lineText: string;
};

interface IDocumentPosition {
    lineNumber: number,
    linePosition: number
};

type InvertedIndex = Map<string, IDocumentPosition>;

const rl = readline.createInterface({
    input: fs.createReadStream('sample.txt'),
    crlfDelay: Infinity
});

const lineStream: Observable<string> = fromEvent<string>(rl, 'line').pipe(
    takeUntil(fromEvent<void>(rl, 'close'))
);

const documentLineStream: Observable<IDocumentLine> = lineStream.pipe(
    map<string, IDocumentLine>((value: string, index: number) => {
        return {
            lineNumber: index + 1,
            lineText: value
        }
    })
);

const invertedIndexStream: Observable<InvertedIndex> = documentLineStream.pipe(
    reduce<IDocumentLine, InvertedIndex>((acc: InvertedIndex, value: IDocumentLine) => {
        return acc;
    }, new Map<string, IDocumentPosition>())
);

documentLineStream.subscribe(x => console.log(x));