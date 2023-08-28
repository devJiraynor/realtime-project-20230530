import React from 'react';
import './style.css';
import { usePathStore, useRoomStore } from '../../stores';

export default function Room() {

  const { setPath } = usePathStore();
  const { room, setRoom } = useRoomStore();

  return (
    <div id='room'>
      <div className='room-header'>
        <div className='room-number'>{room}</div>
        <div className='room-back-button'>뒤로가기</div>
      </div>
      <div className='room-container'></div>
      <div className='room-footer'></div>
    </div>
  )
}
