import React from 'react'
import ClothingSelector from './ClothingSelector'
import Avatar from './Avatar'
import ClosetPresets from './ClosetPresets'

const AvatarSelectionPage = () => {
  return (
    <div className='flex justify-center flex-wrap gap-20'>
      <div>
      <ClothingSelector />
      <ClosetPresets />
      </div>
      <Avatar />
    </div>
  )
}

export default AvatarSelectionPage