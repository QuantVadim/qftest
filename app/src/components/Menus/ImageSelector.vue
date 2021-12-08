<template>
  <div class="image-selector-wrapper">
    <label class="image-wrapper uploade-image" :for="isUploadingImage? '' : uid">
      <input
        style="display: none"
        type="file"
        :id="uid"
        name="file"
        accept="image/png,image/jpeg"
        @input="SelectedFile"
      />
      <it-loading v-if="isUploadingImage"></it-loading>
      <div class="uploade-image-text" v-else>Загрузить</div>
    </label>
    <div class="image-wrapper"  v-for="item in list.items" :key="item.img_id" :class="{_selected: item == SelectedImage}">
      <it-avatar :src="item.url" square size="100px" @click="clickImage(item)"/>
      <div class="image-overlay">
        <it-icon box color="#fff" name="clear" size="12px" @click="DeleteImageDialog(item)"/>
      </div>
    </div>
    <it-button v-if="list.isMore" @click="list.Load()" class="image-wrapper btn-more" style="text-align: center" :loading="list.isLoading">Ещё</it-button>
    <it-modal v-model="isDialogDelete">
      <template #header> 
        <h3 style="margin: 0px">Удаление изображения</h3>
      </template>
      <template #body>
        <div class="dialog-delete-image-content">
          <it-avatar :src="curDeleteImage?.url" square size="100px" />
          <div>Вы действительно хотите <b>удалить</b> это изображение?<br>После выполнения данной операции, восстановить его будет невозможно.</div> 
        </div>
      </template>
      <template #actions>
        <it-button type="danger" @click="DeleteImage">Удалить</it-button>
        <it-button @click="isDialogDelete = false">Отмена</it-button>
      </template>
    </it-modal>
  </div>
</template>

<script>
import conf from "@/conf.js";
import List from "@/others/ListManager";
export default {
  props: [],
  data() {
    return {
      SelectedImage: undefined,
      isUploadingImage: false,
      isDialogDelete: false,
      curDeleteImage: undefined,
      list: List.Create(this.$store.state.ME.data, 'get_images', 'img_id', 40),
      uid: "selImg" + Math.floor(Math.random() * 1000000),
    };
  },
  mounted(){
    this.list.Load();
    console.log(this.list);
  },
  methods: {
    SelectedFile(event) {
      let fd = new FormData();
      if (event.target.files.length >= 1) {
        this.isUploadingImage = true;
        fd.append("image", event.target.files[0]);
        fd.append(
          "info",
          JSON.stringify({
            me: this.$store.state.ME.data,
            type: 'ico',
          })
        );
        console.log(event.target.files);
        this.axios.post(conf.UPLOAD_IMG_URL, fd).then((itm) => {
          this.isUploadingImage = false;
          this.list.AddStart(itm.data);
          console.log(itm.data);
        });
      }
    },
    DeleteImageDialog(item){
      this.isDialogDelete = true;
      this.curDeleteImage = item;
    },
    async DeleteImage(){
      if(this.curDeleteImage){
        let obj = {
          me: this.$store.state.ME.data,
          q: 'delete_image',
          img_id: this.curDeleteImage.img_id,
        }
        this.axios.post(this.apiurl, obj).then((itm)=>{
          if(itm.data?.data){
            console.log(itm.data);
            this.list.DeleteBy('img_id', itm.data.data);
            this.isDialogDelete = false;
            this.curDeleteImage = undefined;
          }
        })
        console.log(obj);
      }
    },
    clickImage(img){
      if(this.SelectedImage == img){
        this.Select();
      }else{
        this.SelectedImage = img;
      }
    },
    Close() {
      this.$emit("close");
    },
    Select() {
      if(this.SelectedImage != undefined){
        this.$emit("select", this.SelectedImage);
        this.Close();
      }
    },
  },
};
</script>

<style>
.it-modal-content .image-selector-wrapper{
  margin-top: 16px;
}
.dialog-delete-image-content{
  display: grid;
  grid-template-columns: 110px 1fr;
}
.image-selector-wrapper{
  display: grid;
  grid-template-columns: repeat( auto-fit, minmax(100px, 1fr) );
  row-gap: 6px;
}
.image-selector-wrapper .image-wrapper.btn-more .it-btn-text{
  padding-left: 15px;
}
.image-selector-wrapper .it-avatar:hover{
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.61);
}
.image-wrapper .image-overlay{
  pointer-events: none;
  position: relative;
  margin-top: -100px;
  display: flex;
  flex-flow: row-reverse;
}
.image-wrapper .image-overlay .it-icon{
  pointer-events: all;
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
    font-size: 10px;
    border-radius: 100%;
    cursor: pointer;
}
.image-wrapper:hover .image-overlay .it-icon{
  display: inline;
}
.image-wrapper._selected .image-overlay .it-icon{
  display: inline;
}
.image-wrapper._selected{
  outline: 3px solid rgb(36, 138, 221);
  transform: scale(1.05);
  z-index: 1;
}
.image-selector-wrapper .image-wrapper{
  display: inline-block;
  margin: auto;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  background-color: #d3dae6;
}
.image-selector-wrapper .image-wrapper .it-loading{
  margin-top: 16px;
  margin-left: 16px;
}
.image-selector-wrapper .image-wrapper.uploade-image{
  border: 2px dashed rgb(173, 173, 173);
}
.image-selector-wrapper .image-wrapper.uploade-image:hover{
  background-color: #c5cbd6;
  cursor: pointer;
}
.uploade-image-text{
  font-size: 16px;
  color: gray;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 93px;
}
</style>