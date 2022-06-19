import { Course, Tag } from "./parseCoursesPage";

/**
 * Makes sure that for each course, the values of course.tags.name are distinct
 * @param courses are a list of courses
 * @returns courses such that the tag names are distinct
 */
export const cleanCourses = (courses: Course[]): Course[] => {
  return courses.map((course) => {
    const tags: Tag[] = [];
    const distinctTagNames = new Set<string>();
    course.tags.forEach((curTag) => {
      if (!distinctTagNames.has(curTag.name)) {
        distinctTagNames.add(curTag.name);
        tags.push(curTag);
      }
    });
    return { ...course, tags };
  });
};
