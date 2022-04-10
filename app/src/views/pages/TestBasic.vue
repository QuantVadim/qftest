<template>
  <div v-if="MYID">
    <!-- Информационный блок -->
    <div v-if="info != undefined && test == undefined" class="_show">
      <block>
        <div class="">
          <div  v-if="info?.group" class="group-info" 
            @click="$router.push(`/group/${info?.group.gr_id}`)" >
            <div class="user-item-row">
            <it-avatar :src="info?.group.ico_url" />
            <div class="user-name">
              <h3>{{ info?.group.group_name }}</h3>
            </div>
            </div>
          </div>
          <div  v-if="info?.autor_test" class="group-info" 
            @click="$router.push(`/user/${info?.autor_test.usr_id}`)" >
            <div class="user-item-row">
            <it-avatar :src="info?.autor_test.avatar" />
            <div class="user-name">
              <h3>{{ info?.autor_test.first_name+' '+info?.autor_test.last_name }}</h3>
            </div>
            </div>
          </div>
        </div>
        <it-divider style="margin-top: 0px"/>
        <div class="">
            <it-avatar
            class="test-ico-full"
            size="140px"
            square
            :src="info?.ico_url"
            :text="info.name"
            style="margin: auto; display: block;"
          />
          <div>
            <h3 style="margin: 6px 2px; font-size: 22px; text-align: center">{{ info.name }}</h3>
            <div v-if="info?.description" class="descript-grid">
              <pre>{{ info.description }}</pre>
            </div>
          </div>
        </div>
      <div style="text-align: center">
        <div v-if="info?.date_start"><b>Начало:</b> {{getNormalDate(info?.date_start, true)}}</div>
        <div v-if="info?.date_end"><b>Окончание:</b> {{getNormalDate(info?.date_end, true)}}</div>
        <div  style="margin-top: 10px"  v-if="info?.duration_time"><b>Длительность:</b> {{ info?.duration_time+" мин." }}</div>
        <div v-if="info?.attempts"><b>Попыток:</b> {{ Math.max(0, info?.attempts - info?.my_attempts)+" из "+ info?.attempts}}</div>
        <div style="margin-top: 4px">
          <Button v-if="info?.attempts == undefined || ((info?.attempts - info?.my_attempts) > 0)" :label="info?.res_id ? 'Продолжить' : 'Начать тест'" @click="Load" :loading="isLoading" />
        </div>
      </div>
      </block>
    </div>
    <!-- /Информационный блок -->

    <div v-if="test != undefined" class="_show">
      <!-- Шапка теста -->
      <block>
        <div class="">
          <div  v-if="test?.group" class="group-info" 
            @click="$router.push(`/group/${test?.group.gr_id}`)" >
            <div class="user-item-row">
            <it-avatar :src="test?.group.user_avatar" />
            <div class="user-name">
              <h3>{{ test?.group.group_name }}</h3>
            </div>
            </div>
          </div>
          <div  v-if="test?.autor_test" class="group-info" 
            @click="$router.push(`/user/${test?.autor_test.usr_id}`)" >
            <div class="user-item-row">
            <it-avatar :src="test?.autor_test.avatar" />
            <div class="user-name">
              <h3>{{ test?.autor_test.first_name+' '+test?.autor_test.last_name }}</h3>
            </div>
            </div>
          </div>
        </div>
        <it-divider style="margin-top: 0px"/>
        <div class="test-basic-header-wrapper">
            <it-avatar
            class="test-ico-full"
            size="100px"
            square
            :src="test?.ico_url"
            :text="test.name"
          />
          <div>
            <h3 style="margin: 0px">{{ test.name }}</h3>
            <pre style="margin-top: 6px">{{ test.description }}</pre>
          </div>
        </div>
        <div v-if="test?.duration_time">Осталось: {{ timeLeft }}</div>
      </block>
      <!-- /Шапка теста -->
      <BlockUI :blocked="secondsLeft <= 0"> 
        <TestQuests :data="test.body" :mode="'basic'" @change-card-state="ChangeCardState" />
      </BlockUI>
      <block style="text-align: center">
        <Button icon="pi pi-check" @click="SendTest" :loading="isSendingTest" label="Отправить" />
        <span v-if="test?.res_id && isTimeOver == false" style="margin-left: 5px">
          <Button icon="pi pi-save" @click="SaveResult" :loading="isResultSaving" label="Сохранить" />
        </span>
        
      </block>
    </div>
    <div v-if="test == undefined && info == undefined" class="center-loading">
      <it-loading></it-loading><br />
      <div>Загрузка</div>
    </div>
  </div>
  <div v-else>
    <block>
      <it-alert type="danger" :title="'Нет доступа'" :body="'Необходимо авторизироваться'"/>
    </block>
  </div>
</template>


