//6.30 -메모장 참고(green-lamp-client만들기2)
//🖤API서버 만들기🖤
//node는 CommonJS 문법을 사용
//import는 require() 이용
const http = require('http');
//본인컴퓨터의 주소를 의미함 : 127.0.0.1   - localhost와 비슷!!
const hostname = "127.0.0.1";
const port = 8080;                      //포트번호

//서버만들기 createServer(f(req,res))
                        // req,res의 이름은 안중요함 그냥 매개변수 이름!! a나 b이런거 적어두 상관없다!
//createServer에 오는 callback함수 - request(요청) response(응답) 가 올 수 있음
const server = http.createServer(function(req,res){
    //요청정보 req      : 이 서버로 뭘 요청했는지(웹브라우저가 요청한거!)
    //응답해줄게 res    : 보내주는 역할
    // console.log(req);               //이 콘솔은 웹브라우저에서 보이는게 아니고 서버에서 보일거라서 -> 터미널에서 뜰거임!!!💝
    const path = req.url;
    const method = req.method;
    if (path === "/products") {
        if (method === "GET") {
            //응답을 보낼 때 타입을 제이슨 객체를 헤더에 보낼거야!!!(http의 헤더와 바디로 나누는거) 
            res.writeHead(200, { 'Content-Type': 'application/json' })          //타입지정 (text파일인지 img이미지파일인지 json파일형식인지)
            //js 배열을 json형태로 변경해서 products에 담기
            const products = JSON.stringify([                    //배열안에 객체가 있음  / stringify() : 문자열로 바꿔주는거!
                {                   
                    name: "거실조명",
                    price: 50000,
                },   
                {
                    name: "어린이조명",
                    price: 50000,
                }
            ])
            res.end(products);
        }
    }
    console.log(path);
    console.log(method);
    res.end("Hello Client");        //res: 응답해주는애 -> 웹브라우저 화면에 Hello Client가 뜸!
})

//listen은 대기 호스트네임과 포트번호로 요청을 기다림
server.listen(port, hostname);
console.log('조명쇼핑몰 서버가 돌아가고 있습니다.');            //브라우저가 아니고 node화면! -> node에서 출력될거!!!
// 💙터미널에서 node index.js 치기!!!
//   PS D:\01-STUDY\react\lamp-shopping-server> node index.js
//   조명쇼핑몰 서버가 돌아가고 있습니다.
// 💙주소창에 localhost:8080 검색하면    -> Hello Client가 뜸!! --> 주소창에 치기만 하면! 터미널에 여러가지가 적힘(그런 정보들이 돌아가는거!)
// 💜node로 돌리면 새로 바뀌면(코드변경되면) 계속해서 다시 해줘야해서 다시 터미널에 node index.js 검색하고 주소창에 치기!💜
// PS D:\01-STUDY\react\lamp-shopping-server> node index.js
// 조명쇼핑몰 서버가 돌아가고 있습니다.
// localhost:8080 주소창 검색
// localhost:8080/product 주소창 검색! 그러면 밑에처럼 터미널에 뜬다!!!
// /
// GET
// /favicon.ico
// GET
// /product                         // 이렇게 뜸!
// GET
// /favicon.ico
// GET

// products- json배열객체 만들고, 
// 터미널에 node index.js 다시해주고
// 주소창에 localhost:8080/products 검색
// [{"name":"거실조명","price":50000},{"name":"어린이조명","price":50000}] 라고 뜰거임!