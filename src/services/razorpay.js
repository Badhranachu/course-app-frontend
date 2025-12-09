export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay script'))
    document.body.appendChild(script)
  })
}

export function handleRazorpayPayment({ order_id, amount, currency, key_id, name, description }) {
  return new Promise((resolve, reject) => {
    const options = {
      key: key_id,
      amount: amount,
      currency: currency,
      name: 'Bekola',
      description: description || name,
      order_id: order_id,
      handler: function (response) {
        resolve(response)
      },
      prefill: {
        // You can prefill user details here if needed
      },
      theme: {
        color: '#6366f1'
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled'))
        }
      }
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  })
}

