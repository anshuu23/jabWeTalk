const socket = io()

const msgInput = document.querySelector("#inputMsg")
  const button = document.querySelector("#btn")
  const displayMsg = document.querySelector("#displayMsg")
  const notificationBar = document.querySelector("#notificationBar")
  const chatOption = document.querySelector("#chatOption")
  const user = <%- JSON.stringify(user) %>;
  let sendersName = null ;
  
  let room = null;
  socket.emit("joined-randomChat", {user})

  socket.on("waitingForPerson" , ()=>{
    displayMsg.innerHTML = "<p class='updateConnectionStatus'>waiting for user to connect</p>"
  })
  socket.on("newUserJoinedMessage", ({name ,roomm}) => {
    console.log(name)
      displayMsg.innerHTML = `<p class='updateConnectionStatus'>you are connected to ${name}</p>`
      room = roomm;
      
      sendersName = name
  })

  button.addEventListener("click", sendBtnClicked)

  function sendBtnClicked() {
      const msgToSend = msgInput.value;
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const time = `${hours}:${minutes}`
      if (!msgToSend) {
          return
      }
     
      socket.emit("sendMessageRandomChat", { room, message: msgToSend,time })
      displayMsg.innerHTML += `<div class="wrapper wrapperSelf">
          <div class="userMsgBlock userMsgBlockSelf" >
      <div class="userMsgBlockName">${user.name}</div>

      <div class="userMsgBlockMsg">${msgToSend}</div>
      <div class="userMsgBlockTime">${time} <div class="msgStatus"></div></div>

      </div>
      </div>`

      displayMsg.scrollTop = displayMsg.scrollHeight;
      msgInput.value = ''
  }

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

  socket.on("recivedMessageRandomChat", ({ message,time}) => {
    console.log("send message")
    console.log(message)
      displayMsg.innerHTML += `<div class="wrapper ">
          <div class="userMsgBlock " >
      <div class="userMsgBlockName">${sendersName}</div>
      <div class="userMsgBlockMsg">${message}</div>
      <div class="userMsgBlockTime">${time}</div>
      </div>
      </div>`

      displayMsg.scrollTop = displayMsg.scrollHeight;

      socket.emit("messageStatusSeen", { room, messageId, userId})
  })

  socket.on("userLeftChat" , ()=>{
    displayMsg.innerHTML += `<p class='updateConnectionStatus'>user left chat , <a href="/randomChat">start new chat<a></p>`
        displayMsg.scrollTop = displayMsg.scrollHeight;
        chatOption.innerHTML = "start new chat"
  })

    let typingTimeout;
    window.addEventListener("keypress", () => {
    socket.emit("someoneIsTypingAtRandomChat", room)
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
        socket.emit("stoppedTypingAtRandomChat", room);
        }, 2000);
    })

  socket.on("TheyAreTyping", () => {
      notificationBar.innerHTML = `<p> <b>${sendersName}</b> is typing...<p>`

  })

  socket.on("stoppedTyping", () => {
      notificationBar.innerHTML = "";
  });
