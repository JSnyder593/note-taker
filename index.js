//
const express = require('express')
const app = express();
const path = require("path");
const uuid = require('./uuid.js')
const fs = require('fs');
const PORT = 3001;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/notes.html"))
});

app.get('/api/notes',(req,res)=>{
  res.sendFile(path.join(__dirname,"./db/db.json"))
})

app.post('/api/notes',(req,res)=>{
  fs.readFile("./db/db.json", "utf-8", (err, data)=>{
      if(err){
          console.log(err);
          res.status(500).json({
              msg: "Unable to upload note!",
              err: err,
          });
      } else {

          const dataArr = JSON.parse(data);
          req.body.id = uuid
          dataArr.push(req.body);

          fs.writeFile('./db/db.json',JSON.stringify(dataArr,null,4),(err,data)=>{
              if(err){
                  console.log(err);
                  res.status(500).json({
                      msg:"Uh oh!",
                      err:err
                  })
              } else {
                  res.json({
                      msg:"Note added successfully!"
                  });
              }
          });
      }
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
