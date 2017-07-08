### spider all business data from Sodis, Shanghai

#### Knowledgemap

- superagent
- mongodb

#### Usage

1、 create database  
in your disk create folder , as:  

├── conf  
│   └── mongod.conf  
├── data  
└── log  
    ├── mongod.log  

about how to config mongod.conf you can go to [config mongodb](https://phobal.github.io/2016/11/06/mongodb%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/)  
then start mongodb:  
`mongod --port 27017 -f ./conf/mongod.conf`  

2、install modules , and run   
`yarn install`  

3、`node index.js`

#### TODOs

* [ ] Data Visualization