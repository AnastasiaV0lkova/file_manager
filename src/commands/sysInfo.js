import os from 'os';
import {messages} from '../messages.js';

export const sysInfo = (param) => {
    switch (param) {
        case '--eol':
        case '--EOL':
            console.log("EOL:", JSON.stringify(os.EOL));
            break;
        case "--cpus":
            const cpus = os.cpus();
            const res = cpus.map((cpu)=> ({ Model: cpu.model.trim(), Rate: `${cpu.speed / 1000} GHz` }))
            console.log('Overall amount of CPUS: ', cpus.length);
            console.log(res);
            break;
        case '--homedir':
            console.log('Home directory:', os.homedir());
            break;
        case '--username':
            console.log('System user name: ', os.userInfo().username);
            break;
        case '--architecture':
            console.log('This processor architecture is: ', process.arch);
            break; 
        default:
            console.log(messages.invalidInput);
    }
}