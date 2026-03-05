import { copyFileSync } from 'fs';
import { resolve } from 'path';

copyFileSync(resolve('..', '.env.example'), resolve('dist', '.env.example'));
