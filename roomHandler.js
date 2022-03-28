var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEiyosgAAAwb47Ft0A9PcMcUYGueDgq5e3Os1z',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

function getAllRooms(){
    client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("rooms")), { size: 1000 }),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then(function (x) {
        for (let i = 0; i < x.data.length; i++) {
        console.log(x.data[i].data)
        document.getElementById("rooms").innerHTML += `<p>` + x.data[i].data.id + ` <button onclick="goToRoom(` + x.data[i].data.id + `)">Join</button></p>`
        }

    });

    
}

function goToRoom(room){
    window.location.href = "chat.html?id=" + room
}


function makeid(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


function createRoom(){

    client.query(
        q.Create(
          q.Collection('rooms'),
          { data: { id: makeid(5), messages:[]} },
        )
      )
      .then(function(ret){
      
 window.location.href = "chat.html?id=" + ret.data.id

          }).catch(function(e){
              alert("Something went wrong. " + e)
          })

}