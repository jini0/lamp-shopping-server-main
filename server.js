// https://github.com/design-view/lamp-shopping-server : 선생님 깃허브(lamp-server)
// 클라이언트가 데이터 요청이 오면 그걸 전달하는 역할이 API 서버의 역할임!!
const express = require("express");
const cors = require("cors");
const app = express();      //함수 express()를 실행한 결과 값이 app에 들어감
const port = 3000;          //포트번호
// 7.1
const models = require('./models');

//json형식의 데이터를 처리할 수 있게 설정
app.use(express.json());
//브라우저 cors이슈를 막기위해 사용(모든 브라우저의 요청을 일정하게 받겠다)
app.use(cors());
//7.4 upload 폴더에 있는 파일에 접근할 수 있도록 설정(서버에 있는 파일을 다른 곳에서도 쓸 수 있도록 해줌 -> 이거 해줘야 상품등록시 사진의 이미지 불러와짐!(upload폴더의 사진들 이용가능))
app.use("/upload",express.static("upload"));

// 💛7.4
// 업로드 이미지를 관리하는 스토리지 서버를 연결 -> 멀터를 사용하겠다.
const multer = require("multer");
const { diskStorage } = require("multer");
// 이미지 파일이 요청오면 어디에 저장할건지 지정
const upload = multer({ 
    // dest: 'upload/'
    // ✔ 이미지 이름이 이상하게 변경되어 저장돼서 -> 이미지 이름을 원래 이름으로 지정해주고자함
    storage: multer.diskStorage({           //diskStorage() : 지정을 해주겠다 라는 메서드
        destination: function(req, file, cb){
            //cb: callback함수
            //어디에 저장할거냐? upload/
            cb(null, 'upload/')
        },
        filename: function(req, file, cb){
            //어떤 이름으로 저장할거야?
            //file객체의 오리지널 이름으로 저장하겠다
            cb(null, file.originalname)
        }
    })
})

//🖤요청처리
//app.메서드(url, 함수)
                //callback함수
// 💛7.4
//✔post전송방식
// 이미지파일을 post로 요청이 왔을 때 upload라는 폴더에 이미지를 저장하기
// 이미지가 하나일 때 single
app.post('/image', upload.single('image'), (req, res)=>{
                                // image key이름 
    const file = req.file;
    console.log(file);
    res.send({
        // imageUrl: file.path
        //이미지 경로 수정!
        imageUrl: "http://localhost:3000/"+file.destination+file.filename   
    })
})
// 테스트 해보기(7.4 사진참고) - postman에서 POST  http://localhost:3000/image 경로를 변경함(app.post의 경로인 '/image'!!!!)을 뒤에 적어준거
// Body - form-data 클릭 - key이름을 image로 지정 / key값의 Text를 file로 변경해주기!(오른쪽에 회색글자) -> value에는 이미지 파일 product이미지 선택(product2.jpg)했음 -> send
// 하면 밑에 결과창 + 터미널에
//{
//     "imageUrl": "upload\\4c608804de83a0b776defad677d2c31c"           //이미지 이름이 이상하게 뜸 -> 이걸 보기 편하게 원래이름으로 해줄거임! --> const upload 에 수정한것들!!
// }
// 해주고 나면 , 같은걸 다시 postman에서 send 보내주면
// {
//     "imageUrl": "upload\\product2.jpg"               // 이미지이름이 원래 이름으로 잘 뜸!
// }
// (+) client에서 upload폴더의 index.js에서 Upload를 추가하고/ 상품등록하기에서 상품사진을 등록하려고 하면
// http://localhost:3000/upload\product3.jpg        //경로가 \역슬러시로 떠서 이미지가 액박뜸 --> 이를 수정해줘야함!  + upload폴더 내 사진 이용할 수 있도록 해주기!



