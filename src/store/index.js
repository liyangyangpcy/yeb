import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from '../utils/api'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Notification } from 'element-ui';


Vue.use(Vuex);

const now = new Date();

const store =  new Vuex.Store({
    state: {
        routes: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
        sessions:{},          //存储聊天记录
        admins:[],           //接受获取其他用户的接口返回的数据
       currentSession:null,
       filterKey:'',
       stomp:null,
       idDot:{}

   },
    mutations: {
       INIT_ADMIN(state,admin){
              state.currentAdmin=admin;
       },

        //初始化路由
        initRoutes(state, data) {
            state.routes = data;
       },
       
       changeCurrentSession (state,currentSession) {
              state.currentSession = currentSession;
              Vue.set(state.idDot, state.currentAdmin.username+'#'+state.currentSession.username, false);

       },
       //保存消息内容
       addMessage (state,msg) {      
              let mss=state.sessions[state.currentAdmin.username+'#'+msg.to];
              if(!mss){
                     // state.sessions[state.currentAdmin.username+'#'+msg.to]=[];
                     Vue.set(state.sessions,state.currentAdmin.username+'#'+msg.to,[]);
              }
              state.sessions[state.currentAdmin.username+'#'+msg.to].push({
                     content:msg.content,
                     date: new Date(),
                     self:!msg.notSelf
              })
       },
       INIT_DATA (state) {
              //浏览器本地的历史聊天记录
               let data = localStorage.getItem('vue-chat-session');
               //console.log(data)
               if (data) {
                      state.sessions = JSON.parse(data);
               }
       },
       INIT_ADMINS(state, data){
              state.admins = data;

       }
   },
    actions: {
        connect(context){  //要在登录进来时，就进行websocket链接，在vuex中写方法
              context.state.stomp = Stomp.over(new SockJS('/ws/ep'));  //后端提供ws/ep端点链接，消息会转到/queue/chat队列，消息对象
              let token = window.sessionStorage.getItem('tokenStr');
              context.state.stomp.connect({'Auth-Token':token},success =>{
                     //订阅消息频道，拿到msg回调，通过频道获取到消息体
                     context.state.stomp.subscribe('/user/queue/chat',msg=>{
                            let receiveMsg=JSON.parse(msg.body);
                            console.log(receiveMsg);
                            if(!context.state.currentSession  || receiveMsg.from!=context.state.currentSession.username){
                                   Notification.info({
                                          title:'【'+receiveMsg.fromNickName+'】发来一条消息',
                                          message:receiveMsg.content.length>10?receiveMsg.content.substr(0,10):receiveMsg.content,
                                          position: 'bottom-right',
                                   });
                                   Vue.set(context.state.idDot, context.state.currentAdmin.username+'#'+receiveMsg.from, true);
                            }
                            receiveMsg.notSelf=true;
                            receiveMsg.to=receiveMsg.from;
                            context.commit('addMessage', receiveMsg);
                     })
              },error=>{

              }) //整个项目使用jwt令牌，并且后端对jwt令牌进行了登录拦截，获取token传到后端,传参，两种回调
        },

       initData (context) {   
              context.commit('INIT_DATA');    
              getRequest('/chat/admin').then(resp=>{
                     if(resp){
                            context.commit('INIT_ADMINS',resp)  //异步=》初始化 mutition里INIT_DATA-》从local storage获取了vue-chat-session 然后给state里面admins数组赋值
                     }
              })                         //获取其他用户列表，在这里写
       }
   }  
})

store.watch(function (state) {    //watch监控
       return state.sessions
     },function (val) {
       console.log('CHANGE: ', val);
       localStorage.setItem('vue-chat-session', JSON.stringify(val));
     },{
       deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})
     
     
export default store;