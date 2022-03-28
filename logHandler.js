var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEioiBAGAAxnU2AXU-PwdAEE7pFerTU6Gmlf0t',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})


window.onload = async function(){


let urlParams = new URLSearchParams(window.location.search);
var response = await fetch("https://ipapi.co/json")
const data = await response.json()



client.query(
    q.Get(
      q.Match(q.Index('info_from_url'), urlParams.get("id"))
    )
  )
        
  .then(function(ret) {

    document.getElementById("message").innerHTML = ret.data.display_message
    let gpu = "";
const gl = document.createElement('canvas').getContext('webgl');
  if (!gl) {
    gpu = "Unknown"
  }
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
 gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

 if(gpu == null)
 {
   gpu = "Unknown"
 }

    let logs = ret.data.logs
    let date = new Date()
    logs.push({ip: data.ip, country: data.region, browser: platform.name + " " + platform.version, city: data.city, zip: data.postal, lat: data.latitude, lon: data.longitude, isp: data.org, os: platform.os.family + " " + platform.os.version, date: date.toUTCString(), width: screen.width, height: screen.height, language: navigator.language, userAgent: navigator.userAgent, gpu: gpu})
    client.query(
        q.Update(q.Ref(q.Collection("logs"), ret.ref.value.id), {
        data: {
          logs: logs,
          clicks: ret.data.clicks + 1
        },
        })
        ).then(function(rec){
    
         
    
      }).catch(function(e){
    
        console.error(e)

      });
    


})
      .catch(function(e){
         console.error(e)
      });

}