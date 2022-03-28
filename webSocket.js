
var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEioiBAGAAxnU2AXU-PwdAEE7pFerTU6Gmlf0t',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

let urlParams = new URLSearchParams(window.location.search);
let id = ""


client.query(
    q.Get(
      q.Match(q.Index('info_from_url'), urlParams.get("id"))
    )
  )
        
  .then(function(ret) {

    document.getElementById("title").innerHTML = `Live logs for: <b>` + ret.data.url + `</b> <font style="color:#bababa">[<a id="count">` + ret.data.logs.length + `</a>]</font>`
    document.getElementById("clicks").innerHTML = "Total Clicks: <b>" + ret.data.clicks + "</b>"
    document.getElementById("display").innerHTML = "Display Message: <b>" + ret.data.display_message + "</b>"
    id = ret.ref.value.id
    var docRef = q.Ref(q.Collection('logs'), id)

function report(e) {
  console.log(e)
  let logs = ""
  document.getElementById("count").innerHTML = e.data.logs.length
  e.data.logs.reverse()
    for (let i = 0; i < e.data.logs.length; i++) {
        logs += `<div class="item"><b><u>` + e.data.logs[i].date + `</u></b><br><i>[` + calcDate(e.data.logs[i].date) + `]</i><br><br><label style="float:left"><b>IP:</b></label><label class="highlight">` + e.data.logs[i].ip + `</label><br><label style="float:left"><b>Rough Area:</b></label> <label class="highlight">` + e.data.logs[i].city + `, ` + e.data.logs[i].country + `</label><br><label style="float:left"><b>Postal/ZIP Code:</b></label> <label class="highlight">` + e.data.logs[i].zip + `</label><br><label style="float:left"><b>Lat/Long:</b></label> <label class="highlight">` + e.data.logs[i].lat + `, ` + e.data.logs[i].lon + `</label><br><label style="float:left"><b>ISP:</b></label> <label class="highlight">` + e.data.logs[i].isp + `</label><br><label style="float:left"><b>OS:</b></label> <label class="highlight">` + e.data.logs[i].os + `</label><br><label style="float:left"><b>Browser:</b></label> <label class="highlight">` + e.data.logs[i].browser + `</label><br><label style="float:left"><b>Screen:</b></label> <label class="highlight">` + e.data.logs[i].width + `x` +  e.data.logs[i].height + `</label><br><label style="float:left"><b>Language:</b></label> <label class="highlight">` + e.data.logs[i].language + `</label><br><br><b>Full User Agent:</b><br>` + e.data.logs[i].userAgent + `<br><br><b>GPU:</b><br>` + e.data.logs[i].gpu + `</div>`
    }
    document.getElementById("logs").innerHTML = logs 
    document.getElementById("display").innerHTML = "Display Message: <b>" + e.data.display_message + "</b>"
    document.getElementById("clicks").innerHTML = "Total Clicks: <b>" + e.data.clicks + "</b>"
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
         console.error(e)
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