import { researchGitAdd, researchCommit, printLog, realGitAdd } from "./research.js";

export async function commandBroker(command, fileName) {
    switch (command) {
        case 'add':
            researchGitAdd();
            break;
        case 'commit':
            researchCommit();
            break;
        case 'log':
            printLog();
            break;
        case 'realAdd':
            realGitAdd(fileName);
            break;
    }
}