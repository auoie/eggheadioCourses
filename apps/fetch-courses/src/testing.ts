import {
  cleanCourses,
  Course,
  getCoursesPage,
  parseCoursesPage,
} from '@egghead/egghead-courses';
import { readFileSync } from 'fs';
import { join } from 'path';

// 1.
getCoursesPage().then((res) => console.log(res));

// 2.
console.log(
  JSON.stringify(
    parseCoursesPage(
      readFileSync(join(__dirname, '..', 'output', 'coursesPage.html'), 'utf8')
    )
  )
);

// 3.
console.log(
  JSON.stringify(
    cleanCourses(
      JSON.parse(
        readFileSync(join(__dirname, '..', 'output', 'courses.json'), 'utf8')
      ) as Course[]
    )
  )
);
