'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getConsultation,
  getConsultations
} from '../actions/consultationActions'

export const useGetConsultation = (consultationId: string) => {
  return useQuery({
    queryKey: ['get-consultation'],
    queryFn: () => getConsultation(consultationId)
  })
}

export const useGetConsultationMutation = () => {
  return useMutation({
    mutationFn: ({ consultationId }: { consultationId: string }) =>
      getConsultation(consultationId)
  })
}

export const useGetConsultations = (query: any) => {
  return useQuery({
    queryKey: ['find-consultation', query],
    queryFn: () => getConsultations(query)
  })
}
