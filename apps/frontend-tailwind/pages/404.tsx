import type { NextPage } from 'next';
import Div100vh from 'react-div-100vh';

type Error404Props = unknown;
const Error404: NextPage<Error404Props> = () => {
  return (
    <Div100vh className="flex justify-center items-center">
      <div className="max-w-full mx-4 pt-10">
        <div className="prose dark:prose-invert">
          <h1 className="font-head font-extrabold">404 Not found</h1>
        </div>
      </div>
    </Div100vh>
  );
};

export default Error404;
