<template>
<div>
  <div v-if="dt != undefined" class="folder-content">

      <div class="part-1" @click="Open">
        <div class="__folder-img"></div>
        <div class="__count-cards"> {{ dt?.body?.length || 0 }} шт.</div>
      </div>
      <div class="part-2 ">
        <InputText class="p-input-wide" type="text" v-model="dt.name" />
        <div style="margin-top: 4px" v-if="dt?.props">
          <span>
          <p-button type="button" label="" icon="pi pi-cog" class="p-button-secondary p-button-outlined p-button-sm" @click="toggleFolderSettings" />
          <OverlayPanel ref="settings">
            <div>
              <div class="field-checkbox">
                <p-checkbox :id="'folderchb_'+dt.id" v-model="dt.props.isShuffle" :binary="true" />
                <label :for="'folderchb_'+dt.id"> Перемешать и выбрать</label>
              </div>
              <div style="margin-top:4px" v-if="dt.props.isShuffle">
                <InputNumber id="vertical" v-model="dt.props.select"  mode="decimal" showButtons buttonLayout="horizontal" inputStyle="width:50px" :min="0" :max="dt?.body?.length || 0"
                decrementButtonClass="p-button-secondary" incrementButtonClass="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
              </div>
            </div>
          </OverlayPanel>
          </span>
          <span v-if="dt.props.isShuffle" class="__selected-cards-info"> Выбрано: {{dt.props.select}} шт.</span>
        </div>
      </div>
    
  </div>
  <div v-else>Пусто</div>
</div>
</template>

<script>


export default {
  components: [],
  props: ['data'],
  data(){
    return{
      dt: this?.data,
      name: '',
    }
  },
  methods:{
    toggleFolderSettings(event){
      this.$refs.settings.toggle(event)
    },
    Open(){
      this.$emit('open-folder', this.dt.id);
    },
    UpdateList(){
      this.$emit('changeList', this.items);
    },
  },
  mounted() {
    if(this.dt?.props == undefined){ 
      this.dt.props = {
        isShuffle: false,
        select: 0    
      };
    }
    if(this.dt?.body == undefined){
      this.dt.body = [];
    }
  },
}
</script>

<style scoped>
.folder-content .__selected-cards-info{
  line-height: 34px; 
  color: gray
}

.folder-content{
  display: grid;
  grid-template-columns: 64px 1fr;
}

.folder-content .part-1{
  cursor: pointer;
  transition: transform 0.2s;
}

.folder-content .__folder-img{
  height: 64px;
  width: 64px;
  background-image: var(--url-ico-folder);
  background-repeat: no-repeat;
  background-size: cover;
}
.folder-content .part-1:hover{
  transform: scale(1.1);
}

.folder-content .__count-cards{
  margin-top: -20px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.548);
  width: max-content;
  border-radius: 4px;
  outline: 1px solid rgb(201, 201, 201);
  padding: 1px;
  max-width: 54px;
  overflow: hidden;
  max-height: 20px;
  line-height: 20px;
}

</style>