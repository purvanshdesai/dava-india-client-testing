import { useQuery } from '@tanstack/react-query'
import { fetchCategories, fetchCategory } from '../actions/categoryActions'

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ['find-categories'],
    queryFn: () => fetchCategories()
  })
}

export const useFetchCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['find-category', categoryId],
    queryFn: () => fetchCategory(categoryId)
  })
}
