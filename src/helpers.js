import fs from 'fs/promises';
import path from 'path';

export const parseInt = (input) => {
    console.log(input);
    let args = input.split(" ");
    const quoteReg = /"|'/g;
    if(quoteReg.test(args)){
        const quotesReg = /["'] | ["']/;
        args = args
            .join(" ")
            .split(quotesReg)
            .map((arg) => arg.replace(quoteReg, ""));
    }
    return args;
};

export const isExist = async (path) => {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
};
 
export const checkThatExist = async (path) => {
    try {
        return await fs.stat(path);
    } catch (error) {
        throw new Error();
    }
}
export const checkThatNotExist = async (path) => {
    const iaFileExit = await isExist(path);
    if(iaFileExit){
        throw new Error();
    }
}

export const isPathToFile = (filename) => {
    const dirMarker = /\|\\/g;
    return !dirMarker.test(filename);
}

export const checkIsNotFile = async (path) => {
    const pathStat = await checkThatExist(path);
    const isFile = pathStat.isFile();
    if(isFile) {
        throw new Error();
    }
}

export const getDirFromPath = (filePath) => {
    return path.parse(filePath).dir;
    // return path.dirname(filePath);
}