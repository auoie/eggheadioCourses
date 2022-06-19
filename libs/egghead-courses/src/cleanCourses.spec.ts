import { cleanCourses } from './cleanCourses';
import { Course, Tag } from './parseCoursesPage';
describe('eggheadCourses', () => {
  it('remove tag with duplicate name', () => {
    const aTag: Tag = { image_url: '', label: 'a', name: 'a' };
    const bTag: Tag = { image_url: '', label: 'a', name: 'b' };
    const course: Course = {
      access_state: '',
      average_rating_out_of_5: 0,
      created_at: '',
      description: '',
      image_thumb_url: '',
      instructor: { full_name: '', id: 0, path: '' },
      path: '',
      slug: '',
      tags: [aTag, aTag, bTag],
      title: '',
      watched_count: 0,
    };
    const result = cleanCourses([course])[0];
    const expected: Course = { ...course, tags: [aTag, bTag] };
    expect(result).toEqual(expected);
  });
});
