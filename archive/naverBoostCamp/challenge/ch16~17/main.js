import readline from 'readline';
import { getVectorService } from './singletonFactory.js';
import { stdin } from 'process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});