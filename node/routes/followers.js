const express = require('express')
const request = require('request')
const router = express.Router()
const bodyParser = require('body-parser'); //加载body-parser数据处理模块
router.use(bodyParser.urlencoded({ extended: false }))//使用body-parser中间件
router.use(bodyParser.json())

/*获取following*/
const getFollowing = (params,fn) => {
  request(`https://github.com/${params.name}?page=${params.page}&tab=${params.type}`,function(error,response,body){
    if (!error && response.statusCode === 200) {
      let result = body.split('<a class="d-inline-block no-underline mb-1"');
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



//查询用户
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
