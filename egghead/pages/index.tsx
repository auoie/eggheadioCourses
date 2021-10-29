import type { GetStaticProps, NextPage } from 'next'
import {
  Button,
  Container,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { join } from 'path'
import { readFileSync } from 'fs'
import NavBar from '../src/components/Navbar'
import { useMemo, useState } from 'react'
import { Course, TagType } from '../src/types'
import Head from 'next/head'
import ThemeToggle from '../src/components/ThemeToggle'
import Fuse from 'fuse.js'
import CoursesGrid from '../src/components/CoursesGrid'
import { useDebouncedCallback } from 'use-debounce'
import Option from '../src/components/Option'

type Props = {
  courses: Course[]
  tags: {
    count: number
    tag: TagType
  }[]
}
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const dir = process.cwd()
  const coursesPath = join(dir, '..', 'bot', 'output', 'cleanCourses.json')
  const courses = (
    JSON.parse(readFileSync(coursesPath, 'utf8')) as Course[]
  ).slice(0)
  const distinctTags = new Set<string>()
  const tagObjects = new Map<string, TagType>()
  const tagCounts = new Map<string, number>()
  for (let i = 0; i < courses.length; i += 1) {
    const curTags = courses[i].tags
    for (let j = 0; j < curTags.length; j += 1) {
      const curTag = curTags[j]
      if (!distinctTags.has(curTag.name)) {
        distinctTags.add(curTag.name)
        tagObjects.set(curTag.name, curTag)
        tagCounts.set(curTag.name, 1)
      } else {
        tagCounts.set(curTag.name, (tagCounts.get(curTag.name) as number) + 1)
      }
    }
  }
  const tags = Array.from(distinctTags)
    .sort((a, b) => {
      const dif = (tagCounts.get(b) as number) - (tagCounts.get(a) as number)
      if (dif === 0) {
        return a.localeCompare(b)
      }
      return dif
    })
    .map((tag) => ({
      tag: tagObjects.get(tag) as TagType,
      count: tagCounts.get(tag) as number
    }))
  return {
    props: {
      courses,
      tags
    }
  }
}
export enum Sort {
  default,
  date,
  best,
  watchedCount,
  rating
}
export enum AccessType {
  default,
  free,
  pro
}
const Home: NextPage<Props> = ({ courses, tags }) => {
  const [sortBy, setSortBy] = useState(Sort.default)
  const [accessType, setAccessType] = useState(AccessType.default)
  const bgColor = useColorModeValue('white', 'black')
  const [search, setSearch] = useState('')
  const debouncedSetSearch = useDebouncedCallback(setSearch, 500)
  const processedCourses = useMemo(() => {
    const applySort = (list: Course[]) => {
      if (sortBy === Sort.default) {
        return list.sort((a, b) => {
          return b.watched_count - a.watched_count
        })
      }
      if (sortBy === Sort.best) {
        const courseValue = (course: Course) => {
          const views = course.watched_count
          const rating = course.average_rating_out_of_5
          return views / 500 ** (5 - rating)
        }
        return list.sort((a, b) => {
          return courseValue(b) - courseValue(a)
        })
      }
      if (sortBy === Sort.date) {
        const courseValue = (course: Course) => {
          return new Date(course.created_at).valueOf()
        }
        return list.sort((a, b) => {
          return courseValue(b) - courseValue(a)
        })
      }
      if (sortBy === Sort.rating) {
        return list.sort((a, b) => {
          const dif = b.average_rating_out_of_5 - a.average_rating_out_of_5
          if (dif === 0) {
            return b.watched_count - a.watched_count
          }
          return dif
        })
      }
      return list.sort((a, b) => {
        return b.watched_count - a.watched_count
      })
    }
    const applyAccessType = (list: Course[]) => {
      if (accessType === AccessType.free) {
        return list.filter((course) => course.access_state === 'free')
      }
      if (accessType === AccessType.pro) {
        return list.filter((course) => course.access_state === 'pro')
      }
      return list
    }
    const result = applyAccessType(applySort(courses.slice()))
    return result
  }, [sortBy, courses, accessType])
  const finalCourses = useMemo(() => {
    if (search.length < 3) {
      return processedCourses
    }
    const fuse = new Fuse(processedCourses, {
      keys: ['description'],
      isCaseSensitive: false,
      shouldSort: false
    })
    return fuse.search(search).map((value) => value.item)
  }, [search, processedCourses])
  return (
    <Container maxW={'container.xl'} py={4}>
      <Head>
        <title>Egghead IO Courses</title>
      </Head>
      <VStack spacing={4}>
        <NavBar>
          <HStack>
            <InputGroup>
              <Tooltip
                hasArrow
                label={'Search based on the course description'}
              >
                <InputLeftAddon>
                  <SearchIcon />
                </InputLeftAddon>
              </Tooltip>
              <Input
                borderLeftRadius={0}
                placeholder="search"
                onChange={(event) => {
                  debouncedSetSearch(event.target.value)
                }}
              />
            </InputGroup>
          </HStack>
          <Popover>
            <PopoverTrigger>
              <Button variant={'solid'}>Tags</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow bgColor={bgColor} />
              <PopoverBody>
                <SimpleGrid columns={2} spacing={2}>
                  {tags.map((tag) => (
                    <GridItem
                      key={tag.tag.name}
                      value={tag.tag.name}
                      colSpan={1}
                    >
                      <Button
                        variant={'link'}
                        justifyContent={'flex-start'}
                        w="full"
                      >
                        {tag.tag.label} ({tag.count})
                      </Button>
                    </GridItem>
                  ))}
                </SimpleGrid>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <HStack>
            <InputGroup>
              <Tooltip hasArrow label={'Sort the courses'}>
                <InputLeftAddon>
                  <Text>Sort</Text>
                </InputLeftAddon>
              </Tooltip>

              <Select
                onChange={(event) => {
                  setSortBy(Number(event.target.value) as Sort)
                }}
                borderLeftRadius={0}
                value={sortBy}
              >
                <Option value={Sort.default}>Default</Option>
                <Option value={Sort.date}>Date</Option>
                <Option value={Sort.best}>Best</Option>
                <Option value={Sort.watchedCount}>Completed</Option>
                <Option value={Sort.rating}>Rating</Option>
              </Select>
            </InputGroup>
          </HStack>

          <HStack>
            <InputGroup>
              <Tooltip hasArrow label={'Select the access type tier'}>
                <InputLeftAddon>
                  <Text>Tier</Text>
                </InputLeftAddon>
              </Tooltip>
              <Select
                onChange={(event) => {
                  setAccessType(Number(event.target.value) as AccessType)
                }}
                borderLeftRadius={0}
                value={accessType}
              >
                <Option value={AccessType.default}>Default</Option>
                <Option value={AccessType.free}>Free</Option>
                <Option value={AccessType.pro}>Pro</Option>
              </Select>
            </InputGroup>
          </HStack>
          <HStack justifyContent={'flex-end'}>
            <ThemeToggle />
          </HStack>
        </NavBar>
        <CoursesGrid courses={finalCourses.slice(0)} />
      </VStack>
    </Container>
  )
}

export default Home
