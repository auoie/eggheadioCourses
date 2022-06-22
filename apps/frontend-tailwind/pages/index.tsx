import { readFileSync } from 'fs';
import type { GetStaticProps, NextPage } from 'next';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useEffect, useMemo, useState } from 'react';
import type {
  BotResult,
  Course,
  Tag as TagType,
} from '@egghead/egghead-courses';
import { ResolveStaticPropsReturnType } from '../utils/typeUtils';
import { Pagination } from '../components/Pagination';
import { usePageReducer } from '../hooks/usePageReducer';
import { CourseCard } from '../components/CourseCard';
import { LabelSelect } from '../components/LabelSelect';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options } from 'rehype-pretty-code';

type CourseProp = {
  course: Course;
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
  const rehypePrettyCodeOptions: Partial<Options> = {
    theme: {
      theme: "css-variables"
    },
  };
  const coursesWithMarkdown = await Promise.all(
    courses.map(async (course) => {
      const mdxSource = await serialize(
        course.description ? course.description : '',
        {
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: course.description?.includes('```')
              ? [[rehypePrettyCode, rehypePrettyCodeOptions]]
              : [],
          },
        }
      );
      return { course, markdown: mdxSource };
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
const allAccessState = { value: 'all', label: '' } as const;
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
        return b.course.watched_count - a.course.watched_count;
      });
    }
    if (sortBy === 'date') {
      const courseValue = (course: Course) => {
        return new Date(course.created_at).valueOf();
      };
      return list.sort((a, b) => {
        return courseValue(b.course) - courseValue(a.course);
      });
    }
    return list.sort((a, b) => {
      const dif =
        b.course.average_rating_out_of_5 - a.course.average_rating_out_of_5;
      if (dif === 0) {
        return b.course.watched_count - a.course.watched_count;
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
    return list.filter(
      (course) => course.course.access_state === accessStateValue
    );
  };
  const filterByTag = (list: CourseProp[]) => {
    if (tag === '') {
      return list;
    }
    return list.filter((course) => {
      return course.course.tags.map((tagEntry) => tagEntry.name).includes(tag);
    });
  };
  return filterByTag(
    applySortOrder(applySortBy(applyAccessValue(courses.slice())))
  );
};
const Home: NextPage<HomeProps> = ({ courses, tags }) => {
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
  const numPages = Math.ceil(processedCourses.length / pageState.pageSize);
  return (
    <div className="max-w-[180rem] mx-auto">
      <div className="max-w-full mx-4 pt-20">
        <div className="bg-white shadow-md rounded-md dark:bg-zinc-900 max-w-lg mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex flex-col flex-1 p-6 pb-4 mx-auto space-y-1">
              <LabelSelect
                identification="access_state"
                setState={setAccessState}
                states={accessStates}
                value={accessState}
                title="Access State"
              />
              <LabelSelect
                identification="tag"
                setState={setTag}
                value={tag}
                states={[
                  { label: '', value: '' },
                  ...tags.map((tag) => ({
                    label: `${tag.tag.label} (${tag.count})`,
                    value: tag.tag.name,
                  })),
                ]}
                title="Tag"
              />
              <LabelSelect
                identification="sort_by"
                setState={setSortBy}
                states={sortByStates}
                value={sortBy}
                title="Sort By"
              />
              <LabelSelect
                identification="sort_order"
                setState={setSortOrder}
                states={sortOrderStates}
                value={sortOrder}
                title="Sort Direction"
              />
              <LabelSelect
                identification="page_size"
                setState={setPageSize}
                states={pageSizeStates}
                value={pageSize}
                title="Page Size"
              />
            </div>
          </div>
          <div className="max-w-full h-px dark:bg-zinc-800 bg-zinc-200 mt-2 mb-4"></div>
          <div className="text-center">
            <div className="px-5 pb-3">
              <div className="text-center m-1 whitespace-nowrap">
                Items {(pageState.pageNumber - 1) * pageState.pageSize + 1}{' '}
                through{' '}
                {Math.min(
                  processedCourses.length,
                  pageState.pageSize * pageState.pageNumber
                )}{' '}
                out of {processedCourses.length}
              </div>
              <Pagination
                page={[pageState, dispatchPage]}
                numPages={numPages}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 m-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {processedCourses
          .slice(
            (pageState.pageNumber - 1) * pageState.pageSize,
            pageState.pageSize * pageState.pageNumber
          )
          .map((courseProp) => {
            const course = courseProp.course;
            return (
              <CourseCard
                course={course}
                markdown={courseProp.markdown}
                key={course.slug}
                className="bg-white shadow-md dark:bg-zinc-900 rounded-md grid-cols-1 overflow-hidden"
              />
            );
          })}
      </div>
    </div>
  );
};

export default Home;
