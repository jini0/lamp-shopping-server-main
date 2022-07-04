//products.js -> table 만들거!
//7.1
//Common.js 구문 : 내보내기 할 때 씀
//module.exports
// * mysql query문 처럼 생각하자!!
//테이블을 모델링하는 파일(테이블 만들어준거!!!!)
module.exports = function (sequelize, DataTypes){
    //define : create로 생각 - table 만들어주는거
    //컬럼 name, price, imageUrl, seller
    //제약조건 allowNull : 컬럼의 값이 없어도 되는지 여부(default:true - 없어도 된다는거) /false-null이라는거!
    //https://github.com/design-view/lamp-shopping-server   : 선생님 깃허브!
    const product = sequelize.define('Product', {
        //각각 어떤 column을 할건지
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(500),
        },
        seller: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {                      //7.4 테이블 컬럼 하나 더 추가 
            type: DataTypes.STRING(500),
            allowNull: false                //false -> not null을 허용하지 않겠다!
        }
    });
    return product;
}
// 💚터미널에 node server.js 다시 해주면!
// Executing (default): SELECT name FROM sqlite_master WHERE type='table' AND name='Products';
// Executing (default): CREATE TABLE IF NOT EXISTS `Products` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(20) NOT NULL, `price` INTEGER(10) NOT NULL, `imageUrl` VARCHAR(500), `seller` VARCHAR(200) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
// Executing (default): PRAGMA INDEX_LIST(`Products`)
// => 테이블이 만들어짐!