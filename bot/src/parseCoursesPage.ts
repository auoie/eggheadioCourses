import { JSDOM } from "jsdom";
export type Tag = {
  name: string;
  label: string;
  image_url: string;
};
export type Course = {
  slug: string;
  title: string;
  average_rating_out_of_5: number;
  watched_count: number;
  path: string;
  description: string | null;
  access_state: string;
  created_at: string;
  tags: Tag[];
  image_thumb_url: string;
  instructor: {
    id: number;
    full_name: string;
    path: string;
  };
};

const parseCoursesPage = (coursesPage: string) => {
  const dom = new JSDOM(coursesPage);
  const scripts = dom.window.document.getElementsByTagName("script");
  const lastScript = scripts.item(scripts.length - 1);
  if (lastScript) {
    const json = JSON.parse(lastScript.innerHTML);
    const courses = json.props.pageProps.courses as Course[];
    return courses
  }
  return undefined
};
export default parseCoursesPage;
