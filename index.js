//7.5 ๐server.js -> index.js๋ก ์ด๋ฆ ๋ณ๊ฒฝ!!!!
// https://github.com/design-view/lamp-shopping-server : ์ ์๋ ๊นํ๋ธ(lamp-server)
// ํด๋ผ์ด์ธํธ๊ฐ ๋ฐ์ดํฐ ์์ฒญ์ด ์ค๋ฉด ๊ทธ๊ฑธ ์ ๋ฌํ๋ ์ญํ ์ด API ์๋ฒ์ ์ญํ ์!!
// https://semtax.tistory.com/7  : Expressjs์์ JSON Request Body ํ์ฑํ๊ธฐ
const express = require("express");
const cors = require("cors");
const app = express();      //ํจ์ express()๋ฅผ ์คํํ ๊ฒฐ๊ณผ ๊ฐ์ด app์ ๋ค์ด๊ฐ
// const port = 3000;          //ํฌํธ๋ฒํธ
//7.5 ๐ํค๋ก์ฟ ์์ ํฌํธ ์ง์ ํ๋๊ฒ ์์ผ๋ฉด ๊ทธ ๋ฒํธ๋ฅผ ์ฌ์ฉ
//์์ผ๋ฉด 8080ํฌํธ๋ฅผ ์ฌ์ฉ
const port = process.env.PORT || 8080;
// 7.1
const models = require('./models');

//jsonํ์์ ๋ฐ์ดํฐ๋ฅผ ์ฒ๋ฆฌํ  ์ ์๊ฒ ์ค์ 
app.use(express.json());
//๋ธ๋ผ์ฐ์  cors์ด์๋ฅผ ๋ง๊ธฐ์ํด ์ฌ์ฉ(๋ชจ๋  ๋ธ๋ผ์ฐ์ ์ ์์ฒญ์ ์ผ์ ํ๊ฒ ๋ฐ๊ฒ ๋ค)
app.use(cors());
//7.4 upload ํด๋์ ์๋ ํ์ผ์ ์ ๊ทผํ  ์ ์๋๋ก ์ค์ (์๋ฒ์ ์๋ ํ์ผ์ ๋ค๋ฅธ ๊ณณ์์๋ ์ธ ์ ์๋๋ก ํด์ค -> ์ด๊ฑฐ ํด์ค์ผ ์ํ๋ฑ๋ก์ ์ฌ์ง์ ์ด๋ฏธ์ง ๋ถ๋ฌ์์ง!(uploadํด๋์ ์ฌ์ง๋ค ์ด์ฉ๊ฐ๋ฅ))
app.use("/upload",express.static("upload"));

// ๐7.4
// ์๋ก๋ ์ด๋ฏธ์ง๋ฅผ ๊ด๋ฆฌํ๋ ์คํ ๋ฆฌ์ง ์๋ฒ๋ฅผ ์ฐ๊ฒฐ -> ๋ฉํฐ๋ฅผ ์ฌ์ฉํ๊ฒ ๋ค.
const multer = require("multer");
const { diskStorage } = require("multer");
// ์ด๋ฏธ์ง ํ์ผ์ด ์์ฒญ์ค๋ฉด ์ด๋์ ์ ์ฅํ ๊ฑด์ง ์ง์ 
const upload = multer({ 
    // dest: 'upload/'
    // โ ์ด๋ฏธ์ง ์ด๋ฆ์ด ์ด์ํ๊ฒ ๋ณ๊ฒฝ๋์ด ์ ์ฅ๋ผ์ -> ์ด๋ฏธ์ง ์ด๋ฆ์ ์๋ ์ด๋ฆ์ผ๋ก ์ง์ ํด์ฃผ๊ณ ์ํจ
    storage: multer.diskStorage({           //diskStorage() : ์ง์ ์ ํด์ฃผ๊ฒ ๋ค ๋ผ๋ ๋ฉ์๋
        destination: function(req, file, cb){
            //cb: callbackํจ์
            //์ด๋์ ์ ์ฅํ ๊ฑฐ๋? upload/
            cb(null, 'upload/')
        },
        filename: function(req, file, cb){
            //์ด๋ค ์ด๋ฆ์ผ๋ก ์ ์ฅํ ๊ฑฐ์ผ?
            //file๊ฐ์ฒด์ ์ค๋ฆฌ์ง๋ ์ด๋ฆ์ผ๋ก ์ ์ฅํ๊ฒ ๋ค
            cb(null, file.originalname)
        }
    })
})

