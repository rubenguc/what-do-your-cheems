import { useState } from 'react'

export const useModal = (defaultValue = false) => {
  const [isOpenModal, setIsOpenModal] = useState(defaultValue)

  const onOpenModal = () => setIsOpenModal(true)
  const onCloseModal = () => setIsOpenModal(false)

  return {
    isOpenModal,
    onOpenModal,
    onCloseModal,
  }
}
