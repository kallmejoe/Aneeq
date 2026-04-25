export const useApi = () => {
  return $fetch.create({
    baseURL: "/api"
  })
}