<script>
import TestQuests from "../../components/TestQuests";
import {getNormalDate} from "@/others/helpers";
import Block from '../../components/Block.vue';
import Button from "primevue/button";
import BlockUI from 'primevue/blockui';

export default {
  components: {
    TestQuests, Block, Button, BlockUI,
  },
  computed:{
    MYID(){return this.$store.getters.MYID;}
  },
  data() {
    return {
      isLoading: false,
      isResultSaving: false,
      isSendingTest: false,
      info: undefined,
      test: undefined,
      timeLeft: undefined,
      secondsLeft: undefined,
      timeInterval: undefined,
      saveTestSeconds: 60,
      isTimeOver: false, //Время на решение теста закончилось (показ кнопки сохранения)
      TestState: undefined, //Бэкап теста при завершении таймера

      lastCardChangedEvent: undefined, //последее состояние измененяемой карты
      allEvents: [],
    };
  },
  methods:{
    ChangeCardState(data){
      this.GeneralEvent('cardChange', data);
      console.log(data);
    },
    getNormalDate,
    startTimer(){
      if(this?.test?.gr_id != undefined){
        this.computeTimeLeft();
        if(this?.timeInterval != undefined){
          clearInterval(this.timeInterval);
          console.log('clearInterval');
        }
        this.timeInterval = this.test?.gr_id != undefined ? setInterval(()=>{this.computeTimeLeft()}, 1000) : undefined; //Установа счетчика времени
      }
    },
    computeTimeLeft(){
      console.log('Секунда');
      if(this?.test && this?.test?.duration_time && this?.test?.date_created){
        let tc = new Date();
        let ti = new Date( Date.parse(this?.test?.date_created) );
        let sec = this?.test?.duration_time*60 - Math.floor((tc - ti)/1000);
        this.saveTestSeconds--;
        this.secondsLeft = sec;
        this.timeLeft = (sec/60 >=1 ? Math.floor(sec/60) +"м. ": '')+(sec%60+'c.');
        if(this.saveTestSeconds <= 0){
          this.saveTestSeconds = 60;
          this.SaveResult();
        }
        if(sec <= 0){
          this.isTimeOver = true;
          this.SendTest();
          clearInterval(this.timeInterval);
        }
      }else if(this?.test && this?.test?.date_created){
        this.saveTestSeconds--;
        if(this.saveTestSeconds <= 0){
          this.saveTestSeconds = 60;
          this.SaveResult();
        }
      }
    },
    async SaveResult(){
      this.isResultSaving = true;
      this.GeneralEvent();
      let obj = {
        q: 'save_gtest_result',
        me: this.getUser(),
        test: this.test,
        events: this.allEvents,
      }
      this.axios.post(this.apiurl, obj).then(itm => {
        this.isResultSaving = false;
        this.allEvents = [];
        console.log(itm.data);
        if(itm.data?.data){
          console.log('Сохранил тест');
        }else if(itm.data?.error){
           this.$error("Ошибка сохранения", itm.data?.error);
        }
      }).catch(()=>{
        this.isResultSaving = false;
        this.$error("Ошибка сохранения", "Возможно, отсутствует подключение к сети");
      });
    },
    async SendTest(){
      this.isSendingTest = true;
      this.GeneralEvent();
      let sendingTest = this.test;
      if(this.isTimeOver && this.TestState == undefined){//сохранить состояние теста в TestState, если время решения закончено и состояние еще не сохранено
        this.TestState = JSON.parse(JSON.stringify(this.test));
        console.log('Сохранено состояние теста');
      }else if(this.TestState != undefined){//При вовторной отправки, если есть сохраненное сосояние, то отправить его
        sendingTest = this.TestState;
        console.log('Отрправлено сохраненное ранее состояние теста');
      }
      let obj = {
        q: 'test_send',
        me: this.getUser(),
        test: sendingTest,
        events: this.allEvents,
      }
      this.axios.post(this.apiurl, obj).then(itm => {
        this.isSendingTest = false;
        console.log(itm.data);
        if(itm.data?.data){
          let test_id = itm.data?.data;
          this.allEvents = [];
          if(this?.timeInterval != undefined){
            clearInterval(this.timeInterval);
            console.log('clearInterval');
          }
          this.$router.replace({path: `/result/${test_id}`});
        }else if(itm.data?.error){
          this.$error("Ошибка отправки теста", itm.data?.error);
        }else{
           this.$error("Ошибка отправки теста", "Неизвестная ошибка");
        }
      }).catch(()=>{
        this.isSendingTest = false;
        this.$error("Ошибка отправки теста", "Отсутствует соединение");
      });
    },
    async LoadInfo(){
      this.isLoading = true;
      let obj = {
        q: 'get_test_info',
        me: this.getUser(),
      }
      if(this.$route.params.id){
        obj.test_id = this.$route.params.id 
      }else if(this.$route.params.gid){
         obj.gtest_id = this.$route.params.gid
      }
      this.axios.post(this.apiurl, obj).then(itm => {
        this.isLoading = false;
        console.log(itm.data);
        if(itm.data?.data){
          this.info = itm.data.data;
        }
      });
    },
    async Load(){
      this.isLoading = true;
      let obj = {
        q: 'get_test_basic',
        me: this.getUser(),
      }
      if(this.$route.params.id){
        obj.test_id = this.$route.params.id
      }else if(this.$route.params.gid){
         obj.gtest_id = this.$route.params.gid
      }
      this.axios.post(this.apiurl, obj).then(itm => {
        this.isLoading = false;
        console.log(itm.data);
        if(itm.data?.data){
          this.test = itm.data.data;
          this.startTimer();
          this.GeneralEvent('load');
        }else if(itm.data?.error){
          this.$error("Ошибка загрузки теста", itm.data?.error);
        }
      });
    },
    GeneralEvent(name, state){
      if(this.test == undefined || this.isTimeOver) return false;
      if(name == undefined){
        if(this.lastCardChangedEvent != undefined){
          this.lastCardChangedEvent.state = JSON.parse(JSON.stringify(this.lastCardChangedEvent.state));
          this.allEvents.push(this.lastCardChangedEvent);
          this.lastCardChangedEvent = undefined;
          return false;
        }
      }
      let time = new Date();
      let obj = {
        name: name,
        time: time.getTime(),
      }
      if(name == 'cardChange' && state != undefined){
        obj.state = state;
        obj.cardId = state.id;
        
        if(this.lastCardChangedEvent?.cardId == state.id){
            this.lastCardChangedEvent = obj;
        }else{
          if(this.lastCardChangedEvent != undefined){
            this.lastCardChangedEvent.state = JSON.parse(JSON.stringify(this.lastCardChangedEvent.state));
            this.allEvents.push(this.lastCardChangedEvent);
          }
          this.lastCardChangedEvent = obj;
        }
      }else{
        if(this.lastCardChangedEvent != undefined){
          this.lastCardChangedEvent.state = JSON.parse(JSON.stringify(this.lastCardChangedEvent.state));
          this.allEvents.push(this.lastCardChangedEvent);
          this.lastCardChangedEvent = undefined;
        }
        this.allEvents.push(obj);
      }

    },
    OnBlur(){//Потеря активности страницы
      this.GeneralEvent('blur')
    },
    OnFocus(){//Возврат активности страницы
      this.GeneralEvent('focus')
    }
  },
  activated(){
    window.addEventListener('blur', this.OnBlur);
    window.addEventListener('focus', this.OnFocus);
  },
  deactivated(){
    window.removeEventListener('blur', this.OnBlur);
    window.removeEventListener('focus', this.OnFocus);
  },
  beforeUnmount(){
    if(this?.test?.gr_id && (this?.test?.duration_time != undefined && this.secondsLeft > 0)){
      this.SaveResult();
    }else if(this?.test?.gr_id && this?.test?.duration_time == undefined){
      this.SaveResult();
    }
  },
  unmounted(){
    if(this.timeInterval){
      clearInterval(this.timeInterval);
      console.log('clearInterval');
    }
    console.log('Неактивно!');
  },
  created(){
    this.LoadInfo();
  },
};
</script>

