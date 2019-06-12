var usuario;

function iniciar(){
  (async () => {
  const user = document.getElementById('username').value;
  if(!user){
    alert('Insert a username');
    return;
  }
  const rawResponse = await fetch("https://chatdojiko.herokuapp.com/login?user=" + user, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }      
});
const content = await rawResponse.json();
console.log(content);
if(content.error){
  alert('Username is in use.');
}
else{
  usuario = document.getElementById('username').value;
  document.getElementById("logar_btn").disabled = true;
  document.getElementById("username").disabled = true;
  document.getElementById("message").disabled = false;
  document.getElementById("enviar").disabled = false;
  allowMessages();
  
}    
})();
}

    function allowMessages(){
     var socket = io.connect();

     socket.emit('sendmessage',{
       newconnection : true,
       user : usuario,
       message : `${usuario} entrou na sala.`
     } );

     $("#enviar").click(function() {
        const texto = $("#message").val();
        socket.emit('sendmessage', {
          newconnection : false,
          user: usuario,
          message : `${usuario}: ${texto}`
        });
        $("#message").val('');
     });

     socket.on('newmessage', function(data){
        $("#chat").append(data + '</br>')
     });
    }