//๐ค์์ฒญ์ฒ๋ฆฌ
//app.๋ฉ์๋(url, ํจ์)
                //callbackํจ์
// ๐7.4
//โpost์ ์ก๋ฐฉ์
// ์ด๋ฏธ์งํ์ผ์ post๋ก ์์ฒญ์ด ์์ ๋ upload๋ผ๋ ํด๋์ ์ด๋ฏธ์ง๋ฅผ ์ ์ฅํ๊ธฐ
// ์ด๋ฏธ์ง๊ฐ ํ๋์ผ ๋ single
app.post('/image', upload.single('image'), (req, res)=>{
                                // image key์ด๋ฆ 
    const file = req.file;
    console.log(file);
    res.send({
        // imageUrl: file.path
        //์ด๋ฏธ์ง ๊ฒฝ๋ก ์์ !
        // imageUrl: "http://localhost:3000/"+file.destination+file.filename   
        // ๐7.5 heroku ์ฃผ์๋ก ๋ณ๊ฒฝ
        imageUrl: "https://greenlamp-shopping-server.herokuapp.com/"+file.destination+file.filename   
    })
})
// ํ์คํธ ํด๋ณด๊ธฐ(7.4 ์ฌ์ง์ฐธ๊ณ ) - postman์์ POST  http://localhost:3000/image ๊ฒฝ๋ก๋ฅผ ๋ณ๊ฒฝํจ(app.post์ ๊ฒฝ๋ก์ธ '/image'!!!!)์ ๋ค์ ์ ์ด์ค๊ฑฐ
// Body - form-data ํด๋ฆญ - key์ด๋ฆ์ image๋ก ์ง์  / key๊ฐ์ Text๋ฅผ file๋ก ๋ณ๊ฒฝํด์ฃผ๊ธฐ!(์ค๋ฅธ์ชฝ์ ํ์๊ธ์) -> value์๋ ์ด๋ฏธ์ง ํ์ผ product์ด๋ฏธ์ง ์ ํ(product2.jpg)ํ์ -> send
// ํ๋ฉด ๋ฐ์ ๊ฒฐ๊ณผ์ฐฝ + ํฐ๋ฏธ๋์
//{
//     "imageUrl": "upload\\4c608804de83a0b776defad677d2c31c"           //์ด๋ฏธ์ง ์ด๋ฆ์ด ์ด์ํ๊ฒ ๋ธ -> ์ด๊ฑธ ๋ณด๊ธฐ ํธํ๊ฒ ์๋์ด๋ฆ์ผ๋ก ํด์ค๊ฑฐ์! --> const upload ์ ์์ ํ๊ฒ๋ค!!
// }
// ํด์ฃผ๊ณ  ๋๋ฉด , ๊ฐ์๊ฑธ ๋ค์ postman์์ send ๋ณด๋ด์ฃผ๋ฉด
// {
//     "imageUrl": "upload\\product2.jpg"               // ์ด๋ฏธ์ง์ด๋ฆ์ด ์๋ ์ด๋ฆ์ผ๋ก ์ ๋ธ!
// }
// (+) client์์ uploadํด๋์ index.js์์ Upload๋ฅผ ์ถ๊ฐํ๊ณ / ์ํ๋ฑ๋กํ๊ธฐ์์ ์ํ์ฌ์ง์ ๋ฑ๋กํ๋ ค๊ณ  ํ๋ฉด
// http://localhost:3000/upload\product3.jpg        //๊ฒฝ๋ก๊ฐ \์ญ์ฌ๋ฌ์๋ก ๋ ์ ์ด๋ฏธ์ง๊ฐ ์ก๋ฐ๋ธ --> ์ด๋ฅผ ์์ ํด์ค์ผํจ!  + uploadํด๋ ๋ด ์ฌ์ง ์ด์ฉํ  ์ ์๋๋ก ํด์ฃผ๊ธฐ!



