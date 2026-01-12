'use client'
const supported_payments = ['razorpay']

export const SUPPORTED_PAYMENT_GATEWAY = {
  PAYU: 'payu',
  RAZORPAY: 'razorpay'
}

export function initializeRazorpay() {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'

    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }

    document.body.appendChild(script)
  })
}

const getPaymentGatewayData = (data: any) => {
  switch (data.paymentMode) {
    case 'razorpay':
      const formatAmount = data.payment_amount * 100
      return {
        paymentMode: 'razorpay',
        orderId: data.paymentOrderId,
        amount: formatAmount,
        currency: data.currency,
        name: data.name,
        description: data.description,
        onPaymentSuccess: (response: any) => {
          data.onPaymentSuccess(response)
        },
        onPaymentDismiss: function () {
          data.onPaymentDismiss()
        },
        onPaymentFailed: function () {
          data.onPaymentFailed()
        },
        prefill: {
          name: data.user?.name || 'Naveen'
        },
        loadingPaymentStatus: data.loadingPaymentStatus
      }
  }
}

const initRazaorpayPayment = async (data: any) => {
  const key = process.env.RAZORPAY_KEY ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY

  const options = {
    key,
    order_Id: data.orderId,
    amount: data.amount,
    currency: data.currency,
    name: data.name,
    description: data.description,
    redirect: false,
    handler: async (res: any) => {
      data.onPaymentSuccess(res)
    },
    modal: {
      ondismiss: () => {
        data.onPaymentDismiss()
      }
    },
    prefill: data.prefill,
    theme: {
      color: '#0084C0'
    }
  }

  const res = await initializeRazorpay()
  if (!res) {
    alert('Razorpay SDK Failed to load')
    return
  }
  const rzp = new window.Razorpay(options)

  //registe error handler
  rzp.on('payment.failed', () => {
    data.onPaymentFailed()
  })
  rzp.open()
  window.razorpay = rzp
}

const startPayment = (data: any) => {
  switch (data.paymentMode) {
    case 'razorpay':
      initRazaorpayPayment(data)
      break
  }
}

export const initiatePayment = (data: any) => {
  if (!supported_payments.includes(data.paymentMode)) {
    throw new Error('Payment gateway not supported')
  }
  const normalizedPaymentData = getPaymentGatewayData(data)
  startPayment(normalizedPaymentData)
}
