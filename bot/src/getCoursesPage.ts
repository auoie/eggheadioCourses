import axios from "axios";
const url = "https://egghead.io/courses";
const getCoursesPage = async () => {
  const page = await axios.get<string>(url);
  if (page.status === 200) {
    return page.data;
  }
  throw new Error("egghead io courses page status not 200");
};
export default getCoursesPage;
