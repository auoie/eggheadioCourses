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
    <div className={clsx('', className)} {...rest}>
      <div className="flex flex-col p-4">
        <div className="flex">
          <Link href={`${EGGHEADIO_COURSES_URL}${course.slug}`}>
            <a
              target="_blank"
              rel="noreferrer"
              className="text-xl font-bold leading-6 hover:opacity-50 transition duration-300"
            >
              {course.title}
            </a>
          </Link>
        </div>
        <div className="mt-2">
          <div className="flex">
            <Link href={`${EGGHEADIO_URL}${course.instructor.path}`}>
              <a
                target="_blank"
                rel="noreferrer"
                className="font-semibold hover:opacity-50 transition duration-300"
              >
                {course.instructor.full_name}
              </a>
            </Link>
          </div>
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
        <div className="flex flex-wrap space-x-2 mt-2">
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
        {course.description?.length !== undefined &&
          course.description.length > 0 && (
            <article className="prose dark:prose-invert max-w-full mt-2">
              <MDXRemote {...markdown} components={{ img: MdImage }} />
            </article>
          )}
      </div>
    </div>
  );
};
