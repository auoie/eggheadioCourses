import type { GetStaticProps, NextPage } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import Div100vh from 'react-div-100vh';
import rehypePrettyCode from 'rehype-pretty-code';

import type { ResolveStaticPropsReturnType } from '../utils/typeUtils';
import type { Options } from 'rehype-pretty-code';
import { MDXTheme } from '../components/MdxTheme';
import { botResult } from '../utils/getBotResult';

const ABOUT_MD_TEXT = `
This is a static website. It parses the contents of
[egghead.io/courses](https://egghead.io/courses) and
displays the results here. It uses
[Next.js](https://nextjs.org/) to render the initial
state and [Tailwind CSS](https://tailwindcss.com/) for
styling.
`;
const getAboutProps = async () => {
  const course = ABOUT_MD_TEXT;
  const rehypePrettyCodeOptions: Partial<Options> = {
    theme: {
      theme: 'css-variables',
    },
  };
  const mdxSource = await serialize(course ? course : '', {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: course?.includes('```')
        ? [[rehypePrettyCode, rehypePrettyCodeOptions]]
        : [],
    },
  });
  const buildTime = new Date().toISOString();
  const result = {
    props: {
      mdxSource,
      buildTime,
      fetchedTime: botResult.time,
    },
  };
  return result;
};
type AboutProps = ResolveStaticPropsReturnType<typeof getAboutProps>;
export const getStaticProps: GetStaticProps<AboutProps> = async (_context) => {
  return await getAboutProps();
};
const About: NextPage<AboutProps> = ({ mdxSource, buildTime, fetchedTime }) => {
  return (
    <Div100vh>
      <div className="max-w-full mx-4 pt-20">
        <div className="bg-white shadow-lg dark:shadow-zinc-950 rounded-md dark:bg-zinc-900 max-w-lg mx-auto p-4">
          <div className="prose dark:prose-invert max-w-full">
            <MDXTheme {...mdxSource} />
            <p>
              This was last built at {buildTime} and the courses were last
              fetched at {fetchedTime}.
            </p>
          </div>
        </div>
      </div>
    </Div100vh>
  );
};

export default About;
