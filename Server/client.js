const socket=io('http://localhost:8000/')


const messageForm=document.getElementById("message-send-form")
const messageInput=document.getElementById("message-input")
const chatContainer=document.querySelector(".chat-container")
const onlineuserbox=document.querySelector(".onlineusershow")
var sound=new Audio('Message_notification.mp3')

const showMessage=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    chatContainer.append(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight
}

const onlineusershow=(users)=>{
    onlineuserbox.innerHTML=''
    for (const [key, value] of Object.entries(users)) { 
        // console.log(username)
        const messageElement=document.createElement('div');
        messageElement.innerText = `${value}`;
        messageElement.classList.add('onlineuser');
        onlineuserbox.append(messageElement);
    }
}

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    showMessage(`@You\n${message}`,'right')
    socket.emit('send',message)
    messageInput.value=''
})

const name=prompt("Enter your Name ")
socket.emit('new-user-joined',name);

socket.on('user-joined',message=>{
    showMessage(`${message.name} joined the chat`,'center');
    console.log(message.users)
    onlineusershow(message.users)
});

socket.on('receive',message=>{
    sound.play()
    showMessage(`@${message.name}\n${message.message}`,'left')
})

socket.on('leave',message=>{
    showMessage(`${message.name} left the chat`,'center')
    onlineusershow(message.users)
})
