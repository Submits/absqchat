
var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEiyosgAAAwb47Ft0A9PcMcUYGueDgq5e3Os1z',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})
let urlParams = new URLSearchParams(window.location.search);
let id = ""
let users = []
let username = ""

if(localStorage.getItem('absqChatUsername') == null ||  localStorage.getItem('absqChatPassword') == null || localStorage.getItem('absqChatId') == null){
window.location.href = "signup.html"
}

if(urlParams.get("id") == null)
{
    window.location.href = "rooms.html"
}

getAllUsers()

function sleep(milisec) {
    return new Promise(resolve => {
    setTimeout(() => { resolve('') }, milisec);
    })
    }




client.query(
    q.Get(
      q.Match(q.Index('room_by_id'), urlParams.get("id"))
    )
  )
        
  .then(function(ret) {

    document.getElementById("roomId").innerHTML = ret.data.id


    id = ret.ref.value.id
    var docRef = q.Ref(q.Collection('rooms'), id)

function report(e) {
  console.log(e)
  let messages = ""
    for (let i = 0; i < e.data.messages.length; i++) {

        let authorId = e.data.messages[i].author

        let userinfo = users.findIndex(function(item, i) {
            return item.id === authorId
          });

          console.log(users[userinfo])

        messages += ` <p><strong style="color:` + users[userinfo].user_colour + `">` + users[userinfo].username + `</strong>: ` + e.data.messages[i].content + `</p>`
    }
    document.getElementById("chat").innerHTML = messages
  var data = ('action' in e)
    ? e["document"].data
    : e.data
  
  
}

var stream
const startStream = () => {
  stream = client.stream.document(docRef)
  .on('snapshot', snapshot => {
    report(snapshot)
  })
  .on('version', version => {
    report(version)
  })
  .on('error', error => {
    console.log('Error:', error)
    stream.close()
    setTimeout(startStream, 1000)
  })
  .start()
}

startStream()


})
      .catch(function(e){
        console.log(e)
      });



      function calcDate(date)
    {
dateNow = new Date();
dateThen = new Date(date);
const diffTime = Math.abs(dateThen - dateNow);
let seconds = Math.round(diffTime / 1000)
let minutes = Math.round(diffTime / 1000 / 60)
let hours =  Math.round(diffTime / 1000 / 60 / 60)
let days = Math.round(diffTime / 1000 / 60 / 60 / 24)
let years = Math.round(diffTime / 1000 / 60 / 60 / 24 / 365)

        
       if(seconds >= 1 && seconds < 60){
        if(seconds == 1)
        {
          return seconds + " second ago"
        }
        else{
          return seconds + " seconds ago"
        }
}
else if(minutes >= 1 && minutes < 60){
  if(minutes== 1)
  {
    return minutes + " minute ago"
  }
  else{
    return minutes + " minutes ago"
  }
}
else if(hours >= 1 && hours < 24){
  if(hours == 1)
  {
    return hours + " hour ago"
  }
  else{
    return hours + " hours ago"
  }
}
else if(days >= 1 && days < 365){
  if(days == 1)
  {
    return days + " day ago"
  }
  else{
    return days + " days ago"
  }
}
else if(years >= 1){
  if(years == 1)
  {
    return years + " year ago"
  }
  else{
    return years + " years ago"
  }
}
        
    }


    function sendMessage(){

        let date = new Date()
        if(document.getElementById("message").value == ""){
            alert("Please fill out all fields!")
    
        }
        else{
        client.query(
            q.Get(
              q.Match(q.Index('room_by_id'), urlParams.get("id"))
            )
          )
          .then(function(ret){ 
               
            let messages = ret.data.messages
            messages.push({author: parseInt(localStorage.getItem("absqChatId")), content: document.getElementById("message").value})
            client.query(
              q.Update(q.Ref(q.Collection("rooms"), ret.ref.value.id), {
              data: {
                messages: messages
      
              },
              })
              ).then(function(ret){ 
              
                document.getElementById("message").value = ""
    
              }).catch(function(e){

                alert("Something went wrong. " + e)
                document.getElementById("message").value = ""
              })
          
          })
            
          .catch(function(e){
          
          alert("Recipient does not exist!")
          
          });
        }


}



function logOut(){

    localStorage.removeItem('absqChatUsername');
    localStorage.removeItem('absqChatPassword');
    localStorage.removeItem('absqChatId');
    window.location.href = "signup.html"
}

async function getAllUsers(){

    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users")), { size: 1000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
        for (let i = 0; i < x.data.length; i++) {
        users.push({id: x.data[i].data.id, username:  x.data[i].data.username, user_colour: x.data[i].data.colour})
        }

    });

    console.log(users)
   
}

function leave(){
    window.location.href = "rooms.html"
}