import * as path from 'path';

export interface IInvertedIndexArgs {
    filePath: string;
}

export function argParse(): IInvertedIndexArgs {
    if (process.argv.length !== 3) {
        console.error('usage: inverted-index <file>');
        process.exit(1);
    }

    const filePath = path.normalize(process.argv[2]);

    return {
        filePath
    };
}