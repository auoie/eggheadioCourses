import { getBotResult } from '@egghead/egghead-courses';
import { join } from 'path';
import { cwd } from 'process';
import { sync } from 'write';
getBotResult().then((result) => {
  if (result == undefined) {
    return;
  }
  const coursesFilePath = join(cwd(), '_courses', 'cleanCourses.json');
  const stringResult = JSON.stringify(result);
  sync(coursesFilePath, stringResult);
});
