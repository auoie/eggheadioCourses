import { BotResult } from '@egghead/egghead-courses';
import { readFileSync } from 'fs';
import { join } from 'path';

const coursesPath = join(process.cwd(), '_courses', 'cleanCourses.json');
export const botResult = JSON.parse(
  readFileSync(coursesPath, 'utf8')
) as BotResult;
