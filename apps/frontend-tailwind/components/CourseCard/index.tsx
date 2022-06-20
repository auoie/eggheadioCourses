import type { Course } from '@egghead/egghead-courses';
import clsx from 'clsx';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Link from 'next/link';
import type { FC } from 'react';
import { Badge } from '../Badge';
import MdImage from '../MdImage';

export interface CourseCardProps {
  course: Course;
  markdown: MDXRemoteSerializeResult<Record<string, unknown>>;
}
const EGGHEADIO_URL = 'https://egghead.io';
const EGGHEADIO_COURSES_URL = 'https://egghead.io/courses/';
export const CourseCard: FC<JSX.IntrinsicElements['div'] & CourseCardProps> = ({
  className,
  children,
  course,
  markdown,
  ...rest
}) => {
  const isFree = course.access_state === 'free';
  return (
    <div
      className={clsx(
        '',
        className
      )}
      {...rest}
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
          <Badge color={isFree ? 'green' : 'blue'}>
            {isFree ? 'Free' : 'Pro'}
          </Badge>
          {course.tags.map((tag) => {
            return (
              <Badge color="plain" key={tag.name}>
                {tag.label}
              </Badge>
            );
          })}
        </div>
        <div className="prose dark:prose-invert prose-blockquote:m-0 prose-blockquote:mt-2 prose-ul:m-0 prose-ul:mt-2 max-w-screen-2xl prose-headings:p-0 prose-h2:leading-5 prose-hr:m-0 prose-hr:mt-2 prose-headings:m-0 prose-headings:mt-2 prose-p:m-0 prose-p:mt-2 prose-h2:text-lg prose-img:m-0 prose-img:mt-2 prose-p:leading-5 prose-li:m-0 prose-li:leading-5">
          <MDXRemote {...markdown} components={{ img: MdImage }} />
        </div>
      </div>
    </div>
  );
};