//โget์ ์ก๋ฐฉ์
app.get('/products',async (req,res)=>{              //get์ผ๋ก ์์ฒญ์ ํ๊ณ  url์ด /products์ด๋ฉด ํจ์์์๊บผ๋ฅผ ์์ฒญํด์ค!!
    //๋ฐ์ดํฐ๋ฒ ์ด์ค ์กฐํํ๊ธฐ
    models.Product.findAll()
    .then((result)=>{
        console.log("์ ํ์ ์ฒด์กฐํ", result);
        res.send(result);
        // res.send({
        //     product: result
        // })
    })
    .catch(e=>{
        console.error(e);
        res.send("ํ์ผ์กฐํ์ ๋ฌธ์ ๊ฐ ์์ต๋๋ค.");
    })



    // --  ์ด๋ ๊ฒ ํ๋ํ๋ ๋ฃ์ด์คฌ์์ -> table๋ฃ์ด์ ์ฐ๋ํด์ค๊ฑฐ์! -- 
    // const result = {                                //result๋ ๊ฐ์ฒด์! - ๋ฐฐ์ดX / ๊ฐ์ฒด์์ products๋ผ๋ ๋ฐฐ์ด์ ๋ด๊ณ  ์๋๊ฑฐ
    //     products: [                                 //products๋ ๋ฐฐ์ด์์ ๊ฐ์ฒด๋ค์ ๋ด๊ณ  ์์!
    //         {                                       //์ค์  ๋ฐ์ดํฐ๋ฒ ์ด์ค๋ ๋ฐ์ดํฐ๋ฒ ์ด์ค์ ๋ด๊ณ ์์ง! ์ด๋ ๊ฒ ๋ฐ๋ก ์ ์ด์ฃผ์ง์์ -> ๋ด์ผ ์ค์นํ ๊ฑฐ์!!!
    //             id:1,
    //             name:"๊ฑฐ์ค์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product1.jpg",
    //             seller: "green",
    //         },
    //         {
    //             id:2,
    //             name:"์บ ํ์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product2.jpg",
    //             seller: "blue",
    //         },
    //         {
    //             id:3,
    //             name:"์๋์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product3.jpg",
    //             seller: "pink",
    //         },
    //         {
    //             id:4,
    //             name:"๊ฑฐ์ค์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product4.jpg",
    //             seller: "yellow",
    //         },
    //         {
    //             id:5,
    //             name:"๊ฑฐ์ค์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product1.jpg",
    //             seller: "green",
    //         },
    //         {
    //             id:6,
    //             name:"์บ ํ์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product2.jpg",
    //             seller: "blue",
    //         },
    //         {
    //             id:7,
    //             name:"์๋์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product3.jpg",
    //             seller: "pink",
    //         },
    //         {
    //             id:8,
    //             name:"๊ฑฐ์ค์กฐ๋ช",
    //             price: 50000,
    //             imgsrc: "images/products/product4.jpg",
    //             seller: "yellow",
    //         },
    //     ]
    // }
    // res.send('์๋ก๋๋ ์ํ๋ค ์๋๋ค.');             //send๋ ๋ณด๋ด์ฃผ๋๊ฑฐ!
    // res.send(result);
})
// ๐ํ๋๋ง ๋์ค๊ฒ๋ ์ค์ ํ๊ธฐ!๐
// https://jsonplaceholder.typicode.com/users/1 ์ด๋ ๊ฒ ํ ๊ฑฐ์ฒ๋ผ users์ id๊ฐ 1์ธ๊ฑฐ๋ง ๋์ค๊ฒ ์ค์ ํ๊ธฐ!!
//method get ์์ฒญ์ด ์ค๊ณ  url์ /product/2 ๋ก ์์ฒญ์ด ์จ ๊ฒฝ์ฐ
app.get('/product/:id', async (req, res)=> {
    //async ํ๊ณ  ๋์ฐ๊ณ  ํจ์ ์ ์ด์ค์ผํจ!
    const params = req.params;
    // const { id } = params;           //1.
    //ํ๋๋ง ์กฐํํ  ๋๋ findOne -> select๋ฌธ(์ฟผ๋ฆฌ๋ฌธ์์)
    models.Product.findOne({
        //์กฐ๊ฑด์ 
        where: {
            // id:id                    //1.
            id:params.id                //2. params์ id ์!        / 1๋ฒ์ผ๋ก ํ ๊ฑฐ๋ฉด ์์ const {id}์ ๊ฐ์ด id:id ํด์ค์ผํจ!!!
        }
    })
    .then(result=>{
        res.send(result);
    })
    .catch(e=>{
        console.error(e);
        res.send("์ํ์กฐํ์ ๋ฌธ์ ๊ฐ ์๊ฒผ์ต๋๋ค.");
    })


    //์ด๊ฑด ์์๋ก ๋ณด๋ธ product!!
    // const product = {                   //๊ทธ๋ฅ ๊ฐ์ฒด ํ๋ ๊ฐ์ ธ์จ๊ฑฐ!      -> ์ด๋ฐ์ ๋ง ์ ์ก์ ํด์ฃผ๊ฒ ๋ค~
    //     id:id,
    //     name:"์๋ฒ์์ ๋ณด๋ด๋ ์ด๋ฆ",
    //     price: 50000,
    //     imgsrc: "images/products/product4.jpg",
    //     seller: "yellow",
    // }
    // res.send(product);                  //์๋ง ์ ์กํ๊ฒ ๋ค!
                                        //๊ทธ๋์ localhost:3000/product/2 ์ด๋ ๊ฒ๋ localhost:3000/product/3 ๋ฑ ์ฃผ์์ฐฝ์ ์๋ ฅํ๋ฉด ๊ทธ ๊ฐ๋ง ๋ธ!
});

