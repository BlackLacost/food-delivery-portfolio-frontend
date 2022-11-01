declare global {
  interface Window {
    acceptOrder: (orderId: number) => void
  }
}

export {}
