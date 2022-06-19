import { FC, memo } from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import CourseCard from './CourseCard'
import { Course } from '../types'
type CoursesGridProps = {
  courses: Course[]
}
const CoursesGrid: FC<CoursesGridProps> = ({ courses }) => {
  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2,
        lg: 3
      }}
      spacing={4}
      className={'courseCardGrid'}
    >
      {courses.map((course) => {
        return <CourseCard key={course.slug} course={course} />
      })}
    </SimpleGrid>
  )
}
export default memo(CoursesGrid)
