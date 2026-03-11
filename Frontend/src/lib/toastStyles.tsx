import toast from 'react-hot-toast'

export const successToast = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    style: {
      background: '#fff',
      color: '#000',
      padding: '16px 24px',
      fontSize: '16px',
      minWidth: '300px',
      width: '100%',
      textAlign: 'left',
    }
  })
}

export const errorToast = (title: string, subtitle?: string) => {
  toast.error(
    subtitle ? `${title}\n${subtitle}` : title,
    {
      position: 'top-center',
      icon: null,
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px 5px',
        fontSize: '16px',
        minWidth: '230px',
        textAlign: 'left',
        whiteSpace: 'pre-line',  // makes \n work as line break
      }
    }
  )
}