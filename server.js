const express=require('express');
const path=require('path');
const bodyParser=require('body-parser')
const app=express();

const ips={}    //token bucket

const refresh_tokens=()=>{
    for(let ip in ips){
        if(ips[ip]<4){
            ips[ip]=4;
        }
    }
}
var t=setInterval(refresh_tokens,60000);
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    return res.sendFile(path.join(__dirname,'base.html'))
})

app.use("/post",(req,res,next)=>{
    const ip=req.connection.remoteAddress;
    if(ips.hasOwnProperty(ip)){
        if(ips[ip]>0){
            ips[ip]-=1;
            next();
        }
        else{
            console.log("too many requests")
            res.redirect("/?error=toomanyrequests")
        }
    }
    else{
        ips[ip]=3;
        next();
    }
})

app.post("/post",(req,res)=>{
    res.sendFile(path.join(__dirname,'success.html'))
})

app.listen(4000,function(){
    console.log("server listening on port 4000")
})