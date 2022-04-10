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
      <TestQuests ref="parentTestBody" :data="test.body" :mode="'editor'" @change-list="SetBody" />
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
          :body="'У вас нет доступа к этому объекту'"
        />
      </block>
    </div>
    <it-modal v-model="isImageSelector">
      <template #header>
        <h3 style="margin: 0px">Выбор изображения</h3>
      </template>
      <template #body>
        <ImageSelector
          @select="SelectImage"
          @close="isImageSelector = false"
          img-type="ico"
        />
      </template>
      <template #actions>
        <it-button @click="isImageSelector = false">Отмена</it-button>
        <!-- <it-button :loading="isDeletingGTest" @click="DeleteGTest" type="danger">Удалить</it-button> -->
      </template>
    </it-modal>
    <Sidebar ref="winFolder" v-model:visible="isFolder" position="bottom" class="win-folder">
      <div class="sidebar-conent-center">
        <main class="main">
          <TestQuests
            ref="folderTestBody"
            :data="folder?.body"
            :mode="'editor'"
            :is-folder="true"
            :folder-id="folder?.id"
            @remove-from-folder="RemoveFromFolder"
            @change-list="SetBodyFolder"
          />
        </main>
      </div>
    </Sidebar>
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
import Sidebar from "primevue/sidebar";

export default {
  components: {
    TestQuests,
    Sidebar,
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

      folder: undefined,
      isFolder: false,
    };
  },
  async beforeRouteLeave(next) {
    if(this.$refs?.parentTestBody?.IsSelectMode()){
      this.$refs.parentTestBody.SelectModeEnable(false);
      next(false);
    }
    
    if(confirm("Вы уверены, что хотите уйти?") != true){
      next(false);
    }
  },
  methods: {
    SaveTest() {
      let obj = {
        q: "test_save",
        me: this.$store.state.ME.data,
        test: this.test,
      };
      this.axios
        .post(this.apiurl, obj)
        .then((itm) => {
          console.log(itm.data);
          if (itm.data?.data) {
            let test_id = itm.data?.data;
            this.$router.replace({ path: `/test/${test_id}/editor` });
            this.$success("Сохранение теста", "Тест был успешно сохранен");
          }
        })
        .catch(() => {
          this.$error(
            "Ошибка сохранения теста",
            "При сохранении теста поизошла ошибка"
          );
        });
    },
    SelectImage(img) {
      if (this.test != undefined) {
        this.test.ico_url = img.url;
        this.test.ico = img.img_id;
      }
    },
    SetBody(items) {
      if (this.test?.body) {
        this.test.body = items;
      }
    },
    SetBodyFolder(items) {
      if (this?.folder) {
        this.folder.body = items;
      }
      console.log(items);
    },
    RemoveFromFolder(folderId, selected){
      this.$refs.parentTestBody.RemoveFromFolder(folderId, selected);
      this.isFolder = false;
    }
  },
  watch: {
    isFolder(newV) {
      if (!newV && this.$route.query?.folder) {
        this.$router.go(-1);
      }
      if(newV){
        setTimeout(()=>{
            let headerFolder = document.querySelector(".win-folder .p-sidebar-header");
            headerFolder.style.setProperty("--folder-header", '"'+this.folder.name+'"' ); 
          }, 0);
      }
      return this.isFolder;
    },
    "$route.query": function (/*newVal, oldVal*/) {
      if (this.$route.query?.folder) {
        let fld = this?.test.body.filter((item) => {
          return item.id == this.$route.query?.folder && item.type == "Folder";
        });
        if (fld.length == 1) {
          this.folder = fld[0];
          this.isFolder = true;
        } else {
          this.folder = undefined;
          this.isFolder = false;
        }
      } else {
        if(this.$refs?.folderTestBody?.IsSelectMode()){
          this.$refs.folderTestBody.SelectModeEnable(false);
          this.$router.forward();
        }else{
          this.folder = undefined;
          this.isFolder = false;
        }
      }
      return this.$route.query;
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
.test-header-wrapper .content {
  display: grid;
  grid-template-columns: 110px 1fr;
}
textarea.it-textarea {
  overflow: hidden !important;
}

.win-folder.p-sidebar {
  height: 100vh !important;
  background-color: rgb(206, 206, 206);
}
.win-folder .p-sidebar-header {
  --folder-header: "Новая папка";
  box-shadow: 0px 8px 8px #cecece;
  z-index: 1;
}
.win-folder .p-sidebar-header::before {
  content: var(--folder-header, "Папка");
  font-size: 22px;
  background-color: white;
  padding: 6px;
  margin-top: -4px;
  border-radius: 6px;
  position: absolute;
  left: 10px;
  width: calc(100% - 106px);
  padding-left: 52px;
  background-image: var(--url-ico-folder);
  background-position: 6px;
  background-size: contain;
  background-repeat: no-repeat;
  overflow: hidden;
  border-right: 4px solid white;
  height: 32px;
  line-height: 32px;
  padding-right: 30px;
  word-break: break-all;
  text-align: center;
}
.win-folder .sidebar-conent-center {
  max-width: 700px;
  margin: auto;
}
.win-folder .p-sidebar-content {
  margin: 0px;
  padding: 0px;
}
</style>
