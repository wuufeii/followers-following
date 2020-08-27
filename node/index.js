const express = require('express');
const app = express();


app.all('*',function (req,res,next){
  res.header('Access-Control-Allow-Origin','*'); //设置允许跨域访问
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen(8087,function(){
  console.log("listening port 8087...");
  //获取access_token
  /*request('https://github.com/wuufeii?tab=following',function(error,response,body){
    if (!error && response.statusCode === 200) {
      console.log(body)
    }
  })*/
})

const followers = require('./routes/followers')
app.use('/follow',followers)