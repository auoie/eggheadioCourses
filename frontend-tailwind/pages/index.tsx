import { readFileSync } from "fs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { join } from "path";
import { Course, Tag as TagType } from "../../bot/src/parseCoursesPage";
import clsx from "clsx";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMemo, useState } from "react";

type CourseProp = Course & {
  markdown: MDXRemoteSerializeResult<Record<string, unknown>>;
};
type Props = {
  courses: CourseProp[];
  tags: {
    count: number;
    tag: TagType;
  }[];
};
export const getStaticProps: GetStaticProps<Props> = async (_context) => {
  const dir = process.cwd();
  const coursesPath = join(dir, "..", "bot", "output", "cleanCourses.json");
  const courses = (
    JSON.parse(readFileSync(coursesPath, "utf8")) as Course[]
  ).slice(0); // TODO Comment out
  const distinctTags = new Set<string>();
  const tagObjects = new Map<string, TagType>();
  const tagCounts = new Map<string, number>();
  courses.forEach((course) => {
    const curTags = course.tags;
    curTags.forEach((curTag) => {
      if (!distinctTags.has(curTag.name)) {
        distinctTags.add(curTag.name);
        tagObjects.set(curTag.name, curTag);
        tagCounts.set(curTag.name, 1);
      } else {
        tagCounts.set(curTag.name, (tagCounts.get(curTag.name) as number) + 1);
      }
    });
  });
  const coursesWithMarkdown = await Promise.all(
    courses.map(async (course) => {
      const mdxSource = await serialize(
        course.description ? course.description : ""
      );
      return { ...course, markdown: mdxSource };
    })
  );
  const tags = Array.from(distinctTags)
    .sort((a, b) => {
      const dif = (tagCounts.get(b) as number) - (tagCounts.get(a) as number);
      if (dif === 0) {
        return a.localeCompare(b);
      }
      return dif;
    })
    .map((tag) => ({
      tag: tagObjects.get(tag) as TagType,
      count: tagCounts.get(tag) as number,
    }));
  return {
    props: {
      courses: coursesWithMarkdown,
      tags,
    },
  };
};
const EGGHEADIO_URL = "https://egghead.io";
const EGGHEADIO_COURSES_URL = "https://egghead.io/courses/";
const freeAccessState = { value: "free", label: "Free" } as const;
const allAccessState = { value: "all", label: "All" } as const;
const proAccessState = { value: "pro", label: "Pro" } as const;
const accessStates = [freeAccessState, allAccessState, proAccessState] as const;
const descendingState = { value: "descending", label: "Descending" } as const;
const ascendingState = { value: "ascending", label: "Ascending" } as const;
const sortOrderStates = [descendingState, ascendingState] as const;
const sortByDate = { value: "date", label: "Date" } as const;
const sortByCompleted = { value: "completed", label: "Completed" } as const;
const sortByRating = { value: "rating", label: "Rating" } as const;
const sortByStates = [sortByDate, sortByCompleted, sortByRating] as const;
type OptionToValue<U> = U extends {
  value: infer Value;
}
  ? Value
  : never;
type OptionsToValues<Us> = Us extends readonly [infer head, ...infer tail]
  ? OptionToValue<head> | OptionsToValues<tail>
  : never;
