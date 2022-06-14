import { readFileSync } from "fs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { join } from "path";
import clsx from "clsx";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  Dispatch,
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import create from "zustand";

import type { Course, Tag as TagType } from "../../bot/src/parseCoursesPage";
import type { BotResult } from "../../bot/src/index";
import { usePagination } from "../hooks/usePagination";

type CourseProp = Course & {
  markdown: MDXRemoteSerializeResult<Record<string, unknown>>;
};
const getHomeProps = async () => {
  const dir = process.cwd();
  const coursesPath = join(dir, "..", "bot", "output", "cleanCourses.json");
  const botResult = JSON.parse(readFileSync(coursesPath, "utf8")) as BotResult;
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
        course.description ? course.description : ""
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
  return {
    props: {
      courses: coursesWithMarkdown,
      tags,
      lastFetched: botResult.time,
    },
  };
};
type ResolveStaticPropsReturnType<
  T extends (...args: any) => Promise<{ props: any }>
> = T extends (...args: any) => Promise<{ props: infer U }> ? U : never;
type HomeProps = ResolveStaticPropsReturnType<typeof getHomeProps>;

export const getStaticProps: GetStaticProps<HomeProps> = async (_context) => {
  return await getHomeProps();
};
const EGGHEADIO_URL = "https://egghead.io";
const EGGHEADIO_COURSES_URL = "https://egghead.io/courses/";
const allAccessState = { value: "all", label: "All" } as const;
const freeAccessState = { value: "free", label: "Free" } as const;
const proAccessState = { value: "pro", label: "Pro" } as const;
const accessStates = [allAccessState, freeAccessState, proAccessState] as const;
const descendingState = { value: "descending", label: "Descending" } as const;
const ascendingState = { value: "ascending", label: "Ascending" } as const;
const sortOrderStates = [descendingState, ascendingState] as const;
const pageSize60 = { value: 60, label: "60" } as const;
const pageSize120 = { value: 120, label: "120" } as const;
const pageSizeAll = { value: "all", label: "All" } as const;
const pageSizeStates = [pageSize60, pageSize120, pageSizeAll] as const;
const sortByDate = { value: "date", label: "Date" } as const;
const sortByCompleted = {
  value: "completed count",
  label: "Completed",
} as const;
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
    if (sortBy === "completed count") {
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
      const dif = b.average_rating_out_of_5 - a.average_rating_out_of_5;
      if (dif === 0) {
        return b.watched_count - a.watched_count;
      }
      return dif;
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
  const filterByTag = (list: CourseProp[]) => {
    if (tag === "") {
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

const colorModes = ["system", "light", "dark"] as const;
type ColorMode = typeof colorModes[number];
interface SettingState {
  setting: ColorMode | null;
  setSetting: (setting: ColorMode) => void;
}
const useSetting = create<SettingState>((set) => ({
  setting: null,
  setSetting: (setting) => set({ setting }),
}));
const update = () => {
  document.documentElement.classList.add("changing-theme");
  if (
    localStorage["theme"] === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  window.setTimeout(() => {
    document.documentElement.classList.remove("changing-theme");
  });
};
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
const useTheme = () => {
  const { setSetting, setting } = useSetting();
  const initial = useRef(true);
  useIsomorphicLayoutEffect(() => {
    let theme = localStorage["theme"] as unknown;
    if (theme === "light" || theme === "dark") {
      setSetting(theme);
    } else {
      setSetting("system");
    }
  }, [setSetting]);
  useIsomorphicLayoutEffect(() => {
    if (setting === "system") {
      localStorage.removeItem("theme");
    } else if (setting === "light" || setting === "dark") {
      localStorage["theme"] = setting;
    }
    if (initial.current) {
      initial.current = false;
    } else {
      update();
    }
  }, [setting]);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", update);
    const onStorage = () => {
      update();
      const theme = localStorage["theme"] as unknown;
      if (theme === "light" || theme === "dark") {
        setSetting(theme);
      } else {
        setSetting("system");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      mediaQuery.removeEventListener("change", update);
      window.removeEventListener("storage", onStorage);
    };
  }, [setSetting]);
  return [setting, setSetting] as const;
};
type PaginationProps = {
  page: [PageState, Dispatch<PageAction>];
  numPages: number;
};
const PaginationDiv: FC<
  JSX.IntrinsicElements["td"] & { clickable: boolean }
> = ({ className, children, clickable, ...props }) => {
  return (
    <div
      className={clsx(
        "w-8 h-7 justify-center items-center flex",
        clickable &&
          "hover:bg-zinc-700 rounded hover:text-zinc-100 hover:cursor-pointer hover:dark:bg-zinc-50 hover:dark:text-zinc-800",
        !clickable && "text-zinc-400 dark:text-zinc-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
const Pagination: FC<JSX.IntrinsicElements["div"] & PaginationProps> = ({
  page,
  numPages,
  className,
}) => {
  const [pageState, dispatchPage] = page;
  const paginationArray = usePagination({
    currentPage: pageState.pageNumber,
    numPages,
    siblingCount: 1,
  });
  return (
    <div
      className={clsx(
        "flex items-center justify-center font-bold select-none",
        className
      )}
    >
      <PaginationDiv
        onClick={() => {
          dispatchPage({ type: "decrement" });
        }}
        clickable={pageState.pageNumber !== 1}
      >
        {"<"}
      </PaginationDiv>
      {paginationArray.map((pageValue, idx) => {
        if (pageValue === null) {
          return (
            <PaginationDiv
              key={idx}
              className="text-zinc-400"
              clickable={false}
            >
              ...
            </PaginationDiv>
          );
        }
        const current = pageState.pageNumber === pageValue;
        return (
          <PaginationDiv
            onClick={() => {
              dispatchPage({ type: "set page", pageIndex: pageValue });
            }}
            clickable={!current}
            key={idx}
          >
            {pageValue}
          </PaginationDiv>
        );
      })}
      <PaginationDiv
        onClick={() => {
          dispatchPage({ type: "increment", numPages });
        }}
        clickable={pageState.pageNumber !== numPages}
      >
        {">"}
      </PaginationDiv>
    </div>
  );
};
interface PageState {
  pageSize: number;
  pageNumber: number;
}
type PageAction =
  | { type: "increment"; numPages: number }
  | { type: "decrement" }
  | { type: "set page"; pageIndex: number }
  | { type: "start" }
  | { type: "set page size"; pageSize: number };
const Home: NextPage<HomeProps> = ({ courses, tags, lastFetched }) => {
  const [accessState, setAccessState] = useState<AccessState>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("descending");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [tag, setTag] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>(60);
  const [theme, setTheme] = useTheme();
  const processedCourses = useMemo(
    () => processCourses(courses, accessState, sortOrder, sortBy, tag),
    [courses, accessState, sortOrder, sortBy, tag]
  )
  const [pageState, dispatchPage] = useReducer(
    (state: PageState, action: PageAction): PageState => {
      switch (action.type) {
        case "decrement":
          return {
            pageSize: state.pageSize,
            pageNumber: Math.max(state.pageNumber - 1, 1),
          };
        case "increment":
          return {
            pageSize: state.pageSize,
            pageNumber: Math.min(state.pageNumber + 1, action.numPages),
          };
        case "set page":
          return {
            pageSize: state.pageSize,
            pageNumber: action.pageIndex,
          };
        case "start":
          return {
            pageSize: state.pageSize,
            pageNumber: 1,
          };
        case "set page size":
          return {
            pageSize: action.pageSize,
            pageNumber: 1,
          };
      }
    },
    {
      pageSize: pageSize === "all" ? processedCourses.length : pageSize,
      pageNumber: 1,
    }
  );
  useEffect(() => {
    dispatchPage({ type: "start" });
  }, [processedCourses]);
  useEffect(() => {
    dispatchPage({
      type: "set page size",
      pageSize: pageSize === "all" ? courses.length : pageSize,
    });
  }, [pageSize, courses.length]);
  const numPages = Math.ceil(processedCourses.length / pageState.pageSize);
  const lastFetchedDate = new Date(lastFetched);
  return (
    <div className="max-w-[180rem] mx-auto">
      <Head>
        <title>Egghead IO Courses</title>
      </Head>
      <div className="m-4 my-4 sm:grid sm:grid-cols-2">
        <nav className="flex flex-col flex-wrap justify-center p-4 px-4 mx-auto my-4 bg-white shadow-lg rounded-2xl dark:bg-zinc-900 sm:px-6 sm:grid-cols-1">
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
              <option value={""}></option>
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
            {theme !== null ? (
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
              "Loading theme..."
            )}
          </div>
        </nav>
        <article className="p-4 mx-auto my-4 space-y-2 prose bg-white shadow-lg rounded-2xl dark:bg-zinc-900 dark:prose-invert sm:px-6 prose-p:m-0 prose-p:leading-5 sm:grid-cols-1">
          <p>
            This is a static website. It parses the contents of{" "}
            <a href="https://egghead.io/courses">egghead.io/courses</a> and
            displays the results here. The courses were last fetched on{" "}
            {lastFetchedDate.toUTCString()}. It uses{" "}
            <a href="https://nextjs.org/">Next.js</a> to render the initial
            state and <a href="https://tailwindcss.com/">Tailwind CSS</a> for
            styling. The current color theme is{" "}
            {theme === null ? "loading" : theme}.
          </p>
          <p>
            Each course has a labelled access type of free or pro.{" "}
            {accessState === "all"
              ? "An access type has not been specified."
              : `The ${accessState} access type has been specified.`}
          </p>
          <p>
            The courses are being sorted by {sortBy} in {sortOrder} order.
          </p>
          <p>
            {processedCourses.length}
            {processedCourses.length === 1 ? " course has " : " courses have "}
            been found satisfying the specified criteria.
          </p>
        </article>
      </div>
      <div className="block p-4 m-4 bg-white shadow-lg rounded-2xl dark:bg-zinc-900">
        <div className="flex items-center justify-center">
          Showing items {(pageState.pageNumber - 1) * pageState.pageSize + 1}{" "}
          through{" "}
          {Math.min(
            processedCourses.length,
            pageState.pageSize * pageState.pageNumber
          )}
        </div>
        <Pagination page={[pageState, dispatchPage]} numPages={numPages} className="mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-4 m-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {processedCourses
          .slice(
            (pageState.pageNumber - 1) * pageState.pageSize,
            pageState.pageSize * pageState.pageNumber
          )
          .map((course) => {
            const isFree = course.access_state === "free";
            return (
              <div
                key={course.slug}
                className="grid-cols-1 overflow-hidden bg-white shadow-xl dark:bg-zinc-900 rounded-2xl"
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
                        "font-semibold text-xs rounded px-2 py-1 uppercase whitespace-nowrap",
                        isFree
                          ? "bg-green-100 dark:bg-green-600 text-green-600 dark:text-green-100"
                          : "bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-blue-100"
                      )}
                    >
                      {isFree ? "Free" : "Pro"}
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
