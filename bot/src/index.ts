import cleanCourses from "./cleanCourses";
import getCoursesPage from "./getCoursesPage";
import { parseCoursesPage } from "./parseCoursesPage";

export const getBotResult = async () => {
  const timeString = new Date().toJSON();
  const coursesPage = await getCoursesPage();
  const courses = parseCoursesPage(coursesPage);
  if (courses) {
    const result = {
      time: timeString,
      courses: cleanCourses(courses),
    };
    return result;
  }
  throw new Error("parsing unsuccessful");
};
export type BotResult = Awaited<ReturnType<typeof getBotResult>>;
getBotResult().then((result) => {
  if (result !== undefined) {
    console.log(JSON.stringify(result));
  }
});
