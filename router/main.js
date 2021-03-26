const express = require('express');
const fs=require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/list', function(req,res) {
    fs.readFile(__dirname+"/../user.json",'utf-8',(err,data)=>{
        res.end(data);
    })
})
router.get('/getUser/:username',function(req,res) {
    fs.readFile(__dirname+"/../user.json",'utf-8',(err,data)=>{
        var users=JSON.parse(data);
        res.json(users[req.params.username]);
    })
})
router.post('/addUser/:username',function (req,res){
    
    var result= {};
    var username =req.params.username;

    if(!req.body["password"] || !req.body["name"]){
        result["success"]=0;
        result["error"]="invalid request"
        res.json(result);
        return;
    }
    fs.readFile(__dirname+"/../user.json",'utf-8',function(err,data){
        var users= JSON.parse(data);
        if(users[username]){
            result["success"]=0;
            result["error"]= "user already exists";
            res.json(result);
            return;
        }
        users[username]=req.body;
        fs.writeFile(__dirname+"/../user.json",
            JSON.stringify(users,null,'\t'),'utf-8',function(err,data){
            result["success"]=1;
            res.json(result);

        })

    })
})
router.put('/updateUser/:username',function(req,res){
    var result= {};
    var username=req.params.username;
    if( !req.body["password"] || !req.body["name"]){
        result["success"]=0;
        result["error"] ="잘못된 요청입니다."
        res.json(result);
        return;
    }
    fs.readFile(__dirname+"/../user.json",'utf-8',function(err,data){
        users=JSON.parse(data);
        if( users[username]){
            users[username]=req.body;   
        }
        fs.writeFile(__dirname+"/../user.json", JSON.stringify(users,null,'\t'), "utf-8",function(err,data){
            result["success"]=1;
            res.json(result);
        })
    })
})
router.delete('/deleteUser/:username',function (req,res){
    console.log("zzzz");
    var result= {};
    var username = req.params.username;
    fs.readFile(__dirname+"/../user.json",'utf-8', function (err,data){
        var users=JSON.parse(data);
        if(!users[username]){
            result["success"]=0;
            result["error"]="존재하지 않는 유저";
            res.json(result);
            return;
        }
        delete users[username];
        fs.writeFile(__dirname+"/../user.json",JSON.stringify(users,null,'\t'),'utf-8',function(err,data){
            result["success"]=1;
            res.json(result);
            return;
        })
    })
    
})
module.exports = router;