type AccessState = OptionsToValues<typeof accessStates>;
type SortOrder = OptionsToValues<typeof sortOrderStates>;
type SortBy = OptionsToValues<typeof sortByStates>;
const processCourses = (
  courses: CourseProp[],
  accessStateValue: AccessState,
  sortOrder: SortOrder,
  sortBy: SortBy
) => {
  const applySortBy = (list: CourseProp[]) => {
    if (sortBy === "completed") {
      return list.sort((a, b) => {
        return b.watched_count - a.watched_count;
      });
    }
    if (sortBy === "date") {
      const courseValue = (course: Course) => {
        return new Date(course.created_at).valueOf();
      };
      return list.sort((a, b) => {
        return courseValue(b) - courseValue(a);
      });
    }
    return list.sort((a, b) => {
      return b.average_rating_out_of_5 - a.average_rating_out_of_5;
    });
  };
  const applySortOrder = (list: CourseProp[]) => {
    if (sortOrder === "ascending") {
      return list.reverse();
    }
    return list;
  };
  const applyAccessValue = (list: CourseProp[]) => {
    if (accessStateValue === "all") {
      return list;
    }
    return list.filter((course) => course.access_state === accessStateValue);
  };
  return applySortOrder(applySortBy(applyAccessValue(courses.slice())));
};
const Home: NextPage<Props> = ({ courses, tags: _tags }) => {
  const [accessState, setAccessState] = useState<AccessState>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("descending");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const processedCourses = useMemo(
    () => processCourses(courses, accessState, sortOrder, sortBy),
    [courses, accessState, sortOrder, sortBy]
  );
  return (
    <div>
      <Head>
        <title>Egghead IO Courses</title>
      </Head>
      <nav>
        <div>
          <label htmlFor="access_state">Access State: </label>
          <select
            name="access_state"
            id="access_state"
            value={accessState}
            onChange={(event) => {
              setAccessState(event.target.value as AccessState);
            }}
          >
            {accessStates.map((accessState) => {
              return (
                <option value={accessState.value} key={accessState.value}>
                  {accessState.label}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="sort_order">Sort Direction: </label>
          <select
            name="sort_order"
            id="sort_order"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value as SortOrder);
            }}
          >
            {sortOrderStates.map((sortOrderState) => {
              return (
                <option value={sortOrderState.value} key={sortOrderState.value}>
                  {sortOrderState.label}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="sort_by">Sort By: </label>
          <select
            name="sort_by"
            id="sort_by"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value as SortBy);
            }}
          >
            {sortByStates.map((sortByState) => {
              return (
                <option value={sortByState.value} key={sortByState.value}>
                  {sortByState.label}
                </option>
              );
            })}
          </select>
        </div>
      </nav>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {processedCourses.map((course) => {
          const isFree = course.access_state === "free";
          return (
            <div
              key={course.slug}
              className="overflow-hidden rounded-md shadow-lg"
            >
              <div className="p-4 bg-neutral-200">
                <div className="flex overflow-x-auto overflow-y-hidden text-xl font-bold leading-6 hover:underline">
                  <Link href={`${EGGHEADIO_COURSES_URL}${course.slug}`}>
                    {course.title}
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-2 space-x-2 overflow-x-auto overflow-y-hidden leading-5">
                  <div className="font-bold hover:underline">
                    <Link href={`${EGGHEADIO_URL}${course.instructor.path}`}>
                      {course.instructor.full_name}
                    </Link>
                  </div>
                  <div className="text-base font-light leading-5">
                    Completed: {course.watched_count}x
                  </div>
                  <div className="text-base font-light leading-5">
                    Rating: {course.average_rating_out_of_5.toFixed(2)}
                  </div>
                  <div
                    className={clsx(
                      "font-semibold text-xs rounded bg-neutral-300 px-2 py-0.5",
                      isFree ? "bg-green-300" : "bg-blue-300"
                    )}
                  >
                    {isFree ? "Free" : "Pro"}
                  </div>
                </div>
                <div className="flex mt-2 space-x-2">
                  {course.tags.map((tag) => {
                    return (
                      <div
                        key={tag.name}
                        className="font-semibold text-xs rounded bg-neutral-300 px-2 py-0.5"
                      >
                        {tag.label}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 pt-0 overflow-auto">
                <div className="mt-4 prose-sm prose prose-blockquote:m-0 prose-blockquote:mt-2 prose-ul:m-0 prose-ul:mt-2 max-w-screen-2xl prose-headings:p-0 prose-h2:leading-5 prose-hr:m-0 prose-hr:mt-2 prose-headings:m-0 prose-headings:mt-2 prose-p:m-0 prose-p:mt-2 prose-h2:text-lg prose-img:m-0 prose-img:mt-2 prose-p:leading-5 prose-li:m-0 prose-li:leading-5">
                  <MDXRemote {...course.markdown} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
