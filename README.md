# Express를 이용한RESTful API

간단하게 서버를 열고 json형식으로 만들어진 data에 

put,post,get,delete method를 이용하여 유저 리스트에 유저를 조회, 추가 ,수정,제거하는 간단한 rest api를 만들었다.

### 코드분석

#### 서버구현

```javascript
//server.js
var express = require('express');
const app = express();
app.listen(3000, (req, res) => {
    console.log("서버 실행중..");
});
```

express프레임 워크를 불러와 app에 넣고, 3000번 포트를 이용해 서버를 여는 코드다.

#### 라우터 설정

```javascript
//router/main.js
const express = require('express');
const router = express.Router();
/........router 구현 ..../
module.exports = router;
//server.js
const router = require('./router/main.js');
app.use('/', router);
```

main.js에서 express.router() 코드를 통해 router를 선언해 주고 

각 method와 path를 설정해 기타 코드들을 구현하고

router를 export해서 server.js에서 쓸 수 있도록 한다.

```
app.set('views',__dirname);
app.engine('html',require('ejs').renderFile);
```

위 두 코드는 html파일을 렌더링 할 때

화면 engine을 ejs로 설정한다는 뜻이다. 

------

#### 유저데이터

```json
{ //user.json
	"second_user": {
		"password": "second_pass",
		"name": "kim"
	},
	"newUser": {
		"password": "pass",
		"name": "unknown"
	},
	"kim": {
		"password": "password",
		"name": "지훈"
	}
}
```

유저 데이터를 json 형식으로 만들어 놓고 get,put,post,delete를 통해 데이터를 바꿀 것이다.

#### 기본페이지

```
//router/main.js
router.get('/', (req, res) => {
    res.render('index.html');
});
```

router를 통해 localhost:3000/로 가게되면 index.html 파일을 렌더링 해달라는 코드다. 

#### 전체 유저 조회(GET)

```
router.get('/list', function(req,res) {
    fs.readFile(__dirname+"/../user.json",'utf-8',(err,data)=>{
        res.end(data);
    })
})
```

__dirname: 현재 디렉토리 경로

req는 request , 즉 client가 요청한 내용이 담겨있고

res는 response , 즉 server가 응답하는 내용이 담겨있다.

> '/list' 로 가게되면  콜백함수 내에서 경로에 있는 user.json을 읽어서 
>
> res의 끝에 data를 담아주세요~!

를 구현한 코드다.

#### 특정 유저 조회(GET)

```
router.get('/getUser/:username',function(req,res) {
    fs.readFile(__dirname+"/../user.json",'utf-8',(err,data)=>{
        var users=JSON.parse(data);
        res.json(users[req.params.username]);
    })
})
```

유저 데이터 중 특정 이름을 가진 유저의 데이터를 얻고 싶을때 쓴다.

ex) localhost:3000/getuser/kim => kim 정보 가져오기 .

```javascript
 var users=JSON.parse(data);
```

JSON은 웹 서버와 데이터를 교환하는데 주로 사용된다.

웹 서버에서 데이터를 수신할 때 데이터는 항상 문자열인데, 

이 데이터를 JSON.parse()를 사용해서 파싱하여 데이터를 자바스크립트 객체로 만드는 역할을 한다. 

(일반적으로 JavaScript를 활용한 웹 어플리케이션에서는 상태나 기타 데이터들을 저장하고 활용하기 위해서 흔히 객체(Object)를 사용한다)

![화면 캡처 2021-03-28 001712](https://user-images.githubusercontent.com/77804950/112725906-e6b0a980-8f5d-11eb-86eb-9fdaf69cdabc.png)

#### 새로운 유저 추가 (POST)

```javascript
router.post('/addUser/:username',function (req,res){
    var result= {}; //정보 담을 객체.
    var username =req.params.username; //유저 이름 받아오기
    if(!req.body["password"] || !req.body["name"]){
        //클라이언트 요청중 password 또는 name없는 경우 오류 반환
        result["success"]=0;
        result["error"]="invalid request"
        res.json(result);
        return;
    }
    fs.readFile(__dirname+"/../user.json",'utf-8',function(err,data){ //user.json 읽어오기.
        var users= JSON.parse(data);//data를users객체에 저장
        if(users[username]){// 이미 있는 유저일 경우 에러 반환
            result["success"]=0;
            result["error"]= "user already exists";
            res.json(result);
            return;
        }
        //users객체에 client가 요청한 body 실어서 객체 초기화
        users[username]=req.body; 
        fs.writeFile(__dirname+"/../user.json",
            JSON.stringify(users,null,'\t'),'utf-8',function(err,data){ //users객체를 json형태로 변환
            result["success"]=1;
            res.json(result);
        })
    })
})
```

![화면 캡처 2021-03-28 002500](https://user-images.githubusercontent.com/77804950/112725902-de586e80-8f5d-11eb-8a87-120d00738555.png)

위처럼 BODY내용에 데이터를 빼먹으면 에러를 발생시킨다.


![화면 캡처 2021-03-28 002533](https://user-images.githubusercontent.com/77804950/112725904-e0223200-8f5d-11eb-8f2d-b99d0af76172.png)

BODY를 잘 넣고 문제가 없으면 위 사진처럼 서버가 res를 보내준다. 

****

**`JSON.stringify()`** 메서드는 JavaScript 값이나 객체를 JSON 문자열로 변환합니다

#### 유저 정보 수정(PUT)

```javascript
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
        if( users[username]){ //유저 있으면 데이터 변경.
            users[username]=req.body;   
        }
        fs.writeFile(__dirname+"/../user.json", JSON.stringify(users,null,'\t'), "utf-8",function(err,data){
            result["success"]=1;
            res.json(result);
        })
    })
})
```

#### 특정 유저 삭제 (DELETE)

```javascript
router.delete('/deleteUser/:username',function (req,res){
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
        delete users[username]; //데이터 삭제
        fs.writeFile(__dirname+"/../user.json",JSON.stringify(users,null,'\t'),'utf-8',function(err,data){
            result["success"]=1;
            res.json(result);
            return;
        })
    })
```





### 기타 스크랩

node.js는 chrome 엔진으로 빌드된 js 런타임이고,

(런타임: 프로그래밍 언어가 구동되는 환경)

예전에는 자바스크립트 런타임은 브라우저 밖에 없었지만 

node.js로 인해 브라우저 밖에서도 js를 실행할 수 있다.

express는 node.js의 가장 널리 사용되는 웹 프레임워크다.



REST(Representational State Transfer) 

- HTTP URI(Uniform Resource Identifier)를 통해 자원(Resource)을 명시하고, HTTP Method(POST, GET, PUT, DELETE)를 통해 해당 자원에 대한 CRUD Operation을 적용하는 것을 의미한다.

API(Application Programming Interface)

- 데이터와 기능의 집합을 제공하여 컴퓨터 프로그램간 상호작용을 촉진하며, 서로 정보를 교환가능 하도록 하는 것

  

  > "REST API는 HTTP를 이용해서 기계들이 통신을 할 때 HTTP가 가지고 있는 기능을 최대한 활용해서 명확하면서 단순하게 통신할 수 없을까?하는 고민에서 출발한 모범사례라고 할 수 있습니다 ".  



