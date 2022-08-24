import React, { useEffect, useState } from 'react';
import '../css/Chat.css';
import { io } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';


const socket = io('https://testing-back223.herokuapp.com/');


  function Chat() {

    // messages, user, show
    const [user, setUser] = useState('');
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgList, setMsgList] = useState([]);

    //rooms
    const [room, setRoom] = useState('');
    const [roomList, setRoomList] = useState([]);
    const [roomValiList, setRoomValiList] = useState([]);
    const [roomNow, setRoomNow] = useState('');
    const [currentRoom, setCurrentRoom] = useState('');



    // function to Join the main chat page only if have an username
    const joinChat = () => {

      if (user !== '') {
        setShow(true);

        socket.emit('all_room');
        alert('join or create room to be able to send messages!')

      }
    }


    // Function to send a message only if your message is not empty and only if you are in a room!
    const sendMsg = async () => {

      if (msg !== '' && roomNow !== '') {

        const msgData = {
          message: msg,
          time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
          author: user,
          area: roomNow

        }

        await socket.emit('send_message', msgData);
        setMsgList((list) => [...list, msgData]);


      }
      else if (roomNow === '') {
        alert('ERROR: You need to be in a room to send a message!');
      }
      else if (msg === '') {
        alert('ERROR: can not send empty message!')
      }
    };


    // UseEffect to listen to emits from the back-end.
    useEffect(() => {

      // updates the list
      socket.on('rec_message', (data) => {
        console.log(data);
        setMsgList((list) => [...list, data]);

      })


      // updates the list
      socket.on('send_room', (data) => {
        console.log(data);
        setRoomList((list) => [...list, data]);

      })

      // Joins and empty the current message chat box.
      socket.on('joined_room', (data) => {
        setRoomNow(data);
        console.log(data);
        setMsgList([]);

      })


      // calls on function to update the list and reset the useState.
      socket.on('deleted_room', (data) => {
        delOne(data);
        setMsgList([]);
      })

      // listens and fills current useState with all rooms from backend database.
      socket.on('gotall_room', (allRooms) => {

        console.log("room list loaded");
        setRoomList(allRooms);

      })

      // fills eseState with all room names.
      socket.on('gotall_names', (allNames) => {

        console.log("room list loaded");
        setRoomValiList(allNames);

      })


      return () => {
        socket.off("rec_room");
        socket.off("send_room");
        socket.off("joined_room");
        socket.off("deleted_room");
        socket.off("gotall_room");
        socket.off("gotall_names");

      }


    }, []);




    // function for updating list after deleting one room. 
    const delOne = (data) => {

      setRoomList(prev => prev.filter(rooms => rooms.name !== data));
      setRoomValiList(prev => prev.filter(rooms => rooms.name !== data));
      setRoomNow('');
      alert(`All conenctions to room: ${data} lost`)

    }




    // function creates new room object only if input is not empty and room not already exist.

    const createRoom = () => {

      const test = [];
      roomValiList.forEach((item) => { test.push(item.name) })

      // validates room name.
      if (room != '' && !test.includes(room)) {

        const roomData = {
          creator: user,
          name: room
        }

        const roomVali = { name: room }


        socket.emit('send_room', roomData);
        setRoomList((list) => [...list, roomData]);
        setRoomValiList((list) => [...list, roomVali]);
        roomValiList.forEach((item) => { test.push(item.name) })
      }
      else {
        alert(`Error, can't create, name already exists, pick new room name`)
      }

    }


    // select and join selected room.
    const selectRoom = (id) => {
      setRoomNow(room);


      socket.emit('join_room', id)
      alert(`You have joined the room: ${id}!`);
    }


    // func to delete selected room and send for backend.
    const deleteRoom = (data) => {
      socket.emit('delete_room', data)

    }



    // HTML with some logic.

    return (
      <div>
        {!show ? (<div>
          <h1>enter username to start!</h1>
          <input type="text" placeholder="your username...." onChange={(event) => { setUser(event.target.value) }} />
          <button onClick={joinChat}>ENTER</button>
        </div>) : (<div className="wholeChatt">



          <div id="messageBox">
            <ScrollToBottom className='scroll'>
              <h4 className="msgHeader"></h4>
              {msgList.map((msgContent) => {
                return (<div className='msg-boxes' id={user === msgContent.author ? 'you' : 'other'}>
                  <div className='content'><p>{msgContent.message}</p></div>
                  <div className='content-meta'>
                    <p>{msgContent.time}</p>
                    <p>{msgContent.author}</p>
                  </div>

                </div>);
              })}

            </ScrollToBottom>
          </div>

          <div id="sendForm">
            <label>Message:</label>
            <input type="text" id="messageId" placeholder="write your message..." onChange={(event) => { setMsg(event.target.value) }} />
            <button className="send" onClick={sendMsg}>SEND</button>
          </div>





          <div className="addRoom">
            <label>Create room:</label>
            <br></br>
            <input type='text' placeholder='...' onChange={(event) => { setRoom(event.target.value) }}></input>
            <button className="sendRoom" onClick={createRoom}>Add</button>
          </div>


          <div className="allRooms">
            <ScrollToBottom className="scrollForRooms">
              <h6 className="roomContainer">ROOMS:</h6>
              {roomList.map((rooms) => {
                return (<div className="roomArea">
                  <h4 className="roomClick" onClick={() => { selectRoom(rooms.name) }}>{rooms.name}</h4>
                  <button className="delete" onClick={() => { deleteRoom(rooms.name) }}>X</button>

                </div>);
              })}
            </ScrollToBottom>

          </div>








        </div>)}

      </div>
    );
  }

export default Chat;