import parse from "node-html-parser";
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

export const parseCoursesPage = (coursesPage: string) => {
  const dom = parse(coursesPage);
  const scripts = dom.getElementsByTagName("script");
  const lastScript = scripts.pop();
  if (lastScript) {
    const json = JSON.parse(lastScript.innerHTML);
    const courses = json.props.pageProps.courses as Course[];
    return courses;
  }
  return undefined;
};