<style>
.descript-grid{
  display: grid;
  grid-template-columns: 100%;
  justify-content: center;
  width: 100%;
  justify-items: center;
}
.descript-grid pre{
  width: max-content;
  background-color: whitesmoke;
  border: 1px solid #eaeaea;
  padding: 6px 10px;
  border-radius: 6px;
  max-width: -webkit-fill-available;
  white-space: pre-wrap;
  margin: 4px;
}
.test-basic-header-wrapper{
  display: grid;
  grid-template-columns: 110px 1fr;
}
textarea.it-textarea {
  overflow: hidden !important;
}
</style>

<style scoped>
.p-blockui {
    border-radius: 8px !important;
    margin-top: -8px !important;
}
.user-name h3{
  margin: 0px;
}
.new-divider-small{
  margin-top: 4px;
  margin-bottom: 4px;
}
.itm-info-label{
  margin-bottom: 6px;
}
.group-info{
  margin-bottom: 6px;
  color: gray;
}
.user-item-row{
  display: grid;
  grid-template-columns: 45px 1fr;
  align-items: center;
}
.tested-user .user-item-row{
  padding-left: 16px;
  grid-template-columns: 35px 1fr;
}
.info-block{
  padding: 6px;
  background-color: rgb(243, 243, 243);
  box-shadow: 0px 0px 3px 3px rgb(226, 226, 226);
  border-radius: 8px;
  border: 1px rgb(209, 209, 209) solid;
}
</style>
