import { readFileSync } from 'fs';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { join } from 'path';
import clsx from 'clsx';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import MdImage from '../components/MdImage';
import { useEffect, useMemo, useState } from 'react';
import type {
  BotResult,
  Course,
  Tag as TagType,
} from '@egghead/egghead-courses';
import { useTheme } from 'next-themes';
import { ResolveStaticPropsReturnType } from '../utils/typeUtils';
import { Pagination } from '../components/Pagination';
import { usePageReducer } from '../hooks/usePageReducer';

type CourseProp = Course & {
  markdown: MDXRemoteSerializeResult<Record<string, unknown>>;
};
const getHomeProps = async () => {
  const coursesPath = join(process.cwd(), '_courses', 'cleanCourses.json');
  const botResult = JSON.parse(readFileSync(coursesPath, 'utf8')) as BotResult;
  const courses = botResult.courses.slice(0);
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
        course.description ? course.description : ''
      );
      return { ...course, markdown: mdxSource };
    })
  );
  const tags = Array.from(distinctTags)
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .map((tag) => ({
      tag: tagObjects.get(tag) as TagType,
      count: tagCounts.get(tag) as number,
    }));
  const result = {
    props: {
      courses: coursesWithMarkdown,
      tags,
      lastFetched: botResult.time,
    },
  };
  return result;
};
type HomeProps = ResolveStaticPropsReturnType<typeof getHomeProps>;
export const getStaticProps: GetStaticProps<HomeProps> = async (_context) => {
  return await getHomeProps();
};
const EGGHEADIO_URL = 'https://egghead.io';
const EGGHEADIO_COURSES_URL = 'https://egghead.io/courses/';
const allAccessState = { value: 'all', label: 'All' } as const;
const freeAccessState = { value: 'free', label: 'Free' } as const;
const proAccessState = { value: 'pro', label: 'Pro' } as const;
const accessStates = [allAccessState, freeAccessState, proAccessState] as const;
const descendingState = { value: 'descending', label: 'Descending' } as const;
const ascendingState = { value: 'ascending', label: 'Ascending' } as const;
const sortOrderStates = [descendingState, ascendingState] as const;
const pageSize60 = { value: 60, label: '60' } as const;
const pageSize120 = { value: 120, label: '120' } as const;
const pageSizeAll = { value: 'all', label: 'All' } as const;
const pageSizeStates = [pageSize60, pageSize120, pageSizeAll] as const;
const sortByDate = { value: 'date', label: 'Date' } as const;
const sortByCompleted = {
  value: 'completed count',
  label: 'Completed',
} as const;
const sortByRating = { value: 'rating', label: 'Rating' } as const;
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
type PageSize = OptionsToValues<typeof pageSizeStates>;
type SortBy = OptionsToValues<typeof sortByStates>;
const processCourses = (
  courses: CourseProp[],
  accessStateValue: AccessState,
  sortOrder: SortOrder,
  sortBy: SortBy,
  tag: string
) => {
  const applySortBy = (list: CourseProp[]) => {
    if (sortBy === 'completed count') {
      return list.sort((a, b) => {
        return b.watched_count - a.watched_count;
      });
    }
    if (sortBy === 'date') {
      const courseValue = (course: Course) => {
        return new Date(course.created_at).valueOf();
      };
      return list.sort((a, b) => {
        return courseValue(b) - courseValue(a);
      });
    }
    return list.sort((a, b) => {
      const dif = b.average_rating_out_of_5 - a.average_rating_out_of_5;
      if (dif === 0) {
        return b.watched_count - a.watched_count;
      }
      return dif;
    });
  };
  const applySortOrder = (list: CourseProp[]) => {
    if (sortOrder === 'ascending') {
      return list.reverse();
    }
    return list;
  };
  const applyAccessValue = (list: CourseProp[]) => {
    if (accessStateValue === 'all') {
      return list;
    }
    return list.filter((course) => course.access_state === accessStateValue);
  };
  const filterByTag = (list: CourseProp[]) => {
    if (tag === '') {
      return list;
    }
    return list.filter((course) => {
      return course.tags.map((tagEntry) => tagEntry.name).includes(tag);
    });
  };
  return filterByTag(
    applySortOrder(applySortBy(applyAccessValue(courses.slice())))
  );
};
const colorModes = ['system', 'light', 'dark'] as const;
type ColorMode = typeof colorModes[number];
const Home: NextPage<HomeProps> = ({ courses, tags, lastFetched }) => {
  const [accessState, setAccessState] = useState<AccessState>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('descending');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [tag, setTag] = useState('');
  const [pageSize, setPageSize] = useState<PageSize>(60);
  const processedCourses = useMemo(
    () => processCourses(courses, accessState, sortOrder, sortBy, tag),
    [courses, accessState, sortOrder, sortBy, tag]
  );
  const { pageState, dispatchPage } = usePageReducer(
    pageSize === 'all' ? processedCourses.length : pageSize
  );
  useEffect(() => {
    dispatchPage({ type: 'start' });
  }, [processedCourses, dispatchPage]);
  useEffect(() => {
    dispatchPage({
      type: 'set page size',
      pageSize: pageSize === 'all' ? courses.length : pageSize,
    });
  }, [pageSize, courses.length, dispatchPage]);
  const { theme, setTheme } = useTheme();
  const numPages = Math.ceil(processedCourses.length / pageState.pageSize);
  const lastFetchedDate = new Date(lastFetched);
  return (
    <div className="max-w-[180rem] mx-auto">
      <Head>
        <title>Egghead IO Courses</title>
      </Head>
      <div className="mx-4 sm:grid sm:grid-cols-2">
        <nav className="flex flex-col flex-wrap justify-center p-4 mx-auto my-4 bg-white shadow-lg rounded-md dark:bg-zinc-950 border dark:border-zinc-700 sm:px-6 sm:grid-cols-1">
          <div className="mx-auto mb-2 text-xl font-bold">
            Egghead IO Courses
          </div>
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
            <label htmlFor="tag">Tag: </label>
            <select
              name="tag"
              id="tag"
              value={tag}
              onChange={(event) => {
                setTag(event.target.value);
              }}
            >
              <option value={''}></option>
              {tags.map((tag) => {
                return (
                  <option value={tag.tag.name} key={tag.tag.name}>
                    {tag.tag.label} ({tag.count})
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
                  <option
                    value={sortOrderState.value}
                    key={sortOrderState.value}
                  >
                    {sortOrderState.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="page_size">Page Size: </label>
            <select
              name="page_size"
              id="page_size"
              value={pageSize}
              onChange={(event) => {
                setPageSize(event.target.value as PageSize);
              }}
            >
              {pageSizeStates.map((pageSize) => {
                return (
                  <option key={pageSize.value} value={pageSize.value}>
                    {pageSize.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="theme">Theme: </label>
            {theme !== undefined ? (
              <select
                name="theme"
                id="theme"
                value={theme}
                onChange={(event) => {
                  setTheme(event.target.value as ColorMode);
                }}
              >
                {colorModes.map((color) => {
                  return (
                    <option value={color} key={color}>
                      {color}
                    </option>
                  );
                })}
              </select>
            ) : (
              'Loading theme...'
            )}
          </div>
        </nav>
        <article className="p-4 mx-auto my-4 space-y-2 prose bg-white shadow-lg rounded-md dark:bg-zinc-950 border dark:border-zinc-700 dark:prose-invert sm:px-6 prose-p:m-0 prose-p:leading-5 sm:grid-cols-1">
          <p>
            This is a static website. It parses the contents of{' '}
            <a href="https://egghead.io/courses">egghead.io/courses</a> and
            displays the results here. The courses were last fetched on{' '}
            {lastFetchedDate.toUTCString()}. It uses{' '}
            <a href="https://nextjs.org/">Next.js</a> to render the initial
            state and <a href="https://tailwindcss.com/">Tailwind CSS</a> for
            styling. The current color theme is{' '}
            {theme === undefined ? 'loading' : theme}.
          </p>
          <p>
            Each course has a labelled access type of free or pro.{' '}
            {accessState === 'all'
              ? 'An access type has not been specified.'
              : `The ${accessState} access type has been specified.`}
          </p>
          <p>
            The courses are being sorted by {sortBy} in {sortOrder} order.
          </p>
          <p>
            {processedCourses.length}
            {processedCourses.length === 1 ? ' course has ' : ' courses have '}
            been found satisfying the specified criteria.
          </p>
        </article>
      </div>
      <div className="text-center">
        <div className="sm:inline-block p-4 mx-4 bg-white shadow-lg rounded-md dark:bg-zinc-950 border dark:border-zinc-700">
          <div className="text-center">
            Showing items {(pageState.pageNumber - 1) * pageState.pageSize + 1}{' '}
            through{' '}
            {Math.min(
              processedCourses.length,
              pageState.pageSize * pageState.pageNumber
            )}
          </div>
          <Pagination
            page={[pageState, dispatchPage]}
            numPages={numPages}
            className="mt-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 m-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {processedCourses
          .slice(
            (pageState.pageNumber - 1) * pageState.pageSize,
            pageState.pageSize * pageState.pageNumber
          )
          .map((course) => {
            const isFree = course.access_state === 'free';
            return (
              <div
                key={course.slug}
                className="grid-cols-1 overflow-hidden bg-white shadow-xl dark:bg-zinc-950 border dark:border-zinc-700 rounded-md"
              >
                <div className="flex flex-col p-4 space-y-2 ">
                  <div className="flex overflow-x-auto overflow-y-hidden text-xl font-bold leading-6 hover:underline">
                    <Link href={`${EGGHEADIO_COURSES_URL}${course.slug}`}>
                      {course.title}
                    </Link>
                  </div>
                  <div className="">
                    <span className="font-bold hover:underline">
                      <Link
                        href={`${EGGHEADIO_URL}${course.instructor.path}`}
                        className="font-bold hover:underline"
                      >
                        {course.instructor.full_name}
                      </Link>
                    </span>
                    <br />
                    {course.watched_count}x completed
                    <span className="inline-flex items-center justify-center mx-1 select-none">
                      •
                    </span>
                    {course.average_rating_out_of_5.toFixed(2)} rating
                    <span className="inline-flex items-center justify-center mx-1 select-none">
                      •
                    </span>
                    {new Date(course.created_at).toLocaleDateString()}
                    <br />
                  </div>
                  <div className="flex flex-wrap space-x-2">
                    <div
                      className={clsx(
                        'font-semibold text-xs rounded px-2 py-1 uppercase whitespace-nowrap',
                        isFree
                          ? 'bg-green-100 dark:bg-green-600 text-green-600 dark:text-white'
                          : 'bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white'
                      )}
                    >
                      {isFree ? 'Free' : 'Pro'}
                    </div>
                    {course.tags.map((tag) => {
                      return (
                        <div
                          key={tag.name}
                          className="px-2 py-1 text-xs font-semibold uppercase rounded bg-zinc-200 text-zinc-600 dark:text-zinc-100 dark:bg-zinc-600 whitespace-nowrap"
                        >
                          {tag.label}
                        </div>
                      );
                    })}
                  </div>
                  <div className="prose dark:prose-invert prose-blockquote:m-0 prose-blockquote:mt-2 prose-ul:m-0 prose-ul:mt-2 max-w-screen-2xl prose-headings:p-0 prose-h2:leading-5 prose-hr:m-0 prose-hr:mt-2 prose-headings:m-0 prose-headings:mt-2 prose-p:m-0 prose-p:mt-2 prose-h2:text-lg prose-img:m-0 prose-img:mt-2 prose-p:leading-5 prose-li:m-0 prose-li:leading-5">
                    <MDXRemote
                      {...course.markdown}
                      components={{ img: MdImage }}
                    />
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
