<template>
  <div v-if="MYID">
    <div v-if="test != undefined">
      <block>
        <div class="info-block">
          <div  v-if="test?.group" class="group-info" 
            @click="$router.push(`/group/${test?.group.gr_id}`)" >
            <div class="user-item-row">
            <it-avatar :src="test?.group.ico_url" />
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
        <it-divider class="new-divider-small"/>
        <div v-if="test?.user" class="tested-user"
         @click="$router.push(`/user/${test?.user.usr_id}`)">
          <div class="itm-info-label">Решил тест:</div>
          <div class="user-item-row">
          <it-avatar :src="test?.user.avatar" size="30px" />
          <div class="user-name">
            <span>{{ test?.user.first_name+' '+test?.user.last_name }}</span>
          </div>
        </div>
        </div>
        </div>
        <div class="test-result-header-wrapper">
            <it-avatar
            class="test-ico-full"
            size="100px"
            square
            :src="test?.ico_url"
            :text="test.name"
          />
          <div>
            <h3 style="margin-bottom: 0px">{{ test.name }}</h3>
            <pre style="margin-top: 0px">{{ test.description }}</pre>
          </div>
        </div>
        
        <div>Баллы: {{ test.score }} из {{ test.max_score }}</div>

        <it-toggle
          v-if="test?.chronology?.length > 0"
          v-model="resultMode"
          :options="['Ответы', 'Хронология']"
        />
      </block>
      <div v-show="resultMode == 'Ответы'">
        <TestQuests :data="test.body" :mode="'result'" />
      </div>
      <div v-show="resultMode == 'Хронология'">
        <ChronologyView :data="test.chronology" />
      </div>
    </div>
    <div v-else class="center-loading">
      <it-loading></it-loading><br />
      <div>Загрузка</div>
    </div>
  </div>
  <div v-else>
    <block>
      <it-alert
        type="danger"
        :title="'Нет доступа'"
        :body="'Необходимо авторизироваться'"
      />
    </block>
  </div>
</template>

<script>
import TestQuests from "../../components/TestQuests";
import ChronologyView from "@/components/ChronologyView";

export default {
  props: ["set-res-id"],
  components: {
    TestQuests, ChronologyView,
  },
  computed: {
    MYID() {
      return this.$store.getters.MYID;
    },
  },
  data() {
    return {
      res_id: this?.setResId ? this.setResId : this.$route.params.id,
      test: undefined,
      resultMode: 'Ответы',
    };
  },
  methods: {
    SendTest() {
      /*let obj = {
        q: 'test_send',
        me: this.$store.state.ME.data,
        test: this.test,
      }
      this.axios.post(this.apiurl, obj).then(itm => {
        console.log(itm.data);
        if(itm.data?.data){
          let test_id = itm.data?.data;
          this.$router.replace({path: `/test/${test_id}/editor`})
        }
      }); */
    },
  },
  created() {
    //(this.$route.params.id == 'new')
    let obj = {
      q: "get_test_result",
      me: this.$store.state.ME.data,
      res_id: this.res_id,
    };
    this.axios.post(this.apiurl, obj).then((itm) => {
      console.log(itm.data);
      if (itm.data?.data) {
        this.test = itm.data.data;
      }
    });
  },
};
</script>

<style>
.test-result-header-wrapper{
  margin-top: 8px;
  display: grid;
  grid-template-columns: 110px 1fr;
}
textarea.it-textarea {
  overflow: hidden !important;
}
</style>

<style scoped>
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
