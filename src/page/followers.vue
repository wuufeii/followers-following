<template>
  <div class="content">
    <div class="tips">
      <div>注意：</div>
      <div>1.<span>页数为整数，如你的followers为84,则输入的页数为2(算法为followers/50向上取整)</span></div>

      <div>2.<span class="both">❤</span>表示相互follow</div>
      <div>3.<span>❤</span>表示相互follow</div>
      <div>4.请准备一个好的网络....</div>
    </div>
    <div class="query">
      <input type="text" v-model="name" placeholder="请输入github账号">
      <input type="number" v-model="followingPage" placeholder="请输入following页数">
      <input type="number" v-model="followersPage" placeholder="请输入followers页数">
      <button @click="getFollowing('following')">查询</button>
    </div>
    <div v-for="item in followersAndFollowing" :key="item.key" class="item">
      <div class="left">
        <span class="img"><img :src="item.url" :alt="item.key"></span>
        <span class="name" v-if="item.name">{{item.name}}</span>
        <span class="key">{{item.key}}</span>
      </div>
      <div class="btn">
        <button :disabled="item.type!=='followers'">following</button>
        <button :disabled="item.type==='followers'">
          <span class="un" :class="{'both':item.type==='both'}">❤</span> Unfollow
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'

  export default {
    name: "followers",
    data() {
      return {
        type: '',
        name: '',
        followingPage: null,
        followersPage: null,
        allPage: 0,
        followingAll: [],
        followersAll: [],
        followersAndFollowing: [],
        both: []
      }
    },
    mounted() {
      this.getDiff()
    },
    methods: {
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
              console.log('js')
            }
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
        //const following = this.followingAll
        //const followers = this.followersAll
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
    }
  }
</script>

<style scoped>
  .content {
    width: 800px;
    margin: 10px auto;
  }
  .tips {

  }
  .query {
    margin: 10px 0 20px;
  }
  .query input {
    padding: 4px;
  }
  .query button {
    padding: 3px 20px;
  }
.item {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.left {
  display: flex;
  align-items: center;
}
.item .img {
  display: inline-block;
  margin-right: 10px;
  width: 50px;
  height: 50px;
}
.item .img>img {
  display: inline-block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
  .item .name {
    font-size: 16px;
    margin-right: 10px;
  }
  .item .key {
    font-size: 14px;
    color:#586069;
  }
  .btn button {
  }
  .btn .un {
    color: #999;
  }
  .both,
  .btn .both {
    color: red;
  }
</style>
