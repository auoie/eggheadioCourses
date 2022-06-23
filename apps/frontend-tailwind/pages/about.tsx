import type { NextPage } from 'next';
import Div100vh from 'react-div-100vh';

type AboutProps = unknown;
const About: NextPage<AboutProps> = () => {
  return (
    <Div100vh>
      <div className="max-w-full mx-4 pt-20">
        <div className="bg-white shadow-md rounded-md dark:bg-zinc-900 max-w-lg mx-auto p-4">
          <div className="prose dark:prose-invert max-w-full">
            <p>
              This is a static website. It parses the contents of{' '}
              <a href="https://egghead.io/courses">egghead.io/courses</a> and
              displays the results here. It uses{' '}
              <a href="https://nextjs.org/">Next.js</a> to render the initial
              state and <a href="https://tailwindcss.com/">Tailwind CSS</a> for
              styling.
            </p>
          </div>
        </div>
      </div>
    </Div100vh>
  );
};

export default About;
