import {createReadStream, createWriteStream} from 'fs';
import {pipeline} from 'stream/promises';
import {createBrotliCompress, createBrotliDecompress} from 'zlib';
import {checkThatExist, checkThatNotExist} from '../helpers.js';
import {messages} from '../messages.js'

const implementBrotli = async (pathTo, patToDest, action) =>{
    await checkThatExist(pathTo);
    await checkThatNotExist(patToDest);
    const brotli = action == 'decompress' ? createBrotliDecompress() : createBrotliCompress();
    const srcStream = createReadStream(pathTo);
    const destStream = createWriteStream(patToDest);
    await pipeline(srcStream, brotli, destStream);

    console.log(messages.operationSuccesful);
}

export const compress = async (...args) => {
    await implementBrotli(...args, 'compress');
}

export const decompress = async (...args) => {
    await implementBrotli(...args, 'decompress');
}