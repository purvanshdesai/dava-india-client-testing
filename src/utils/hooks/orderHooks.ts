import { useQuery, useMutation } from '@tanstack/react-query'
import {
  cancelProduct,
  consultationOrder,
  createNewOrder,
  fetchOrderById,
  fetchOrders,
  fetchOrderTracking,
  returnProduct
} from '../actions/orderActions'

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createNewOrder
  })
}

export const useFetchOrders = (
  lastRefresh: number,
  params?: { page?: number; limit?: number; dateFilter?: string }
) => {
  return useQuery({
    queryKey: ['fetch-orders', lastRefresh, params?.page, params?.limit, params?.dateFilter],
    queryFn: () => fetchOrders(params)
  })
}

export const useFetchOrderById = (orderId: string, lastRefresh: number) => {
  return useQuery({
    queryKey: ['fetch-order-by-id', orderId, lastRefresh],
    queryFn: () => fetchOrderById(orderId)
  })
}

export const useFetchOrderTrackingById = ({
  orderId,
  orderTrackingId,
  lastOrderStatus
}: {
  orderId: string
  orderTrackingId: string
  lastOrderStatus?: string
}) => {
  return useQuery({
    queryKey: ['fetch-order-tracking-by-id', orderId, lastOrderStatus],
    queryFn: () => fetchOrderTracking({ orderId, orderTrackingId })
  })
}

export const useConsultationOrder = () => {
  return useMutation({
    mutationFn: consultationOrder
  })
}

export const useCancelProduct = () => {
  return useMutation({
    mutationFn: cancelProduct
  })
}

export const useReturnProduct = () => {
  return useMutation({
    mutationFn: returnProduct
  })
}
