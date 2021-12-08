<template>
  <div v-if="MYID">
    <div v-if="test != undefined">
      <block class="test-header-wrapper">
        <div>
          <it-avatar
            class="test-ico-full"
            style="cursor: pointer"
            size="100px"
            square
            :src="test?.ico_url"
            :text="test.name"
            @click="isImageSelector = true"
          />
        </div>
        <div>
          <it-input v-model="test.name" placeholder="Название"></it-input>
          <it-textarea
            v-model="test.description"
            :resize-on-write="true"
            placeholder="Описание"
          ></it-textarea>
        </div>
      </block>
      <TestQuests :data="test.body" :mode="'editor'" />
      <block>
        <it-button block @click="SaveTest">Сохранить</it-button>
      </block>
    </div>
    <div v-else-if="error == false" class="center-loading">
      <it-loading></it-loading><br />
      <div>Загрузка</div>
    </div>
    <div v-else>
      <block>
        <it-alert
          type="danger"
          :title="'Ошибка'"
          :body="'У вас нет доступа к этопу объекту'"
        />
      </block>
    </div>
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
        :title="'Нет доступа'"
        :body="'Необходимо авторизироваться'"
      />
    </block>
  </div>
</template>

<script>
import TestQuests from "../../components/TestQuests";
//import Button from "primevue/button";
import ImageSelector from "@/components/Menus/ImageSelector";

export default {
  components: {
    TestQuests,
    //Button,
    ImageSelector,
  },
  computed: {
    MYID() {
      return this.$store.getters.MYID;
    },
  },
  data() {
    return {
      isImageSelector: false,
      test: undefined,
      error: false,
    };
  },
  beforeRouteLeave() {
    return confirm("Вы уверены, что хотите уйти?");
  },
  methods: {
    SaveTest() {
      let obj = {
        q: "test_save",
        me: this.$store.state.ME.data,
        test: this.test,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        console.log(itm.data);
        if (itm.data?.data) {
          let test_id = itm.data?.data;
          this.$router.replace({ path: `/test/${test_id}/editor` });
        }
      });
    },
    SelectImage(img) {
      if (this.test != undefined) {
        this.test.ico_url = img.url;
        this.test.ico = img.img_id;
      }
    },
  },
  created() {
    if (this.$route.params.id == "new") {
      this.test = {
        test_id: this.$route.params.id,
        usr_id: this.MYID,
        name: "Новый тест",
        description: "",
        body: [],
      };
    } else {
      let obj = {
        q: "get_test_editor",
        me: this.$store.state.ME.data,
        test_id: this.$route.params.id,
      };
      this.axios.post(this.apiurl, obj).then((itm) => {
        console.log(itm.data);
        if (itm.data?.data) {
          this.test = itm.data.data;
        } else if (itm.data?.error) {
          this.error = itm.data.error;
        }
      });
    }
  },
};
</script>

<style>
.test-header-wrapper .content{
  display: grid;
  grid-template-columns: 110px 1fr;
}
textarea.it-textarea {
  overflow: hidden !important;
}
</style>