//โ7.4 post ์ ์ก๋ฐฉ์
app.post("/products",(req,res)=>{
    //http body์ ์๋ ๋ฐ์ดํฐ 
    // *post๋ ๋ฐ์ดํฐ๋ฅผ ๋ฌ๊ณ ์ค๋๋ฐ header์ ๋ด๊ธฐ์ง ์๊ณ  body์ ๋ด๊ณ !
    // *post๋ก ์ ์กํ๋ฉด body์ ๋ด๊น 
    const body = req.body;
    //body๊ฐ์ฒด์ ์๋ ๊ฐ์ ๊ฐ๊ฐ ๋ณ์์ ํ ๋น
    const { name, price, seller, imageUrl, description } = body;
    if(!name || !price || !seller ) {
        res.send("๋ชจ๋  ํ๋๋ฅผ ์๋ ฅํด์ฃผ์ธ์");
    }
    //๋ชจ๋  ์๋ ฅ๊ฐ์ด ์์ผ๋ฉด
    //Productํ์ด๋ธ์ ๋ ์ฝ๋๋ฅผ ์ฝ์
    // - ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฐ๋ฆฐ models๋ฅผ ์ผ์
    // - create๋ฌธ --> mysql๋ก ์๊ฐํ๋ฉด insert๋ฌธ์!(query๋ ๋ ค์ฃผ๋๊ฑฐ๋ ๋๊ฐ๊ตฌ๋!!)
    models.Product.create({
        name,
        price,
        seller,
        imageUrl,
        description
    }).then(result=>{
        console.log("์ํ ์์ฑ ๊ฒฐ๊ณผ : ", result);
        res.send({
            result
        })
    })
    .catch(e=>{
        console.error(e);
        res.send("์ํ ์๋ก๋์ ๋ฌธ์ ๊ฐ ์๊ฒผ์ต๋๋ค.");
    })
})
// ์ด๊ฑฐ ํ๊ณ  node server.js ์๋ฒ ์ฐ๊ฒฐํด์ค ๋ค postman์ด์!!(7.4์ฌ์ง์ฐธ๊ณ !)๐
// ๊ตฌ๋๋๋์ง ํ์คํธ๋ถํฐ ํ ๊ฑฐ! create New -> http request -> request url์ ์ด์ค!
// POST  http://localhost:3000/products ์ด๋ ๊ฒ ์ฃผ์ ์ ์ด์ค!! - body ํด๋ฆญ - raw - json ํด๋ฆญ ํ๊ณ  ์ถ๊ฐํ  ๋ฐ์ดํฐ ์ ์ด์ฃผ๊ธฐ 
// ex>
// {
//     "name": "์ฃผ๋ฐฉ์กฐ๋ช",
//     "price" : 70000,
//     "seller" : "pink",
//     "imageUrl" : "/images/products/product1.jpg"
// }
// ์ ์ด์ฃผ๊ณ  send๋ณด๋ด๋ฉด ๋ณด๋ด์ง!(๋ฐ์ ๊ฒฐ๊ณผ์ฐฝ์ ๋ณด๋ด์ง ๊ฒ๋ค์ด ๋ธ! + ํฐ๋ฏธ๋์๋ ์ ํ!!!)
// ํ๊ณ ๋์ ๋ก์ปฌ๋์คํฌC -> Program Files ํด๋ ํด๋ฆญ -> DB Browser for SQLite.exe ํด๋ฆญ(C:\Program Files\DB Browser for SQLite) 
// -> ์ด๋ฆผ -> ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ด๊ธฐ -> lamp-shopping-server-main ํด๋ ์ด์ด์ -> database.sqlite3 ํด๋ฆญ! -> ๋ฐ์ดํฐ ๋ณด๊ธฐ ํ๋ฉด ๋ฐ์ดํฐ๋ค์ด ๋จ๊ณ 
// ์ถ๊ฐํ ๋ฐ์ดํฐ๋ ์๊ธด๊ฑธ ๋ณผ ์ ์์!  --> lamp-shopping-client-main์ npm start ํด์ ์ด๋ฆฐ react ์์๋ ํญ๋ชฉ์ ์ถ๊ฐ๋ ๊ฑธ ๋ณผ ์ ์๋ค!



