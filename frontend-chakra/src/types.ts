
export type TagType = {
  name: string
  label: string
  image_url: string
}
export type Course = {
  slug: string
  title: string
  average_rating_out_of_5: number
  watched_count: number
  path: string
  description: string | null
  access_state: string
  created_at: string
  tags: TagType[]
  image_thumb_url: string
  instructor: {
    id: number
    full_name: string
    path: string
  }
}
