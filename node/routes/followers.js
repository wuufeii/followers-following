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
      let url = body.split('avatar avatar-user width-full border')[1].split('src="')[1].split('"')[0];
      let name = body.split('itemprop="name">')[1].split('</span>')[0]
      let key = body.split('itemprop="additionalName">')[1].split('</span>')[0]
      let followers = body.split(`https://github.com/${params.name}?tab=followers`)[1].split('</span>')[0].split('<span')[1].split('>')[1]
      let following = body.split(`https://github.com/${params.name}?tab=following`)[1].split('</span>')[0].split('<span')[1].split('>')[1]
      let stars = body.split(`https://github.com/${params.name}?tab=stars`)[1].split('</span>')[0].split('<span')[1].split('>')[1]
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
       let result = body.split('<div class="d-table table-fixed col-12 width-full py-4 border-bottom color-border-secondary"');
      let arr = []
      result.forEach((item,index) => {
        if(index!==0) {
          const url = item.split('src="')[1].split('"')[0]
          const hasName = item.split('<span class="f4 Link--primary">')[1].split('</span')
          const name = hasName.length>0 ? hasName[0] : ''
          // const key = item.split('<span class="Link--secondary pl-1">')[1].split('</span')[0]
          // const hasKey1 = item.split('<span class="Link--secondary">')
          // const hasKey2 = item.split('<span class="Link--secondary  pl-1">')
          // const hasKey = hasKey2.length > 0 ? hasKey2 : hasKey1
          // const key = hasKey[1].split('</span')
          const key = ''
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
