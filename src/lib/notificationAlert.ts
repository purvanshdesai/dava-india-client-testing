export const playNotificationSound = () => {
  const audio = new Audio('/sounds/bell-notification.mp3')
  audio
    .play()
    .then(() => console.log('Sound played'))
    .catch(err => console.error('Error playing sound:', err))
}
