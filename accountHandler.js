var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEiyosgAAAwb47Ft0A9PcMcUYGueDgq5e3Os1z',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

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

function signUp(){

    if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
    {
        alert("Please fill out all credentials!")
    }
    else{
    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), document.getElementById("username").value)
        )
      )
      .then(function(ret){ 
           
      alert("This name is taken!")
      
      })
        
      .catch(function(e){
      
      
      
        let date = new Date();
          client.query(
        q.Create(
          q.Collection('users'),
          { data: { username: document.getElementById("username").value.replace(/\s/g, ""), password: document.getElementById("password").value, id: parseInt(makeid(5)), colour: "black"} },
        )
      )
      .then(function(ret){
      
        localStorage.setItem('absqChatUsername', ret.data.username);
    localStorage.setItem('absqChatPassword', ret.data.password);
    localStorage.setItem('absqChatId', ret.data.id);
 window.location.href = "rooms.html"

          }).catch(function(e){
              alert("Something went wrong. " + e)
          })
      
      });
    }

}

function logIn(){

    if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
    {
        alert("Please fill out all credentials!")
    }
    else{

    client.query(
        q.Get(
          q.Match(q.Index('user_by_name'), document.getElementById("username").value)
        )
      )
            
      .then(function(ret) {
                            
        if(ret.data.password != document.getElementById("password").value)  
        {
          alert("User and password do not match!")
        }
        else{
         
          
        localStorage.setItem('absqChatUsername', ret.data.username);
        localStorage.setItem('absqChatPassword', ret.data.password);
        localStorage.setItem('absqChatId', ret.data.id);
     window.location.href = "rooms.html"

        }
      })
      .catch(function(e){
        alert("User not found.")
      });
    }


}