//✔get전송방식
app.get('/products',async (req,res)=>{              //get으로 요청을 하고 url이 /products이면 함수안에꺼를 요청해줘!!
    //데이터베이스 조회하기
    models.Product.findAll()
    .then((result)=>{
        console.log("제품전체조회", result);
        res.send(result);
        // res.send({
        //     product: result
        // })
    })
    .catch(e=>{
        console.error(e);
        res.send("파일조회에 문제가 있습니다.");
    })



    // --  이렇게 하나하나 넣어줬었음 -> table넣어서 연동해줄거임! -- 
    // const result = {                                //result는 객체임! - 배열X / 객체안에 products라는 배열을 담고 있는거
    //     products: [                                 //products는 배열안에 객체들을 담고 있음!
    //         {                                       //실제 데이터베이스는 데이터베이스에 담고있지! 이렇게 바로 적어주지않음 -> 내일 설치할거임!!!
    //             id:1,
    //             name:"거실조명",
    //             price: 50000,
    //             imgsrc: "images/products/product1.jpg",
    //             seller: "green",
    //         },
    //         {
    //             id:2,
    //             name:"캠핑조명",
    //             price: 50000,
    //             imgsrc: "images/products/product2.jpg",
    //             seller: "blue",
    //         },
    //         {
    //             id:3,
    //             name:"아동조명",
    //             price: 50000,
    //             imgsrc: "images/products/product3.jpg",
    //             seller: "pink",
    //         },
    //         {
    //             id:4,
    //             name:"거실조명",
    //             price: 50000,
    //             imgsrc: "images/products/product4.jpg",
    //             seller: "yellow",
    //         },
    //         {
    //             id:5,
    //             name:"거실조명",
    //             price: 50000,
    //             imgsrc: "images/products/product1.jpg",
    //             seller: "green",
    //         },
    //         {
    //             id:6,
    //             name:"캠핑조명",
    //             price: 50000,
    //             imgsrc: "images/products/product2.jpg",
    //             seller: "blue",
    //         },
    //         {
    //             id:7,
    //             name:"아동조명",
    //             price: 50000,
    //             imgsrc: "images/products/product3.jpg",
    //             seller: "pink",
    //         },
    //         {
    //             id:8,
    //             name:"거실조명",
    //             price: 50000,
    //             imgsrc: "images/products/product4.jpg",
    //             seller: "yellow",
    //         },
    //     ]
    // }
    // res.send('업로드된 상품들 입니다.');             //send는 보내주는거!
    // res.send(result);
})
// 💜하나만 나오게도 설정하기!💜
// https://jsonplaceholder.typicode.com/users/1 이렇게 한 거처럼 users의 id가 1인거만 나오게 설정하기!!
//method get 요청이 오고 url은 /product/2 로 요청이 온 경우
app.get('/product/:id', async (req, res)=> {
    //async 하고 띄우고 함수 적어줘야함!
    const params = req.params;
    // const { id } = params;           //1.
    //하나만 조회할 때는 findOne -> select문(쿼리문에서)
    models.Product.findOne({
        //조건절
        where: {
            // id:id                    //1.
            id:params.id                //2. params의 id 임!        / 1번으로 할거면 위에 const {id}와 같이 id:id 해줘야함!!!
        }
    })
    .then(result=>{
        res.send(result);
    })
    .catch(e=>{
        console.error(e);
        res.send("상품조회에 문제가 생겼습니다.");
    })


    //이건 임시로 보낸 product!!
    // const product = {                   //그냥 객체 하나 가져온거!      -> 이런애만 전송을 해주겠다~
    //     id:id,
    //     name:"서버에서 보내는 이름",
    //     price: 50000,
    //     imgsrc: "images/products/product4.jpg",
    //     seller: "yellow",
    // }
    // res.send(product);                  //얘만 전송하겠다!
                                        //그래서 localhost:3000/product/2 이렇게나 localhost:3000/product/3 등 주소창에 입력하면 그 값만 뜸!
});

//✔7.4 post 전송방식
app.post("/products",(req,res)=>{
    //http body에 있는 데이터 
    // *post는 데이터를 달고오는데 header에 담기지 않고 body에 담고!
    // *post로 전송하면 body에 담김 
    const body = req.body;
    //body객체에 있는 값을 각각 변수에 할당
    const { name, price, seller, imageUrl, description } = body;
    if(!name || !price || !seller ) {
        res.send("모든 필드를 입력해주세요");
    }
    //모든 입력값이 있으면
    //Product테이블에 레코드를 삽입
    // - 데이터베이스 우린 models를 썼음
    // - create문 --> mysql로 생각하면 insert문임!(query날려주는거랑 똑같구나!!)
    models.Product.create({
        name,
        price,
        seller,
        imageUrl,
        description
    }).then(result=>{
        console.log("상품 생성 결과 : ", result);
        res.send({
            result
        })
    })
    .catch(e=>{
        console.error(e);
        res.send("상품 업로드에 문제가 생겼습니다.");
    })
})
// 이거 하고 node server.js 서버 연결해준 뒤 postman열자!!(7.4사진참고!)💗
// 구동되는지 테스트부터 할거! create New -> http request -> request url적어줌!
// POST  http://localhost:3000/products 이렇게 주소 적어줌!! - body 클릭 - raw - json 클릭 하고 추가할 데이터 적어주기 
// ex>
// {
//     "name": "주방조명",
//     "price" : 70000,
//     "seller" : "pink",
//     "imageUrl" : "/images/products/product1.jpg"
// }
// 적어주고 send보내면 보내짐!(밑에 결과창에 보내진 것들이 뜸! + 터미널에도 적힘!!!)
// 하고나서 로컬디스크C -> Program Files 폴더 클릭 -> DB Browser for SQLite.exe 클릭(C:\Program Files\DB Browser for SQLite) 
// -> 열림 -> 데이터베이스 열기 -> lamp-shopping-server-main 폴더 열어서 -> database.sqlite3 클릭! -> 데이터 보기 하면 데이터들이 뜨고
// 추가한 데이터도 생긴걸 볼 수 있음!  --> lamp-shopping-client-main을 npm start 해서 열린 react 에서도 항목에 추가된 걸 볼 수 있다!



