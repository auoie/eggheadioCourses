import { readFileSync } from "fs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { join } from "path";
import { Course, Tag as TagType } from "../../bot/src/parseCoursesPage";
import clsx from "clsx";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
type Props = {
  courses: (Course & {
    markdown: MDXRemoteSerializeResult<Record<string, unknown>>;
  })[];
  tags: {
    count: number;
    tag: TagType;
  }[];
};
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const dir = process.cwd();
  const coursesPath = join(dir, "..", "bot", "output", "cleanCourses.json");
  const courses = (
    JSON.parse(readFileSync(coursesPath, "utf8")) as Course[]
  ).slice(0, 200); // TODO Comment out
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
const eggHeadioUrl = "https://egghead.io";
const eggHeadioCoursesUrl = "https://egghead.io/courses/";
const Home: NextPage<Props> = ({ courses, tags }) => {
  return (
    <div>
      <Head>
        <title>Egghead IO Courses</title>
      </Head>
      <nav></nav>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-4">
        {courses.map((course) => {
          const isFree = course.access_state === "free";
          return (
            <div
              key={course.slug}
              className="shadow-lg rounded-md overflow-hidden"
            >
              <div className="bg-neutral-200 p-4">
                <div className="font-bold text-xl overflow-x-auto overflow-y-hidden hover:underline leading-6 flex">
                  <Link href={`${eggHeadioCoursesUrl}${course.slug}`}>
                    {course.title}
                  </Link>
                </div>
                <div className="flex overflow-x-auto overflow-y-hidden justify-between leading-5 items-center mt-2">
                  <div className="font-bold hover:underline">
                    <Link href={`${eggHeadioUrl}${course.instructor.path}`}>
                      {course.instructor.full_name}
                    </Link>
                  </div>
                  <div>{course.watched_count}x Completed</div>
                  <div>Rating: {course.average_rating_out_of_5.toFixed(3)}</div>
                  <div
                    className={clsx(
                      "font-semibold text-xs rounded bg-neutral-300 px-2 py-0.5",
                      isFree ? "bg-green-300" : "bg-blue-300"
                    )}
                  >
                    {isFree ? "Free" : "Pro"}
                  </div>
                </div>
                <div className="flex space-x-2 mt-2">
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
              <div className="overflow-auto p-4 pt-0">
                <div className="prose mt-4 prose-sm prose-headings:p-0 prose-headings:m-0 prose-headings:mt-2 prose-p:m-0 prose-p:mt-2 prose-h2:text-lg prose-img:m-0 prose-p:leading-5 prose-li:leading-5">
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
