const socket = io({
    autoConnect:false
});
const chatbox = document.getElementById('chatbox');

let user;

Swal.fire({
    title:"Identifícate",
    icon:"question",
    input:"text",
    inputValidator: (value) =>{
        if(!value) {
            return "¡Necesitas identificarte para participar!";
        }
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then((response)=>{
    user = response.value;
    socket.connect();
    socket.emit('authenticated',user);
})





chatbox.addEventListener('keyup',evt=>{
    if(evt.key==="Enter"){
        socket.emit('message',{user:user,message:chatbox.value});
        chatbox.value = "";
    }
})

//Listeners de socket

socket.on('logs',data=>{
    if(!user) return;
    const p = document.getElementById('logs');
    let messages = ``;
    data.forEach(logItem=>{
        messages += `${logItem.user} dice: ${logItem.message} <br/>`
    })
    p.innerHTML = messages;
})

socket.on('newUser',user=>{
    if(user){
        console.log(user);
        Swal.fire({
            toast:true,
            showConfirmButton:false,
            timer:3000,
            title:`${user} se ha unido al chat`,
            position:'top-end',
            icon:'success'
        })
    }

})