// //✔post 전송방식 (6.30)
// app.post('/green',async (req,res)=>{                //비동기 promise! -> async써서 간편하게!
//     console.log(req);
//     res.send('그린 게시판에 게시글이 등록되었습니다.');
// });

//✔7.4 delete 전송
//delete 삭제하기 (삭제하기 버튼 클릭시 삭제) -axios로 delete 전송한거!(post get 말고)
//cf. https://baeharam.netlify.app/posts/Node.js/Node.js-Sequelize-다루기       : 블로그 참고하기!
app.delete('/product/:id', async (req, res) => {
    const params = req.params;
    models.Product.destroy({ where: { id: params.id }})
    .then( res.send("상품이 삭제되었습니다."));
})

//🖤실행
app.listen(port, ()=>{
    console.log('쇼핑몰 서버가 동작 중입니다.');
    // 7.1 php 연동하듯이 연동해주기!!
    // - sequelize와 데이터베이스 연결작업
    // - 데이터베이스 동기화 
    models.sequelize
    .sync()
    .then(()=>{
        console.log('DB연결 성공');
    })
    .catch(e=>{
        console.error(e);
        console.log('DB연결 에러');
        //서버실행이 안되면 프로세스를 종료
        process.exit();
    })
})
// ✨7.1✨
// - sequelize와 데이터베이스 연결작업 해주고 나서 
// - 터미널에서, 다시 서버연결하면 -> DB연결 성공이 뜸!!!
// PS D:\01-STUDY\react\lamp-shopping-server-main> node server.js
// 쇼핑몰 서버가 동작 중입니다.
// Executing (default): SELECT 1+1 AS result
// DB연결 성공
// 그러면 lamp-shopping-server-main에 'database.sqlite3'라는 파일이 생김!!



// 🎈get 방식🎈
// 1. 터미널에 node server.js ! (js자바스크립트를 실행한다는 의미)
// PS D:\01-STUDY\react\lamp-shopping-server> node server.js
// 쇼핑몰 서버가 동작 중입니다.
// 하고나서 주소창에 localhost:3000/products 하면           //포트번호 여긴 3000번
// 업로드된 상품들 입니다.              //가 나옴(res.send('업로드된 상품들 입니다.'))

// 2. res.send(result); 해주고
// 터미널에 다시 node server.js !
// PS D:\01-STUDY\react\lamp-shopping-server> node server.js
// 쇼핑몰 서버가 동작 중입니다.
// 하고나서 주소창에 localhost:3000/products 하면
// {"products":[{"id":1,"name":"거실조명","price":50000},{"id":2,"name":"아동조명","price":50000}]}

// 🧡크롬 확장프로그램에서, JSONVue 다운하면 보기편하게 나옴!🧡
// {
//     products: [
//      {
//          id: 1,
//          name: "거실조명",
//          price: 50000
//      },
//      {
//          id: 2,
//          name: "아동조명",
//          price: 50000
//      }
//     ]
// }

// 🎈post방식🎈 - get보다 조금 까다로움(form만들어줘야하는데 - 이렇게 안하고 postman 다운받아서 편하게?쓰기!)
// 💛postman 이라는 걸 다운받음!!!💛    https://www.postman.com/ - 회원가입함
// postman을 열고 create New ->  HTTP REQUEST를 클릭        (메모장 참고-6.30(green-lamp-client만들기2))
// 터미널에서 다시 node server.js 해주고 postman에서 
// POST방식 -  localhost:3000/green     send를 클릭! 하면
// postman 거기 밑에 '그린 게시판에 게시글이 등록되었습니다.' 라고 뜸
// 터미널을 보면,
// url: '/green',
// method: 'POST',              //이라고 적혀있음!!

// +) postman에서 params   -body 클릭! - raw 클릭 - JSON형식 선택(사진참고 06.30)
// {
//     "name":"민영",                    //javascript와 달리 JSON은 key값을 "쌍따옴표" 안에 담아줘야함!!!
//     "age":33
// }                                    //칸 안에 라고 적어주자!   ----> 하고 send보내기!!!
// * post로 전송하면 body에 담김 *
// * JSON은 키에도 ""쌍따옴표로 감싸줘야함! *
// 그리고 나서 터미널을 다시보면, body안에 값들이 담김!!!!
//  body: { name: '민영', age: 33 },


// 💞lamp-shopping-client react폴더와 같이보자!!!💞   --> src폴더 - main폴더 - index.js랑 연동!