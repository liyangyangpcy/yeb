<!--消息收发websocket  npm install sockjs-client/npm install stompjs      -->

<template>
  <div id="usertext">
    <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keyup="addMessage"></textarea>
  </div>
</template>

<script>

import {mapState} from 'vuex'

export default {
  name: 'usertext',
  data () {
    return {
      content:''
    }
  },
   computed: mapState([
    "currentSession"
  ]),
  methods: {
  	addMessage (e) {
  		if (e.ctrlKey && e.keyCode ===13 && this.content.length) {
  		
        //消息对象
        let msgObj= new Object();
        msgObj.to=this.currentSession.username;
        msgObj.content=this.content;
        //发送消息，转成字符串
        this.$store.state.stomp.send('/ws/chat',{}, JSON.stringify(msgObj));

      	this.$store.commit('addMessage',msgObj);
  			this.content='';
  		}
  	}
  }
}
</script>

<style lang="scss" scoped>
#uesrtext {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;
  > textarea {
  	padding: 10px;
  	width: 100%;
  	height: 100%;
  	border: none;
  	outline: none;
  }
}
</style>
