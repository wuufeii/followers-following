const express = require('express')
const request = require('request')
const router = express.Router()
const bodyParser = require('body-parser'); //加载body-parser数据处理模块
router.use(bodyParser.urlencoded({ extended: false }))//使用body-parser中间件
router.use(bodyParser.json())

//获取账号
const getUser = (params,fn) => {
  request(`https://github.com/${params.name}`,function(error,response,body){
    if (!error && response.statusCode === 200) {
      let obj = {}
      let url = body.split('avatar avatar-user width-full border bg-white')[1].split('src="')[1].split('"')[0];
      let user = body.split('<h1 class="vcard-names pl-2 pl-md-0">')[1].split('</h1>')[0];
      let name = user.split('itemprop="name">')[1].split('</span>')[0]
      let key = user.split('itemprop="additionalName">')[1].split('</span>')[0]
      let followers = body.split('class="text-bold text-gray-dark"')[1].split('</span>')[0].split('>')[1].split('"')[0]
      let following = body.split('class="text-bold text-gray-dark"')[2].split('</span>')[0].split('>')[1].split('"')[0]
      let stars = body.split('class="text-bold text-gray-dark"')[3].split('</span>')[0].split('>')[1].split('"')[0]
      obj = {url,name,key,followers,following,stars}
      fn(obj)
    }
  })
}

//获取following
const getFollowing = (params,fn) => {
  request(`https://github.com/${params.name}?page=${params.page}&tab=${params.type}`,function(error,response,body){
    if (!error && response.statusCode === 200) {
      // let result = body.split('<a class="d-inline-block no-underline mb-1"');
       let result = body.split('<div class="d-table table-fixed col-12 width-full py-4 border-bottom border-gray-light"');
      let arr = []
      result.forEach((item,index) => {
        if(index!==0) {
          const url = item.split('src="')[1].split('"')[0]
          const name = item.split('<span class="f4 link-gray-dark">')[1].split('</span')[0]
          const hasKey = item.split('<span class="link-gray pl-1">')[1] === undefined ? item.split('<span class="link-gray">')[1]: item.split('<span class="link-gray pl-1">')[1]
          const key = hasKey.split('</span')[0]
          const type = params.type
          arr.push({url,name,key,type})
        }
      })
      fn(arr)
    }
  })
}

//查询账号
router.post('/getUser',(req,res) => {
  let params = req.body
  getUser(params,rspData => {
    res.send({
      msg: '成功',
      data: rspData
    })
  })
})

//查询follow
router.post('/getFollow',(req,res) => {
  let params = req.body
  getFollowing(params,rspData => {
    res.send({
      msg: '成功',
      data: rspData
    })
  })
})
module.exports = router
