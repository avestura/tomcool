import useSWR from "swr"

export const UserHashViewer = (props: {}) => {
  const { data, error } = useSWR('https://forums.trgwii.com/api/self/hash')

  if (error) return <i>failed to load</i>
  if (!data) return <i>loading...</i>
  return <>{JSON.stringify(data)}</>
}

export default UserHashViewer;