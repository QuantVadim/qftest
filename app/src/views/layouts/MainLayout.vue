<template>
<div :class="{'wide-content-mode': IsWideContent}">
  <header>
    <div class="header-content main-center">
      <div class="btn-sidebar-menu">
        <it-icon @click="menuIsActive = true" color="white" name="menu" />
      </div>
      <div></div>
      <div>
        <div v-if="MYID" class="header_user_info" @click="goRoute(mainProfile)">
          {{ $store.state.ME.data.first_name }}
          <it-avatar size="36px" :src="$store.state.ME.data.avatar" />
        </div>
        <div class="h-vk-enter" v-else>
          <it-button outlined text class="h-enter-vk" @click="enterVK"
            >Вход</it-button
          >
        </div>
      </div>
    </div>
  </header>
  <div class="main-grid-center">
    <div class="_part _left">
      <div class="main-logo"><img src="/vimg/logo.png" height="30" alt=""><span>QF Тесты</span></div>
      <div><Navigat /></div>
    </div>
    <main class="main" @mousedown="SaveScroll">
      <!-- <keep-alive>
        <router-view :key="$route.path" class="enter-show" />
      </keep-alive> -->
      
  <router-view v-slot="{ Component }" class="enter-show">
    <div>
      <keep-alive :max="2">
        <component @activated="ActivatedKeepAlive" v-if="isKeepAlive"  :is="Component" :key="$route.path" />
      </keep-alive>
    </div>
    <div v-if="!isKeepAlive">
      <div>Hello</div>
      <component :is="Component" :key="$route.path" />
    </div>
    
  </router-view>
    </main>
    <div class="_part"></div>
  </div>
  <Sidebar v-model:visible="menuIsActive" class="p-sidebar-sm">
    <h3 class="h3-title">Меню</h3>
    <Navigat @click="menuIsActive = false" />
  </Sidebar>
  <it-modal >
    <template #body>
      Ок
    </template>
  </it-modal>
</div>
</template>

<script>
import Navigat from "../../components/Navigat.vue";
import Sidebar from "primevue/sidebar";
import conf from "@/conf.js";

export default {
  components: {
    Sidebar,
    Navigat,
  },
  data() {
    return {
      Main: undefined,
      keepAlives: ['group', 'mytests', 'myresults'],
      ScrollInfo: {},
      IsWideContent: false,

      NecessarilyUser: ["MyTests"],
      menuIsActive: false,
      isActive: true,
    };
  },
  computed: {
    isKeepAlive(){
      for(let i = 0; i < this.keepAlives.length; i++){
        if(this.$route.path.indexOf(this.keepAlives[i] >= 0)){
          return true;
        }
      }
      return false;
    },
    stt(){
      return window.history.state;
    },
    mainProfile() {
      return "/user/" + this.$store.state.ME.data.usr_id;
    },
    MYID() {
      return this.$store.getters.MYID;
    },
  },
  
  mounted(){
    this.Main = document.querySelector('.main');
    this.UpdateWidePage()
    //Наблюдение за Изменением пути:
    this.$watch( ()=>this.$route.path, ()=>{
      this.UpdateWidePage()
    })
  },
  methods: {
    UpdateWidePage(){
      let isWideContent = false;
      for (let i = 0; i < conf.WidePages.length; i++) {
        if(this.$route.path.indexOf(conf.WidePages[i]) == 0){
          isWideContent = true; break;
        }
      }
      this.IsWideContent = isWideContent;
    },
    ActivatedKeepAlive(){
      if(this.Main)
      for(let i = 0; i < this.keepAlives.length; i++){
        if(this.$route.path.indexOf(this.keepAlives[i]) >= 0){
          this.Main.scrollTop = this.ScrollInfo[this.keepAlives[i]]
        }
      }
    },
    SaveScroll(){
      if(this.isKeepAlive){
        for(let i = 0; i < this.keepAlives.length; i++){
          if(this.$route.path.indexOf(this.keepAlives[i]) >= 0){
            this.ScrollInfo[this.keepAlives[i]] = this.Main.scrollTop;
          }
        }
      }
    },
    goRoute(route) {
      this.$router.push(route);
      this.menuIsActive = false;
    },
    enterVK() {
      document.location =
        "https://oauth.vk.com/authorize?client_id=7870026&display=page&redirect_uri=http://localhost:8080/auth/vk&scope=offline&response_type=token&v=5.52";
    },
  },
};
</script>


<style>

@keyframes enter-logo {
  from{
    opacity: 0;
    transform: translateX(20px);
    transition: 0.2s all;
  }
  to{
    opacity: 1;
    transform: translateX(0px);
  }
}
._part._left{
 animation: ease-in-out 0.2s enter-logo;
}
.main-logo{
  animation: 0.2s enter-logo;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  position: absolute;
  z-index: 4;
  margin-top: -53px;
  font-size: 24px;
  color: white;
}
.main-grid-center>._part{
  display: block;
}
._part._left{
  padding: 10px;
  background-color: white;
  height: max-content;
  max-width: 300px;
  width: 100%;
  margin-left: auto;
  border-radius: 8px;
  margin-top: 8px;
}
.main-grid-center>main{
  margin: inherit;
  max-width: 600px;
  overflow-y:auto;
  height: calc( 100vh - 42px);
}
.main-grid-center{
  display: grid;
  grid-template-columns: 1fr 600px 1fr;
}
.btn-sidebar-menu i{
  display: none !important;
}
@media screen and (max-width: 900px) {
.main-grid-center > ._part{display: none !important;}
.main-grid-center>main{
  margin: auto;
  max-width: 600px;
}
.main-grid-center{
  display: block;
}
.btn-sidebar-menu i{
  display: inline-block !important;
}
}
.wide-content-mode .main-grid-center > ._part{display: none !important;}
.wide-content-mode .main-grid-center>main{
  margin: auto;
  max-width: 700px;
}
.wide-content-mode .main-grid-center{
  display: block;
}
.wide-content-mode .btn-sidebar-menu i{
  display: inline-block !important;
}



.it-toggle{
  margin-left: 8px;
  margin-right: 8px;
}
.block .it-toggle{
  margin-left: 0px;
  margin-right: 0px;
}

.main-center {
  margin: auto;
  max-width: 600px;
  transition: 0.2s all;
}
.enter-show {
  animation: enter-show 0.4s;
}
@keyframes enter-show {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.h-enter-vk {
  display: block;
  color: white !important;
  height: 41px;
}
.header_user_info {
  color: white;
  padding: 4px;
  cursor: pointer;
}
.p-sidebar-header {
  padding-bottom: 0px !important;
}
h3.h3-title {
  padding: 0px 0px;
  margin: 0px;
  margin-bottom: 10px;
}
header .it-drawer-body > div {
  margin: 16px;
}
header i {
  padding: 5px;
  padding-left: 10px;
  font-size: 32px !important;
  width: 32px;
  height: 32px;
  background-size: cover;
  cursor: pointer;
}
header {
  background-color: rgb(72, 101, 156);
  height: 42px;
}
.header-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
}
.wide-content-mode .main-center {
  margin: auto;
  max-width: 700px;
}
</style>