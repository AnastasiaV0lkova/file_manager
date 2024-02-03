import fs from "fs/promises";
import {checkIsNotFile} from "../helpers.js"

export const cd = async (path) =>{
    await checkIsNotFile(path);
    return path;
}

export const ls = async (currenePath) =>{
    const dir = await fs.readdir(currenePath, {withFileTypes: true});
    const sortedDir = dir.sort((a,b) => a.isFile() - b.isFile()).filter((item)=> !item.isSymbolicLink());
    let res = [];
    sortedDir.forEach(element => {
        res.push({name: element.name, type: element.isFile() ? 'file' : 'directory'});
    });
    console.table(res);
}