// //โpost ์ ์ก๋ฐฉ์ (6.30)
// app.post('/green',async (req,res)=>{                //๋น๋๊ธฐ promise! -> async์จ์ ๊ฐํธํ๊ฒ!
//     console.log(req);
//     res.send('๊ทธ๋ฆฐ ๊ฒ์ํ์ ๊ฒ์๊ธ์ด ๋ฑ๋ก๋์์ต๋๋ค.');
// });

//โ7.4 delete ์ ์ก
//delete ์ญ์ ํ๊ธฐ (์ญ์ ํ๊ธฐ ๋ฒํผ ํด๋ฆญ์ ์ญ์ ) -axios๋ก delete ์ ์กํ๊ฑฐ!(post get ๋ง๊ณ )
//cf. https://baeharam.netlify.app/posts/Node.js/Node.js-Sequelize-๋ค๋ฃจ๊ธฐ       : ๋ธ๋ก๊ทธ ์ฐธ๊ณ ํ๊ธฐ!
app.delete('/product/:id', async (req, res) => {
    const params = req.params;
    models.Product.destroy({ where: { id: params.id }})
    .then( res.send("์ํ์ด ์ญ์ ๋์์ต๋๋ค."));
})

//๐ค์คํ
app.listen(port, ()=>{
    console.log('์ผํ๋ชฐ ์๋ฒ๊ฐ ๋์ ์ค์๋๋ค.');
    // 7.1 php ์ฐ๋ํ๋ฏ์ด ์ฐ๋ํด์ฃผ๊ธฐ!!
    // - sequelize์ ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฐ๊ฒฐ์์
    // - ๋ฐ์ดํฐ๋ฒ ์ด์ค ๋๊ธฐํ 
    models.sequelize
    .sync()
    .then(()=>{
        console.log('DB์ฐ๊ฒฐ ์ฑ๊ณต');
    })
    .catch(e=>{
        console.error(e);
        console.log('DB์ฐ๊ฒฐ ์๋ฌ');
        //์๋ฒ์คํ์ด ์๋๋ฉด ํ๋ก์ธ์ค๋ฅผ ์ข๋ฃ
        process.exit();
    })
})
// โจ7.1โจ
// - sequelize์ ๋ฐ์ดํฐ๋ฒ ์ด์ค ์ฐ๊ฒฐ์์ ํด์ฃผ๊ณ  ๋์ 
// - ํฐ๋ฏธ๋์์, ๋ค์ ์๋ฒ์ฐ๊ฒฐํ๋ฉด -> DB์ฐ๊ฒฐ ์ฑ๊ณต์ด ๋ธ!!!
// PS D:\01-STUDY\react\lamp-shopping-server-main> node server.js
// ์ผํ๋ชฐ ์๋ฒ๊ฐ ๋์ ์ค์๋๋ค.
// Executing (default): SELECT 1+1 AS result
// DB์ฐ๊ฒฐ ์ฑ๊ณต
// ๊ทธ๋ฌ๋ฉด lamp-shopping-server-main์ 'database.sqlite3'๋ผ๋ ํ์ผ์ด ์๊น!!



// ๐get ๋ฐฉ์๐
// 1. ํฐ๋ฏธ๋์ node server.js ! (js์๋ฐ์คํฌ๋ฆฝํธ๋ฅผ ์คํํ๋ค๋ ์๋ฏธ)
// PS D:\01-STUDY\react\lamp-shopping-server> node server.js
// ์ผํ๋ชฐ ์๋ฒ๊ฐ ๋์ ์ค์๋๋ค.
// ํ๊ณ ๋์ ์ฃผ์์ฐฝ์ localhost:3000/products ํ๋ฉด           //ํฌํธ๋ฒํธ ์ฌ๊ธด 3000๋ฒ
// ์๋ก๋๋ ์ํ๋ค ์๋๋ค.              //๊ฐ ๋์ด(res.send('์๋ก๋๋ ์ํ๋ค ์๋๋ค.'))

