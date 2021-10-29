import { Course } from "./parseCoursesPage";

/**
 * Makes sure that for each course, the values of course.tags.name are distinct
 * @param courses are a list of courses
 * @returns courses such that the tag names are distinct
 */
const cleanCourses = (courses: Course[]): Course[] => {
  return courses.map((course) => {
    const tags = [];
    const distinctTagNames = new Set<string>();
    for (let i = 0; i < course.tags.length; i += 1) {
      const curTag = course.tags[i];
      if (!distinctTagNames.has(curTag.name)) {
        distinctTagNames.add(curTag.name);
        tags.push(curTag);
      }
    }
    return { ...course, tags };
  });
};
export default cleanCourses;
