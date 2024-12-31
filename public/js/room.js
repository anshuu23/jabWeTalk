const socket = io()
const room = '<%= room %>'

      let map = <%- JSON.stringify(messages) %>
      const msgInput = document.querySelector("#inputMsg")
      const button = document.querySelector("#btn")
      const displayMsg = document.querySelector("#displayMsg")
      const notificationBar = document.querySelector("#notificationBar")
      const peopleInRoom = document.querySelector("#peopleInRoom")
      
      const user = <%- JSON.stringify(user) %>
        console.log(map)
        if(map){
                map.forEach(msgBlockFromBackend => {
                if (user.id == msgBlockFromBackend.userId){
                  let msgStatus = "send"
                if(msgBlockFromBackend.messageStatus){
                  msgStatus = "seen"
                }
                displayMsg.innerHTML += `<div class="wrapper wrapperSelf">
                <div class="userMsgBlock userMsgBlockSelf" >
                <div class="userMsgBlockName">${msgBlockFromBackend.userName}</div>

                <div class="userMsgBlockMsg">${msgBlockFromBackend.message}</div>
                <div class="userMsgBlockTime">${msgBlockFromBackend.time} <div id="${msgBlockFromBackend.messageId}" class="msgStatus">${msgStatus}</div></div>

                </div>
                </div>`
                displayMsg.scrollTop = displayMsg.scrollHeight;
                }
                else{
                displayMsg.innerHTML += `<div class="wrapper ">
              <div class="userMsgBlock " >
              <div class="userMsgBlockName">${msgBlockFromBackend.userName}</div>
          <div class="userMsgBlockMsg">${msgBlockFromBackend.message}</div>
          <div class="userMsgBlockTime">${msgBlockFromBackend.time}</div>
          </div>
          </div>`

          displayMsg.scrollTop = displayMsg.scrollHeight;
          const messageId = msgBlockFromBackend.messageId
          const userId = msgBlockFromBackend.userId
          socket.emit("messageStatusSeen", { room, messageId, userId })
              }
          });
        }

      
      
      console.log(user)
      socket.emit("joined-room", { user, room })
      socket.emit("HowManyUsersInRoom", room)

      button.addEventListener("click", sendBtnClicked)

      let isKeyPressed = false;

      window.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !isKeyPressed) {
              isKeyPressed = true; // Mark key as pressed
              sendBtnClicked();
          }
      });

      window.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
              isKeyPressed = false; // Reset key press state
          }
      });
      socket.on("newUserJoinedMessage", (name) => {
          notificationBar.innerHTML = `<p><b>${name}</b> joined the chat<p>`
            setTimeout(()=>{
              notificationBar.innerHTML = ``
            },2000)

      })
      socket.on("userDisconnected", (name) => {
          notificationBar.innerHTML = `<p> <b>${name}</b> has left the chat<p>`
            setTimeout(()=>{
              notificationBar.innerHTML = ``
            },2000)
      })

      socket.on("userMessage", ({ userName, message, messageId, userId ,time}) => {
          displayMsg.innerHTML += `<div class="wrapper ">
              <div class="userMsgBlock " >
          <div class="userMsgBlockName">${userName}</div>
          <div class="userMsgBlockMsg">${message}</div>
          <div class="userMsgBlockTime">${time}</div>
          </div>
          </div>`

          displayMsg.scrollTop = displayMsg.scrollHeight;

          socket.emit("messageStatusSeen", { room, messageId, userId})
      })
      let typingTimeout;
      window.addEventListener("keypress", () => {
          socket.emit("someoneIsTyping", room)
          clearTimeout(typingTimeout);

          typingTimeout = setTimeout(() => {
              socket.emit("stoppedTyping", room);


          }, 2000);


      })

      socket.on("someoneIsTyping", (name) => {
          notificationBar.innerHTML = `<p> <b>${name}</b> is typing...<p>`

      })

      socket.on("stoppedTyping", () => {
          notificationBar.innerHTML = "";
      });

      socket.on("thisManyUsersInRoom", (data) => {
          if (data.room == room) peopleInRoom.innerHTML = data.usersInRoom
      })

      socket.on("messageStatus", (messageId) => {
          let msgBlockToUpdate = document.querySelector(`#${messageId}`)
          msgBlockToUpdate.innerHTML = "send"
      })

      socket.on("messageStatusSeen", (messageId, userId) => {
          console.log(messageId, userId)
          if (userId == user.id) {
              let msgBlockToUpdate = document.querySelector(`#${messageId}`)
              msgBlockToUpdate.innerHTML = "seen"
          }
      })


      function generateMessageId() {
          const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
          return `id_${id}`
      }



      function sendBtnClicked() {
          const msgToSend = msgInput.value;
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const time = `${hours}:${minutes}`
          if (!msgToSend) {
              return
          }
          const messageId = generateMessageId();
          socket.emit("send-message", { room, message: msgToSend, messageId ,time })
          displayMsg.innerHTML += `<div class="wrapper wrapperSelf">
              <div class="userMsgBlock userMsgBlockSelf" >
          <div class="userMsgBlockName">${user.name}</div>

          <div class="userMsgBlockMsg">${msgToSend}</div>
          <div class="userMsgBlockTime">${time} <div id="${messageId}" class="msgStatus"></div></div>

          </div>
          </div>`

          displayMsg.scrollTop = displayMsg.scrollHeight;
          msgInput.value = ''
      }