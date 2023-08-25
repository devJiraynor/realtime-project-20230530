import React, { useEffect, useState } from 'react';
import './App.css';
import { socket } from './utils/socket';


function App() {

  const [room, setRoom] = useState<string>('');
  const [roomFlag, setRoomFlag] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [messageList, setMessageList] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const onJoinButtonHandler = () => {
    socket.emit('join', room);
    setRoomFlag(true);
  }

  const onEmitButtonHandler = () => {
    socket.emit('send', { nickname, message });
  }

  const onReceive = (data: any) => {
    const newMessageList = messageList.map(message => message);
    newMessageList.push(data);
    setMessageList(newMessageList);
  }

  socket.on('receive', onReceive);

  let effectFlag = false;

  useEffect(() => {
    if (effectFlag) return;
    effectFlag = true;

    const onConnected = () => {
      console.log(socket.id);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    }

    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnect);
  }, [])

  return (
    <div>
      { roomFlag ? (
        <></>
      ) : (
        <div>
            <input onChange={(event) => setRoom(event.target.value)} />
            <button onClick={onJoinButtonHandler}>조인</button>
        </div>
      ) }
      
      <input onChange={(event) => setNickname(event.target.value)} />
      <input onChange={(event) => setMessage(event.target.value)} />
      <button onClick={onEmitButtonHandler}>전송</button>
      <div>
        {messageList.map(message => <div>{message.nickname} {message.message}</div>)}
      </div>
    </div>
  );
}

export default App;
