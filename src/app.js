import path from 'path';
import { createInterface } from 'readline/promises';
import {brotli, files, hash, nwd, sysInfo } from './commands/index.js'
import {getDirFromPath, isPathToFile, parseInt } from './helpers.js'
import {messages} from './messages.js'

export class App{
    constructor(startDirName){
        this._currentPath = startDirName;
    }

    _resolvePath(x) {
        return path.resolve(this._currentPath, x); 
    }

    async up(){
        const pathUp = this._resolvePath('..');
        this._currentPath = await nwd.cd(pathUp);
    }

    async cd(args){
        const pathTo = this._resolvePath(args[0]);
        this._currentPath = await nwd.cd(pathTo);
    }
    
    async ls(){
        await nwd.ls(this._currentPath);
    }

    async cat(args){
        const path = this._resolvePath(args[0]);
        await files.cat(path);
    }

    async add(args){
        const newName = this._resolvePath(args[0]);
        await files.add(newName);
    }

    async rn(args){
        const pathTo = this._resolvePath(args[0]);
        const dir = getDirFromPath(pathTo);
        const newPath = path.resolve(dir, args[1])
        await files.rn(pathTo, newPath);
    }

    async cp(args){
        const pathToOld = this._resolvePath(args[0]);
        const pathToNew = this._resolvePath(args[1]);
        await files.cp(pathToOld, pathToNew);
    }

    async mv(args){
        const pathToOld = this._resolvePath(args[0]);
        const pathToNew = this._resolvePath(args[1]);
        await files.mv(pathToOld, pathToNew);
    }

    os(args){
        sysInfo(args[0]);
    }

    async hash(args){
        const path = this._resolvePath(args[0]);
        await hash(path);
    }

    async compress(args){
        const pathTo = this._resolvePath(args[0]);
        const pathTodest = this._resolvePath(args[1]);
        await brotli.compress(pathTo, pathTodest);
    }

    async decompress(args){
        const pathTo = this._resolvePath(args[0]);
        const pathTodest = this._resolvePath(args[1]);
        await brotli.decompress(pathTo, pathTodest);
    }

    ['.exit']() {
        process.exit();
    }

    validator(command, args) {
        switch (command) {
            case 'up':
            case 'ls':
            case '.exit':
                return true;
            case 'cd':
            case 'cat':
            case 'rm':
            case 'os':
            case 'hash':
            case 'cat':
                if (args[0]) {
                    return true;
                }
            case 'mv':
            case 'cp':
            case 'compress':
            case 'decompress':
                if(args[0] && args[1]) {
                    return true;
                }
            case 'add':
                if(args[0] && isPathToFile(args[0])) {
                    return true;
                }
            case 'rn':
                if(args[0] && args[1] && isPathToFile(args[1])) {
                    return true;
                }
            default:
                return false;
        }
    }

    async start() {
        const rl = createInterface({input: process.stdin, output: process.stdout})
        while (true) {
            const input = await rl.question(`You are currently in ${this._currentPath}\n`);
            console.log(input);
            const [command, ...args] = parseInt(input);
            if(this.validator(command, args)) {
                try {
                    await this[command](args);
                } catch (error) {
                    console.log(messages.operationFailed);
                }
            } else {
                console.log(messages.invalidInput);
            }
        }
    }

}