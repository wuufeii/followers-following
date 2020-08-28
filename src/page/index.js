import axios from 'axios'
export const dataMixins = {
  data() {
    return {
      name: '',
      errorTips: '',
      showError: false,
      loadingLeft: false,
      loadingRight: false,
      showLeft: false,
      showRight: false,
      userForm: {
        name: '',
        key: '',
        followers: '',
        following: '',
        star: ''
      },
      followingPage: null,
      followersPage: null,
      allPage: 0,
      followingAll: [],
      followersAll: [],
      followersAndFollowing: [],
      both: []
    }
  },
/*  mounted() {
    this.getDiff()
  },*/
  methods: {
    //查询用户
    queryUser() {
      if(this.name==='') {
        this.showError = true
        this.errorTips = '请输入github账号'
        return false
      }
      this.loadingLeft = true
      axios.post('http://localhost:8087/follow/getUser', {
        name: this.name
      }).then(res => {
        this.loadingLeft = false
        this.showLeft = true
        this.userForm = res.data.data
      }).catch(error => {
        this.showError = true
        this.loadingLeft = false
        this.errorTips = '查询失败，请刷新后再试!'
      })
    },
    //快捷查询
    queryFollow() {
      this.followingPage = Math.ceil(Number(this.userForm.following)/50)
      this.followersPage = Math.ceil(Number(this.userForm.followers)/50)
      this.showRight = true
      this.getFollowing('following')
    },
    //自定义查询fallow
    getFollowing(type) {
      let startNum = 0
      let followPage = 0
      let followForm = {}
      if (type === 'following') {
        followPage = Number(this.followingPage)
        this.getFollowing('followers')
      } else {
        followPage = Number(this.followersPage)
      }
      let endNum = followPage
      this.loadingRight = true
      const following = setInterval(() => {
        let nowNum = followPage
        followForm[nowNum] = []
        axios.post('http://localhost:8087/follow/getFollow', {
          page: followPage,
          name: this.name,
          type: type
        }).then(result => {
          this.allPage++
          startNum++
          followForm[nowNum] = result.data.data
          if (startNum === endNum) {
            for (let i in followForm) {
              if (type === 'following') {
                this.followingAll = this.followingAll.concat(followForm[i])
                sessionStorage.setItem(type, JSON.stringify(this.followingAll))
              } else {
                this.followersAll = this.followersAll.concat(followForm[i])
                sessionStorage.setItem(type, JSON.stringify(this.followersAll))
              }
            }
          }
          if(this.allPage === Number(this.followersPage)+Number(this.followingPage)) {
            this.getDiff()
            this.loadingRight = false
          }
        }).catch(() => {
          this.showError = true
          this.loadingRight = false
          this.errorTips = '查询失败，请刷新后再试!'
        })
        followPage--
        if (followPage === 0) {
          clearInterval(following)
        }
      }, 1)
    },
    //比较两者区别
    getDiff() {
      const following = JSON.parse(sessionStorage.getItem('following'))
      const followers = JSON.parse(sessionStorage.getItem('followers'))
/*      const following = this.followingAll
      const followers = this.followersAll*/
      let all = following.concat(followers)
      this.followersAndFollowing = this.uniqueArray(all,'key')
    },
    //去重
    uniqueArray(array, key){
      let result = [array[0]];
      for(let i = 1; i < array.length; i++){
        let item = array[i];
        let repeat = false;
        for (let j = 0; j < result.length; j++) {
          if (item[key] === result[j][key]) {
            repeat = true;
            result[j].type='both'
            break;
          }
        }
        if (!repeat) {
          result.push(item);
        }
      }
      return result;
    }
  },
  watch: {
    showError(value) {
      console.log(value)
      if(value) {
        setTimeout(() => {
          this.showError = false
        },2000)
      }
    }
  }
}