# Guide
# Del 1. Opsæt database med sequelize
### her er hans github btw: https://github.com/nedssoft/sequelize-with-postgres-tutorial

Tutorial: https://dev.to/nedsoft/getting-started-with-sequelize-and-postgres-emp

npm install sequelize sequelize-cli

touch .sequelizerc

Indsæt dette i .sequelizerc
```javascript
const path = require('path')

module.exports = {
  config: path.resolve('./database/config', 'config.js'),
  'models-path': path.resolve('./database/models'),
  'seeders-path': path.resolve('./database/seeders'),
  'migrations-path': path.resolve('./database/migrations'),
}
```

btw .sequelizerc skal ikke være .js den skal bare lades være udefineret er ok

lav en holder der hedder database

npx sequelize init

gå til database/config/config.js og indsæt: (gå til kitematic og gør en mariadb docker og sæt password og se port)
```javascript
require('dotenv').config()

module.exports = {
  "development": {
    "username": "root",
    "password": "secretbrah",
    "database": "db1",
    "host": "127.0.0.1",
    "port": 32773,
    "dialect": "mysql"
  }
}
```
npm install dotenv


Husk at du kan forbinde med datagrip til mariadb. Der skal du test connection så skal du lave en database db1 så det matcher med din config fil

Nu kan vi lave en tabel til users, posts og comments. 


npx sequelize model:generate --name User --attributes name:string,email:string

npx sequelize model:generate --name Post --attributes title:string,content:text,userId:integer

npx sequelize model:generate --name Comment --attributes postId:integer,comment:text,userId:integer


Hver kommando laver en migration og en model fil til hver linje.

Nu i migrations skal vi sørger for at i vores foreign keys skal vi tilføje NOT NULL eller problemer!

FX: 
```javascript
userId: {
        allowNull: false,
```

Nu skal vi sørger for at forholdene mellem modellerne passer skal de beskrives fx 1 til mange forhold 

Rediger user model til dette: 
```javascript
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
```
Rediger post til dette:
```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments',
      onDelete: 'CASCADE',
    });

    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })
  };
  return Post;
};
```
Comment til dette:
```javascript
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    postId: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post'
    });
  };
  return Comment;
};
```

Nu kan vi kører vores migrations, som laver i dette tilfælde oprette tabeller

npx sequelize db:migrate

Hvis dette sker: ERROR: Invalid shorthand property initializer så har du måske skrevet = ok ikke :

#Seed
Vi kan lave seeds for at fylde noget dummy data til tabellerne

npx sequelize seed:generate --name User

npx sequelize seed:generate --name Post

npx sequelize seed:generate --name Comment


Indsæt til user:
```javascript
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jon Doe',
        email: 'jondoe@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
```

Indsæt til post:
```javascript
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "Posts",
      [
        {
          userId: 1,
          title: "hispotan de nu",
          content:
            "Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          userId: 2,
          title: 'some dummy title',
          content:
            "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],

      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Posts", null, {})
};
```

Indsæt til comment:
```javascript
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "Comments",
      [
        {
          userId: 1,
          postId: 2,
          comment:
            "Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: 2,
          postId: 1,
          comment:
            "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Comments", null, {})
};
```
npx sequelize db:seed:all


Og nu er der data i databasen!


# Del 2. Opsæt server med node web
https://dev.to/nedsoft/performing-crud-with-sequelize-29cf

lav en express app i roden.

express --hbs

npm install

Så lav en mappe til at håndtere CRUD vi kalder den controllers. Her dirigere vores router til.

mkdir controllers && touch controllers/index.js


Put det her i controllers/index.js:
```javascript
const models = require('../database/models');

const createPost = async (req, res) => {
  try {
    const post = await models.Post.create(req.body);
    return res.status(201).json({
      post,
    });
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

module.exports = {
  createPost,
}
```

Rediger nu din router fil, så den har dette: 
```javascript
const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'))

router.post('/posts', controllers.createPost);

module.exports = router;
```


Åbn postman og lav en postrequest til: localhost:3000/posts med dette body:
```javascript
{
    "userId": 1,
    "title": "postman hello",
    "content": "bro!"
}
```
Du bør så få en response og der bør ligge noget nyt i databasen.


Nu laver vi getter

tilføj dette til controller/index.js:
```javascript
const getAllPosts = async (req, res) => {
    try {
      const posts = await models.Post.findAll({
        include: [
          {
            model: models.Comment,
            as: 'comments'
          },
          {
            model: models.User,
            as: 'author'
          }
        ]
      });
      return res.status(200).json({ posts });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

module.exports = {
  createPost,getAllPosts
}
```
Og dette til routeren:
```javascript
router.get('/posts', controllers.getAllPosts);
```

Hvis du vil lave resten, så se under del2 afsnittet. der ligger mere CRUD!
