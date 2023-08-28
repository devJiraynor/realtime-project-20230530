import React, { useEffect, useState, ChangeEvent, useRef, KeyboardEvent } from 'react';
import './style.css';
import { usePathStore, useRoomStore, useUserStore } from '../../stores';
import { socket } from '../../utils/socket';
import { MessageDto } from '../../types';
import moment from 'moment';

//          component: 채팅방 컴포넌트          //
export default function Room() {

  //          state: Send Button Ref 상태          //
  const sendButtonRef = useRef<HTMLDivElement | null>(null);
  //          state: path 상태 변경 함수          //
  const { setPath } = usePathStore();
  //          state: room 상태 및 변경 함수          //
  const { room, setRoom } = useRoomStore();
  //          state: 사용자 정보 상태          //
  const { id, nickname } = useUserStore();
  //          state: 소켓 연결 상태          //
  const [isSocketConnected, setSocketConnected] = useState<boolean>(socket.connected);
  //          state: 메세지 상태          //
  const [message, setMessage] = useState<string>('');
  //          state: 메세지 리스트 상태          //
  const [messageList, setMessageList] = useState<MessageDto[]>([]);

  //          event handler: 메세지 값 변경 처리          //
  const onMessageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const message = event.target.value;
    setMessage(message);
  }
  //          event handler: Enter Key 누름 처리          //
  const onEnterKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!sendButtonRef.current) return;
    sendButtonRef.current.click();
  }

  //          event handler: 뒤로가기 버튼 클릭 처리          //
  const onBackButtonClickHandler = () => {
    setPath('/enter');
  }
  //          event handler: 전송 버튼 클릭 처리          //
  const onSendButtonClickHandler = () => {
    const datetime = moment().format('YYYY-MM-DD hh:mm:ss a');
    const data: MessageDto = { id, room, nickname, message, datetime };
    socket.emit('send', data);
    setMessage('');
  }
  //          event handler: Socket Receive 이벤트 처리          //
  const onReceiveHandler = (messageObject: MessageDto) => {
    const newMessageList = [...messageList];
    newMessageList.push(messageObject);
    setMessageList(newMessageList);
  }
  socket.on('receive', onReceiveHandler);

  //          effect: 첫 마운트 시 소켓 연결          //
  let effectFlag = true;
  useEffect(() => {
    if (!effectFlag) return;
    effectFlag = false;

    const onConnect = () => {
      console.log(socket.id);
      setSocketConnected(true);
    }

    const onDisconnect = () => {
      setSocketConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.emit('join', room);
  }, []);

  //          render: 채팅방 컴포넌트 render          //
  return (
    <div id='room'>
      <div className='room-header'>
        <div className='room-number'>{room}</div>
        <div className='room-back-button' onClick={onBackButtonClickHandler}>뒤로가기</div>
      </div>
      <div className='room-container'>
        { messageList.map(messageItem => <div>{`${messageItem.id} ${messageItem.message}`}</div>) }
      </div>
      <div className='room-footer'>
        <input className='room-send-input' type='text' value={message} onChange={onMessageChangeHandler} onKeyDown={onEnterKeyDownHandler} />
        <div ref={sendButtonRef} className='room-send-button' onClick={onSendButtonClickHandler}>전송</div>
      </div>
    </div>
  )
}
