import * as fs from 'fs';
import * as readline from 'readline';
import { from, fromEvent, Observable } from 'rxjs';
import { map, mergeMap, reduce, takeUntil } from 'rxjs/operators';

interface IDocumentLine {
    lineNumber: number;
    lineText: string;
};

interface IDocumentPosition {
    lineNumber: number,
    linePosition: number
};

interface IDocumentWord {
    word: string;
    position: IDocumentPosition;
};

type InvertedIndex = Map<string, IDocumentPosition[]>;

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

const documentWordStream: Observable<IDocumentWord> = documentLineStream.pipe(
    mergeMap<IDocumentLine, IDocumentWord>((value: IDocumentLine, index: number) => {
        const wordMatcher = /\w+/g;
        const documentWords: IDocumentWord[] = [];
        let match: RegExpExecArray | null;

        while ((match = wordMatcher.exec(value.lineText)) !== null) {
            const word = match[0];
            const position: IDocumentPosition = {
                lineNumber: value.lineNumber,
                linePosition: match.index + 1
            };
            const documentWord: IDocumentWord = { word, position };

            documentWords.push(documentWord);
        }

        return from(documentWords);
    })
);

const invertedIndexStream: Observable<InvertedIndex> = documentWordStream.pipe(
    reduce<IDocumentWord, InvertedIndex>((acc: InvertedIndex, value: IDocumentWord) =>
        insertWithDefault(acc, value.word, value.position),
        new Map<string, IDocumentPosition[]>()
    )
);

invertedIndexStream.subscribe(x => console.log(x));

function insertWithDefault(index: InvertedIndex, key: string, value: IDocumentPosition) {
    const currentValue: IDocumentPosition[] = index.get(key) || [];
    const newValue = currentValue.concat(value);
    index.set(key, newValue);
    return index;
}