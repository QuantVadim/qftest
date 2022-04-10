<template>
  <div>
    <div v-if="dt != undefined">
      <div class="choice-options">
        <it-switch class="choice-option" v-model="dt.isMultiple" label="Множественный выбор" />
      </div>
      <it-textarea
        v-model="dt.text"
        placeholder="Вопрос"
        :resize-on-write="true"
        :rows="1"
      ></it-textarea>
      <div v-if="isImageMode">
        <p-button type="button" label="Настройки" icon="pi pi-cog" class="p-button-secondary p-button-outlined p-button-sm" @click="toggleImgSettings" />
        <OverlayPanel :ref="'ovpan'+dt.id">
          <b style="display: block; margin-bottom: 10px">Настройки изображения</b>
          <div class="overlay-image-settings">
            <div class="p-field">
              <span>Соотношение: </span>
              <Dropdown v-model="curAspect" :options="ListAspects" optionLabel="label" optionValue="value" />
            </div>
            <div class="p-field">
              <span>Размер: </span>
              <Dropdown v-model="curSize" :options="ListSizes" optionLabel="label" optionValue="value" />
            </div>
            <div  style="margin-top: 5px;">
              <p-checkbox :id="'chbvert'+dt.id" :binary="true" v-model="isVertical" />
              <label style="padding-left: 5px;" :for="'chbvert'+dt.id">Вертикально</label>
            </div>
            <div  style="margin-top: 5px;">
              <p-checkbox :id="'chbcover'+dt.id" :binary="true" v-model="isCover" />
              <label style="padding-left: 5px;" :for="'chbcover'+dt.id">Заполнить</label>
            </div>
          </div>
        </OverlayPanel>
      </div>
      <div class="choices-body" :class="{'image-mode': isImageMode, [curAspect] : true, [curSize]: true, 'vertical': isVertical, 'cover': isCover}">
        <draggable
          v-model="dt.choices"
          item-key="id"
          tag="transition-group"
          animation="150"
          handle=".choice-body"
        >
          <template #item="{ index }">
            <div :class="{'editing-choice': dt.choices[index].id == curIdEditing } ">
              <!-- Режим обычный: -->
              <div v-if="isImageMode == false" class="choice-line">
                <span class="choice-body">
                  <it-checkbox v-if="dt.isMultiple" v-model="dt.choices[index].selected"> </it-checkbox>
                  <it-radio v-else v-model="dt.answer" :value="dt.choices[index].id"/>
                  <span class="choice-body-text" @click="setEditingMode(dt.choices[index].id)">{{
                    dt.choices[index].label
                  }}</span>
                  <div>
                    <it-icon @click="deleteChoice(index)" class="btn-choice-delete" name="highlight_off" color="#838996" />
                  </div>
                </span>
              </div>
              <!-- Режим картинок: -->
              <div class="wrapper-choice" v-else >
                <span class="choice-body">
                  <div class="choice-image-panel _top">
                      <div>
                        <it-button icon="close" size="small" type="danger" round name="highlight_off" @click.stop="deleteChoice(index)" color="#838996" />
                      </div>
                  </div>
                  <div class="choice-image-wrapper" @click.stop="setEditingMode(dt.choices[index].id)">
                    
                  <div class="choice-image _back" :style="'background-image: url(\''+dt.choices[index]?.image?.url+'\')'"></div>
                  <div class="choice-image _front" :style="'background-image: url(\''+dt.choices[index]?.image?.url+'\')'">
                    
                  </div>
                  
                  </div>
                  <div class="choice-image-panel _bottom">
                    <it-checkbox v-if="dt.isMultiple" v-model="dt.choices[index].selected"> </it-checkbox>
                    <it-radio v-else v-model="dt.answer" :value="dt.choices[index].id"/>
                  </div>
                  <div class="choice-body-title">
                    <div class="choice-body-text" v-if="dt.choices[index].label.trim().length > 0" @click="setEditingMode(dt.choices[index].id)">
                      <span>
                        {{dt.choices[index].label}}
                      </span>
                    </div>
                    
                  </div>
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="choice-input-line">
        <div>
          <it-button @click="setEditingMode(false)" size="small" v-if="curIdEditing != undefined">X</it-button>
        </div>
        <it-input
          ref="choice-input"
          v-model="inputChoice"
          @keyup.enter="EnterChoice"
          placeholder="Добавить пункт"
        >
        </it-input>
        <div>
          <it-button @click="btnSelectImage" :icon="curImage ? 'hide_image' : 'add_photo_alternate'"></it-button>
        </div>
      </div>

      <div class="card-more-footer">
        <div>
          <it-icon
            @click="isMore = !isMore"
            name="expand_more"
            :class="{ 'more-rotate': isMore }"
            class="btn-expand-more"
          />
        </div>
        <div class="mini-gray-text">{{ dt.score }}</div>
      </div>

      <div v-if="isMore" class="more-props-wrapper">
        <div class="prop-line">
          <div>Кол-во баллов</div>
          <it-number-input
            v-model="dt.score"
            :min="1"
            :resize-on-write="true"
            :max="100"
          />
        </div>
      </div>
    </div>
    <div v-else>Пусто</div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Dropdown from 'primevue/dropdown';