// 2. res.send(result); ํด์ฃผ๊ณ 
// ํฐ๋ฏธ๋์ ๋ค์ node server.js !
// PS D:\01-STUDY\react\lamp-shopping-server> node server.js
// ์ผํ๋ชฐ ์๋ฒ๊ฐ ๋์ ์ค์๋๋ค.
// ํ๊ณ ๋์ ์ฃผ์์ฐฝ์ localhost:3000/products ํ๋ฉด
// {"products":[{"id":1,"name":"๊ฑฐ์ค์กฐ๋ช","price":50000},{"id":2,"name":"์๋์กฐ๋ช","price":50000}]}

// ๐งกํฌ๋กฌ ํ์ฅํ๋ก๊ทธ๋จ์์, JSONVue ๋ค์ดํ๋ฉด ๋ณด๊ธฐํธํ๊ฒ ๋์ด!๐งก
// {
//     products: [
//      {
//          id: 1,
//          name: "๊ฑฐ์ค์กฐ๋ช",
//          price: 50000
//      },
//      {
//          id: 2,
//          name: "์๋์กฐ๋ช",
//          price: 50000
//      }
//     ]
// }

// ๐post๋ฐฉ์๐ - get๋ณด๋ค ์กฐ๊ธ ๊น๋ค๋ก์(form๋ง๋ค์ด์ค์ผํ๋๋ฐ - ์ด๋ ๊ฒ ์ํ๊ณ  postman ๋ค์ด๋ฐ์์ ํธํ๊ฒ?์ฐ๊ธฐ!)
// ๐postman ์ด๋ผ๋ ๊ฑธ ๋ค์ด๋ฐ์!!!๐    https://www.postman.com/ - ํ์๊ฐ์ํจ
// postman์ ์ด๊ณ  create New ->  HTTP REQUEST๋ฅผ ํด๋ฆญ        (๋ฉ๋ชจ์ฅ ์ฐธ๊ณ -6.30(green-lamp-client๋ง๋ค๊ธฐ2))
// ํฐ๋ฏธ๋์์ ๋ค์ node server.js ํด์ฃผ๊ณ  postman์์ 
// POST๋ฐฉ์ -  localhost:3000/green     send๋ฅผ ํด๋ฆญ! ํ๋ฉด
// postman ๊ฑฐ๊ธฐ ๋ฐ์ '๊ทธ๋ฆฐ ๊ฒ์ํ์ ๊ฒ์๊ธ์ด ๋ฑ๋ก๋์์ต๋๋ค.' ๋ผ๊ณ  ๋ธ
// ํฐ๋ฏธ๋์ ๋ณด๋ฉด,
// url: '/green',
// method: 'POST',              //์ด๋ผ๊ณ  ์ ํ์์!!

// +) postman์์ params   -body ํด๋ฆญ! - raw ํด๋ฆญ - JSONํ์ ์ ํ(์ฌ์ง์ฐธ๊ณ  06.30)
// {
//     "name":"๋ฏผ์",                    //javascript์ ๋ฌ๋ฆฌ JSON์ key๊ฐ์ "์๋ฐ์ดํ" ์์ ๋ด์์ค์ผํจ!!!
//     "age":33
// }                                    //์นธ ์์ ๋ผ๊ณ  ์ ์ด์ฃผ์!   ----> ํ๊ณ  send๋ณด๋ด๊ธฐ!!!
// * post๋ก ์ ์กํ๋ฉด body์ ๋ด๊น *
// * JSON์ ํค์๋ ""์๋ฐ์ดํ๋ก ๊ฐ์ธ์ค์ผํจ! *
// ๊ทธ๋ฆฌ๊ณ  ๋์ ํฐ๋ฏธ๋์ ๋ค์๋ณด๋ฉด, body์์ ๊ฐ๋ค์ด ๋ด๊น!!!!
//  body: { name: '๋ฏผ์', age: 33 },


// ๐lamp-shopping-client reactํด๋์ ๊ฐ์ด๋ณด์!!!๐   --> srcํด๋ - mainํด๋ - index.js๋ ์ฐ๋!