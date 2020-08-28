<template>
  <div class="content">
    <div class="query" :class="{'top':showLeft}">
      <input type="text" class="input-no-right-border" v-model="name" placeholder="请输入github账号" />
      <button class="btn" @click="queryUser">查询</button>
    </div>
    <div class="info">
      <div class="left" v-if="showLeft">
        <img :src="userForm.url" :alt="userForm.key" />
        <div class="name">
          <span>{{userForm.name}}</span>
          <span>{{userForm.key}}</span>
        </div>
        <div class="info-item">
          <div>
            <span>followers:</span>
            <span>{{userForm.followers}}</span>
          </div>
          <div>
            <span>following:</span>
            <span>{{userForm.following}}</span>
          </div>
          <div>
            <span>stars:</span>
            <span>{{userForm.stars}}</span>
          </div>
        </div>
        <div class="btn info-btn" @click="queryFollow">followers比较</div>
        <div>注意：</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;1.<span class="both">❤</span>表示相互follow</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;2.<span>❤</span>表示单向follow</div>
      </div>
      <img class="leftLoading" v-show="loadingLeft" src="../assets/img/loading.gif" alt="loading" />
      <div class="right" v-if="showRight">
        <img class="rightLoading" v-show="loadingRight" src="../assets/img/loading.gif" alt="loading" />
        <div v-for="item in followersAndFollowing" :key="item.key" class="item">
          <div class="item-info">
            <span class="img"><img :src="item.url" :alt="item.key"></span>
            <span class="name" v-if="item.name">{{item.name}}</span>
            <span class="key">{{item.key}}</span>
          </div>
          <div>
            <button class="btn" :disabled="item.type!=='followers'">following</button>
            <button class="btn" :disabled="item.type==='followers'">
              <span class="un" :class="{'both':item.type==='both'}">❤</span> Unfollow
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="error" v-show="showError">{{errorTips}}</div>
  </div>
</template>

<script>
  import {dataMixins} from "./index";
  export default {
    name: "index",
    mixins: [dataMixins]
  }
</script>

<style lang="less" scoped>
@import "./index.less";
</style>