import OverlayPanel from 'primevue/overlaypanel';

export default {
  components:{ draggable, Dropdown, OverlayPanel },
  props: ["data"],
  inject:['ImageSelector'],
  data() {
    return {
      dt: this.data,

      isImageMode: false,
      curIdEditing: undefined,
      inputChoice: "",
      isMore: false,
      curImage: undefined,
      isVertical: false,
      isCover: true,
      curAspect: 'a1_1',
      curSize: 'normal',
      ListAspects: [
        {label: '1:1', value:'a1_1'},
        {label: '4:3', value:'a4_3'},
        {label: '16:9', value:'a16_9'},
      ],
      ListSizes: [
        {label: 'Маленький', value: 'small'},
        {label: 'Обычный', value: 'normal'},
        {label: 'Большой', value: 'big'},
      ]
    };
  },
  watch:{
    isVertical(){ this.dt.props.vertical = this.isVertical; },
    isCover(){this.dt.props.cover = this.isCover; },
    curAspect(){this.dt.props.aspect = this.curAspect; },
    curSize(){this.dt.props.size = this.curSize; }
  },
  mounted() {
    this.dt.text = this.data?.text ? this.data.text : '';
    this.dt.score = this.data?.score ? this.data.score : 1;
    this.dt.choices = this.data?.choices ? this.data.choices : [];
    this.dt.isMultiple = this.data?.isMultiple ? this.data.isMultiple : false;
    this.dt.answer = this.data?.answer ? this.data.answer : undefined;
    const props = this.data?.props;
    if(this.dt.props == undefined) this.dt.props = {};
    this.isVertical = props?.vertical || false;
    this.isCover = props?.cover != undefined ? props?.cover : true;
    this.curAspect = props?.aspect || 'a1_1';
    this.curSize = props?.size || 'normal';
    
    this.CheckChoices();
  
  },
  methods: {
    toggleImgSettings(event) {
      this.$refs['ovpan'+this.dt.id].toggle(event);
    },
    btnSelectImage(){
      if(this.curImage){
        this.curImage = undefined;
        if(this.curIdEditing !== undefined){
          this.dt.choices[this.getChoiceIndexById(this.curIdEditing)].image = undefined ;
          this.CheckChoices();
        }
      }else{
        this.ImageSelector.Open(this.SelectImage);
      }
    },
    SelectImage(img){
      this.curImage = img;
      this.$refs['choice-input'].$el.getElementsByTagName('input')[0].focus();
      if(this.curIdEditing != undefined){
        this.dt.choices[this.getChoiceIndexById(this.curIdEditing)].image = img ;
        this.CheckChoices();
      }
    },
    deleteChoice(index){
      if(this.dt.choices[index].id == this.curIdEditing){
        this.curIdEditing = undefined;
        this.inputChoice = '';
        this.curImage = undefined;
      }
      this.dt.choices.splice(index, 1);
    },
    setEditingMode(id) {
      console.log('go');
      let obj = {};
      if(this.curIdEditing){
          const index = this.getChoiceIndexById(this.curIdEditing);
          const foo = this.dt.choices[index];
          if(foo.label.trim().length == 0 && foo.image == undefined){
            this.dt.choices.splice(index, 1);
          }
        }
      if (id != false && id != this?.curIdEditing) {
        this.dt.choices.forEach((element) => {
          if (element.id == id) obj = element;
        });
        if (obj != undefined) {
          this.curIdEditing = id;
          this.inputChoice = obj.label;
          this.curImage = obj?.image;
        }
      }else{
        this.curIdEditing = undefined;
        this.inputChoice = '';
        this.curImage = undefined;
      }
    },
    EnterChoice() {
      if(this.inputChoice.trim().length == 0 && this.curImage == undefined){
        if(this.curIdEditing != undefined){
          let index = undefined;
          for (let i = 0; i < this.dt.choices.length; i++) {
            const el = this.dt.choices[i];
            if(el.id == this.curIdEditing){
              index = i;
              break;
            }
          }
          if(index != undefined){
            this.dt.choices.splice(index, 1);
            this.curIdEditing = undefined;
            this.inputChoice = '';
            this.curImage = undefined;
          }
          return false;
        }else return false;
      }
      let obj = undefined;
      if (this.curIdEditing == undefined) {//Добавление нового варианта
        obj = {
          id: Math.random(),
          label: this.inputChoice.trim(),
          selected: false,
          image: this.curImage,
        };
        this.dt.choices.splice(this.dt.choices.length, 0, obj);
      } else {//Изменение варианта
        let indexInsert = this.dt.choices.length;
        for (let index = 0; index < this.dt.choices.length; index++) {
          const element = this.dt.choices[index];
          if (element.id == this.curIdEditing) {
            indexInsert = index;
            obj = this.dt.choices[index];
          }
        }
        if(obj){
           obj.label = this.inputChoice.trim();
           obj.image = this.curImage;
           this.dt.choices.splice(indexInsert, 1, obj);
        }else{
          obj = {
          id: Math.random(),
          label: this.inputChoice.trim(),
          selected: false,
          image: this.curImage,
          }
          this.dt.choices.splice(indexInsert, 0, obj);
        }
      }
      this.inputChoice = "";
      this.curImage = undefined;
      this.curIdEditing = undefined;
      this.CheckChoices();
    },
    CheckChoices(){
      let imgMode = false;
      for (let i = 0; i < this.dt.choices.length; i++) {
        const el = this.dt.choices[i];
        if(el?.image){
          imgMode = true;
          break;
        }
      }
      this.isImageMode = imgMode;
    },
    getChoiceIndexById(id){ //Получить индекс choice по id
      for (let i = 0; i < this.dt.choices.length; i++) {
        const el = this.dt.choices[i];
        if(el.id == id){
          return i;   
        }
      }
    }
  },
};
</script>

<style scoped>
.overlay-image-settings .p-field{
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 8px;
  margin-bottom: 5px;
}
.choices-body.image-mode{
  column-gap: 3px;
}

.choice-options {
  padding-bottom: 6px !important;
  opacity: 0.23;
  transition: opacity 0.2s;
}
.choice-options:hover{
  opacity: 1;
}
.choice-input-line {
  display: grid;
  grid-template-columns: auto 1fr auto !important;
}
.btn-choice-delete{
  margin-left: 8px;
}
.choice-input-line .it-btn {
  height: 32px !important;
  width: 32px !important;
}
.choice-body {
  display: flex;
  border-radius: 8px;
  padding: 4px;
  background-color: #f0f5ff;
}
.image-mode .choice-body {
  border-radius: 8px;
  padding: 4px;
  background-color: inherit;
}

.editing-choice .choice-body .choice-image-wrapper{
  outline: 3px solid #3051FF;
}
.editing-choice .choice-line .choice-body{
  outline: 3px solid #3051FF;
}
.choice-line>*{
  cursor: pointer;
}
.choice-line{
  display: flex;
  margin-top: 6px;
  margin-bottom: 6px;
}
.prop-line{
  margin-top: 10px !important;
}

</style>