import {createReadStream, createWriteStream} from 'fs'
import fs from 'fs/promises'
import {pipeline} from 'stream/promises'
import { checkThatExist, checkThatNotExist } from '../helpers.js';
import {messages} from '../messages.js'

export const copyFile = async (pathOld, pathNew) => {
    await checkThatExist(pathOld);
    await checkThatNotExist(pathNew);
    const readable = createReadStream(pathOld);
    const writeable = createWriteStream(pathNew);
    await pipeline(readable, writeable);
}

export const removeFile = async (path) => {
    await fs.rm(path);
}

export const cat = async (path) => {
    await checkThatExist(path);
    const readable = createReadStream(path, 'utf-8');
    readable.pipe(process.stdout);
    await new Promise((resolve, reject) => {
        readable.on('end', () => resolve());
        readable.on('error', () => reject());
    })
}

export const add = async (newFile) => {
    await fs.writeFile(newFile, "", {flag: "wx"});
    console.log(messages.operationSuccesful);
}

export const rn = async (path, newPath) => {
    await checkThatNotExist(newPath);
    await fs.rename(path, newPath);
    console.log(messages.operationSuccesful);
}

export const cp = async (path, newPath) => {
    await copyFile(path, newPath);
    console.log(messages.operationSuccesful);
}

export const rm = async (path) => {
    await removeFile(path);
    console.log(messages.operationSuccesful);
}

export const mv = async (path, newPath) => {
    await copyFile(path, newPath);
    await removeFile(path);
    console.log(messages.operationSuccesful);
}