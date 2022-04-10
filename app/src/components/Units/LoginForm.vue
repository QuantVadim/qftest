<template>
  <div class="login-form">
    <br>
    <div>Необходимо выполнить вход</div><br>
    <it-input prefix="Логин" v-model="login" @keyup.enter="goToPasswordInput"/>
    <it-input prefix="Пароль" ref="password" type="password" v-model="password" @keyup.enter="enterDef" />
    <it-button block :type="'primary'" style='height: 41px;' @click="enterDef" outlined>Войти</it-button>
    <it-divider/>
    <it-button block :type="'primary'" class='h-enter-vk' @click="enterVK">Войти через Вконтакте</it-button>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  setup() {
    
  },
  data(){
    return{
      waitingLogin: false,
      login: '',
      password: '',
    }
  },
  methods:{
    ...mapActions(["LOAD_USER"]),
    enterVK(){//Вход через Вконтакте
      document.location = this.conf.VK_AUTH_URL;
    },
    enterDef(){//Вход через стандартный аккаунт
      this.waitingLogin = true;
      this.axios.post(this.conf.AUTH_URL, {
        login: this.login,
        password: this.password,
        sn: 'def'
      }).then(respon => {
        this.waitingLogin = false;
        if(!respon.data?.error){
              localStorage.setItem('usr_id', respon.data.usr_id);
              localStorage.setItem('mykey', respon.data.mykey);

              this.LOAD_USER();
              this.$router.push('/');
        }else{
          this.$error("Ошибка авторизации", respon.data?.error || "Неизвестная ошибка");
        }
      }).catch(()=>{ 
        this.waitingLogin = false;
        this.$error("Ошибка авторизации", "Проблемы с соединением");
        });
    },
    goToPasswordInput(){
      let inp = this.$refs.password.$el.getElementsByTagName("input");
      if(inp){
        inp[0].focus();
      }
    }
  }
}
</script>

<style>
.login-form .it-input-prefix-wrapper{
  margin-bottom: 6px !important;
}
.h-enter-vk{
  display: block;
  height: 41px;
}
</style>