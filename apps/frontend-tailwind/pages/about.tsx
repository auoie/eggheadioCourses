import type { NextPage } from 'next';

type HomeProps = unknown;
const About: NextPage<HomeProps> = () => {
  return (
    <div className="max-w-[180rem] mx-auto">
      <div className="max-w-full mx-4 pt-20">
        <div className="bg-white shadow-md rounded-md dark:bg-zinc-900 max-w-lg mx-auto p-4">
          <div className="prose dark:prose-invert prose-p:m-0 prose-p:leading-5 space-y-2 max-w-full">
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
    </div>
  );
};

export default About;
