<template>
  <div v-if="error == false">
    <div v-if="group" @mousedown="saveScroll">
      <it-toggle
        v-if="this.group.usr_id == this.$store.state.ME.data.usr_id"
        v-model="tab"
        :options="['Группа', 'Администрирование']"
      />
      <div v-if="tab == 'Группа'">
        <block style="margin-top: 60px;">
          <div style="color: gray; margin-left: 6px;">{{ group.count_users }} ч.</div>
          <div class="group-header-image-wrapper">
            <it-avatar
            class="test-ico-full"
            :style="this.group.usr_id == this.$store.state.ME.data.usr_id ? 'cursor: pointer;' : ''"
            size="120px"
            :src="group?.ico_url"
            :text="group.name"
            @click="this.group.usr_id == this.$store.state.ME.data.usr_id ? isImageSelector = true : ''"
          />
          </div>
          <div>
            <h3 style="margin: 8px 0px; text-align: center">{{ group.name }}</h3>
            <pre v-if="group.description">{{ group.description }}</pre>
          </div>
          
        </block>
        <block>
            <GTestsLIst :data="cashTests" @cash="toCashTests" />
        </block>
      </div>
      <div v-if="tab == 'Администрирование'">
        <block>
          <it-checkbox
            @click="SwitchJoinGroup"
            :disabled="isWaitJoinGroup"
            :type="'primary'"
            :label="'Вступление в группу'"
            v-model="isJoinGroup"
          />
          <div v-if="isJoinGroup && group.join_key.length > 1">
            <it-input prefix="Код" v-model="join_code" readonly />
            <it-input prefix="Ссылка" v-model="join_link" readonly />
          </div>
        </block>
        <block>
          <h3>Люди</h3>
          <it-toggle v-model="tabPeople" :options="['Участники', 'Заявки']" />
          <GroupUsers
            @cash="CashItems"
            :data="getCashUsers"
            :gr_id="$route.params.id"
            :accepted="tabPeople == 'Участники'"
            :key="tabPeople"
          />
        </block>
      </div>
    </div>
    <Sidebar v-model:visible="isOpenResult" position="bottom" class="win-result"> 
        <div class="sidebar-conent-center">
            <TestResult :key="$route.query?.result" :set-res-id="$route.query?.result" />
        </div>
    </Sidebar>
    <!-- Выбор изображения: -->
    <it-modal v-model="isImageSelector">
      <template #header>
        <h3 style="margin: 0px">Выбор изображения</h3>
      </template>
      <template #body>
        <ImageSelector @select="SelectImage" @close="isImageSelector = false" />
      </template>
      <template #actions>
        <it-button @click="isImageSelector = false">Отмена</it-button>
        <!-- <it-button :loading="isDeletingGTest" @click="DeleteGTest" type="danger">Удалить</it-button> -->
      </template>
    </it-modal>
  </div>
  <div v-else>
    <block>
      <it-alert
        type="danger"
        :title="'Отказано в доступе'"
        :body="'Вы не состоите в группе'"
      />
    </block>
  </div>
</template>

<script>
import GroupUsers from "../../components/Lists/GroupUsers.vue";
import GTestsLIst from "../../components/Lists/GTestsList.vue";
import TestResult from "../../views/pages/TestResult.vue";
import Sidebar from "primevue/sidebar";
import ImageSelector from "@/components/Menus/ImageSelector";
// @ is an alias to /src

export default {
  components: {
    GroupUsers, GTestsLIst, TestResult, Sidebar, ImageSelector
  },
  data() {
    return {
      tab: "Группа",
      tabPeople: "Участники",
      isJoinGroup: true,
      isWaitJoinGroup: false,
      isImageSelector: false,
      key: "dg",
      error: false,
      cashTests: false,
      cashUsers: [false, false],
      group: undefined,
      result_id: null,
      isOpenResult: false,

      ScrollY: 0,
    };
  },
  computed: {
    winResult(){
      return this.$route.query?.result;
    },
    join_link() {
      return (
        window.location.origin +
        "/join/" +
        this.group.gr_id +
        "/" +
        this.group.join_key
      );
    },
    join_code() {
      return this.group.gr_id + "/" + this.group.join_key;
    },
    getCashUsers() {
      if (this.tabPeople == "Участники") return this.cashUsers[0];
      else return this.cashUsers[1];
    },
  },
  watch: {
    winResult(){
      this.isOpenResult = this.$route.query?.result ? true : false;
      console.log('ss', this.isOpenResult );
    },
    isOpenResult(){
      if(this.isOpenResult == false) this.$router.push({query: {}});
    }
  },
  activated(){
    this.$emit('activated');
  },
  mounted() {
    this.GroupLoad();
  },
  methods: {
    SelectImage(img){
      let obj = {
        me: this.$store.state.ME.data,
        q: "set_group_ico",
        gr_id: this.group.gr_id,
        img_id: img.img_id,
      }
      this.axios.post(this.apiurl, obj).then((itm)=>{
        if(itm.data?.data){
          this.$success('Изображение изменено', 'Изображение группы было успешно изменено');
          this.group.ico_url = img.url;
        }else{
          this.$error("Ошибка изменения изображения", itm.data?.error || "Неизветсная ошибка")
          console.log(itm.data);
        }
      }).catch(()=>{
        this.$error("Ошибка изменения изображения", "Нет ответа сервера")
      });
      
    },
    OpenResult(res_id){
      console.log(res_id);
      this.result_id = res_id;
      this.isOpenResult = true;
    },
    toCashTests(items){
      this.cashTests = items;
    },
    CashItems(items) {
      if (this.tabPeople == "Участники") this.cashUsers[0] = items;
      else this.cashUsers[1] = items;
    },
    SwitchJoinGroup() {
      setTimeout(() => {
        this.isWaitJoinGroup = true;
        this.group.join_key = "";
        let obj = {
          q: "switch_joining_grop",
          me: this.$store.state.ME.data,
          gr_id: this.$route.params.id,
          is_joining: this.isJoinGroup,
        };
        this.axios.post(this.apiurl, obj).then((itm) => {
          console.log(itm.data);
          if (itm.data?.data) {
            this.group.join_key = itm.data.data;
            this.isJoinGroup = itm.data.data.length > 5;
          }
          this.isWaitJoinGroup = false;
        });
      }, 0);
    },
    GroupLoad() {
      let obj = {
        q: "get_group_info",
        me: this.$store.state.ME.data,
        gr_id: this.$route.params.id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        console.log(itm.data);
        if (itm.data?.data) {
          this.group = itm.data.data;
          this.isJoinGroup = itm.data.data.join_key.length > 5;
        } else if (itm.data?.error) {
          this.error = itm.data?.error;
        }
      });
    },
  },
};
</script>

<style>
.group-header-image-wrapper .it-avatar{
  margin: auto;
  position: relative;
  margin-top: -70px;
  outline: 6px solid white;
  display: block;
}
.p-sidebar{
 z-index: 9999999 !important;
}
.win-result.p-sidebar{
  height: 100vh !important;
  background-color: rgb(206, 206, 206);
}
.win-result .p-sidebar-header{
  box-shadow: 0px 8px 8px #cecece;
  z-index: 1;
}
.win-result .sidebar-conent-center{
  max-width: 700px;
  margin: auto;
}
.win-result .p-sidebar-content{
  margin: 0px;
  padding: 0px;
}
.p-sidebar-mask{
  z-index: 999999 !important;
}
</style>