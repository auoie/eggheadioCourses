import { FC } from 'react'
import {
  GridItem,
  Link,
  VStack,
  HStack,
  Text,
  Badge,
  Heading,
  Wrap
} from '@chakra-ui/react'
import { Course } from '../types'

type CourseCardProps = {
  course: Course
}
const eggHeadioUrl = 'https://egghead.io'
const eggHeadioCoursesUrl = 'https://egghead.io/courses/'
const CourseCard: FC<CourseCardProps> = ({ course }) => {
  return (
    <GridItem
      key={course.slug}
      colSpan={1}
      borderRadius={'md'}
      className={'courseCard'}
      transitionDuration={'0.3s'}
      borderWidth={'1px'}
      boxShadow={'md'}
      overflow={'hidden'}
    >
      <VStack
        alignItems={'flex-start'}
        className={'courseCardTop'}
        padding={'4'}
      >
        <Link href={`${eggHeadioCoursesUrl}${course.slug}`}>
          <Heading className="courseCardHeading" size={'md'}>
            {course.title}
          </Heading>
        </Link>
        <HStack w="full" justifyContent={'space-between'}>
          <HStack>
            <Link href={`${eggHeadioUrl}${course.instructor.path}`}>
              <Heading className="courseCardHeading" size={'sm'}>
                {course.instructor.full_name}
              </Heading>
            </Link>
            <Text>{course.watched_count}x completed</Text>
            <Text>Rating: {course.average_rating_out_of_5.toFixed(2)}</Text>
          </HStack>
          {course.access_state === 'free' ? (
            <Badge colorScheme={'whatsapp'}>Free</Badge>
          ) : (
            <Badge colorScheme={'linkedin'}>Pro</Badge>
          )}
        </HStack>
        {course.tags.length !== 0 && (
          <Wrap spacing={2}>
            {course.tags.map((tag) => {
              return <Badge key={tag.name}>{tag.label}</Badge>
            })}
          </Wrap>
        )}
      </VStack>
      <Text padding={4}>
        {course.description !== null &&
          `${course.description.slice(0, 140)}...`}
      </Text>
    </GridItem>
  )
}
export default CourseCard
