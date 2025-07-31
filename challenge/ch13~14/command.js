import { researchGitAdd, researchCommit, printLog } from "./research.js";

export async function commandBroker(command) {
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
    }
}