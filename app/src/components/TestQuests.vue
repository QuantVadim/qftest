<template>
<div :class="['select-mode_'+SelectMode.mode, {'select-mode-enable': SelectMode.enable, 'editor-mode': mode == 'editor' }]">
<div v-if="SelectMode.enable" class="select-panel wide-content-mode" :class="{_folder: isFolder}">
<div class="header-content main-center">
  <div>
    <span class="inline-block"><it-icon class="inline-block" name="highlight_alt" color="white" style="font-size: 32px; margin-top: -4px" outlined /></span>
    <span class="inline-block" style="margin-left: 5px">Выбрано: {{SelectMode.selected.length}}</span>
    <Button v-if="SelectMode.selected.length > 0" @click="toggleSelectMenu" icon="pi pi-chevron-down" class="p-button-rounded p-button-text" style="color: white;" />
      <span>
         <Menu ref="selectMenu" :model="selectMenu" :popup="true" />
      </span>
  </div>
  <div></div>
  <div style="padding-right: 4px">
    <Button label="" icon="pi pi-times" @click="SelectMode.enable = false" class="p-button-rounded p-button-text" style="color: white"/>
  </div>
</div>
</div>
<draggable
  v-model="items"
  item-key="id"
  tag="transition-group"
  animation="150"
  group="questions"
  handle=".handle-card-center_draggable"
  ghost-class="blue-background-class"
  @change="UpdateList"
>
  <template #item="{ index }">
    <div :ref="'card_'+items[index].id" class="block-card-wrapper _card-stay"
      :class="{'_selected-card': SelectMode.selected.includes(items[index].id) }"
      @animationend="CardAnimationEnd">
    <block 
     
      :class="{'_selected-card': SelectMode.selected.includes(items[index].id) }">
    <div v-if="mode == 'editor'" class="handle-card" :card-id="items[index].id">
      <div>
        <it-icon v-if="SelectMode.enable == false" @click="BtnDeleteCardById(items[index].id)" name="delete" size="32px" />
        <p-checkbox @click="CheckSelectCount" class="__card-check-box" v-else :name="'card-check_'+items[index].id" :value="items[index].id" v-model="SelectMode.selected" />
      </div>
      <div @click="ClickHandleCard" 
        class="handle-card-center" 
        :class="{'handle-card-center_draggable': SelectMode.enable == false }"
        >{{ index+1 }}</div>
      <div class="handle-part-right">
        <it-icon @click="DublicateCard(index)" name="content_copy" />
        <it-icon name="more_horiz" @click="toggle" />
        <div>
          <Menu ref="menu" :model="itemsMenu" :popup="true" />
        </div>
      </div>
    </div>
    <div class="wrapper-inner-card" @click="ClickCardBody">
      <div class="inner-card">
      <component 
      :is="items[index].type.toLowerCase()+'Card_'+mode" 
      :data="items[index]" 
      @open-folder="OpenFolder" 
      @change-card-state="ChangeCardState"
      />
      </div>
    </div>
    </block>
    </div>
  </template>
</draggable>
<it-divider/>
  <Block v-if="mode == 'editor'" class="_tool-bar">
    <span class="p-buttonset">
    <Button @click="addCard('Simple')" label="Текст" class="p-button-outlined" />
    <Button @click="addCard('Choice')" label="Выбор" class="p-button-outlined" />
    <Button @click="addCard('Orthoepy')" label="Ударение" class="p-button-outlined" />
    <Button v-if="isFolder != true" @click="addCard('Folder')" label="Папка" class="p-button-outlined" />
    </span>
  </Block>

  <!-- Диалог удаление карточек -->
  <it-modal v-model="confirmDeleteCardsModal">
    <template #header>
      <h3 style="margin: 10px 0px;">Удаление карточек</h3>
    </template>
    <template #body>
      Вы уверены, что хотите удалить выбранные карточки?
    </template>
    <template #actions>
      <it-button @click="confirmDeleteCardsModal = false">Отмена</it-button>
      <it-button
        type="danger"
        @click="ConfirmDeleteCards">Удалить
      </it-button>
    </template>
  </it-modal>
 <!-- /Диалог удаление карточек -->
 <!-- Диалог Перемещения карточек -->
  <it-modal v-model="moveCardsDialog">
    <template #header>
      <h3 style="margin: 10px 0px;">Перенос карточек</h3>
    </template>
    <template #body>
      <div style="text-align: center">Куда следует расположить карточки?</div>
      <div style="text-align: center; margin-top: 10px">
        <div @click="MoveCards(0)" style="display: grid"><Button label="До" class="p-button-outlined p-button-secondary" /></div>
        <div @click="MoveCards(1)" style="margin-top: 6px; display: grid;"><Button label="После" class="p-button-outlined p-button-secondary" /></div>
      </div>
    </template>
    <template #actions>
      <it-button @click="moveCardsDialog = false">Отмена</it-button>
    </template>
  </it-modal>
 <!-- /Диалог Перемещения карточек -->
</div>
</template>

<script>
import draggable from "vuedraggable";
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Block from '@/components/Block';
import Toolbar from 'primevue/toolbar';

import FolderCard_editor from "./TestCards/Folder";

//Simple
import SimpleCard_editor from "./TestCards/Editor/Simple";
import SimpleCard_basic from "./TestCards/Basic/Simple";
import SimpleCard_result from "./TestCards/Result/Simple";
//Choice
import ChoiceCard_editor from "./TestCards/Editor/Choice";
import ChoiceCard_basic from "./TestCards/Basic/Choice";
import ChoiceCard_result from "./TestCards/Result/Choice";
//Orthoepy
import OrthoepyCard_editor from "./TestCards/Editor/Orthoepy";
import OrthoepyCard_basic from "./TestCards/Basic/Orthoepy";
import OrthoepyCard_result from "./TestCards/Result/Orthoepy";

export default {
  components: {
    draggable, Menu, Button, Toolbar, Block, FolderCard_editor,
    SimpleCard_editor, SimpleCard_basic, SimpleCard_result,
    ChoiceCard_editor, ChoiceCard_basic, ChoiceCard_result,
    OrthoepyCard_editor, OrthoepyCard_basic, OrthoepyCard_result
  },
  props: ['data', 'mode', 'isFolder', 'folderId'],
  data() {
    return {
      items: this.data || [],

      SelectMode: {
        enable: false,
        selected: [],
        mode: '', //to-folder, move
        lastClick: undefined,
        moveCardId: undefined,
        shiftLastClick: undefined,
      },
      confirmDeleteCardsModal: false,
      moveCardsDialog: false,
      lastCardIdMenu: undefined, //id карточки, которой открывали меню действий в последний раз
      itemsMenu: [
        {
					label: 'Выбрать',
					icon: 'pi pi-check-square',
					command: () => {
            this.SelectMode.enable = true;
            setTimeout(()=>{this.SelectCardId(this.lastCardIdMenu);}, 0);
					}
				},
      ],
      selectMenu:[],
    };
  },
  watch:{
    'SelectMode.enable'(val){
        this.SelectMode.selected = [];
        this.SelectMode.mode = '';
        this.SelectMode.lastClick = undefined;
        this.SelectMode.shiftLastClick = undefined;
        this.SelectMode.moveCardId = undefined;
        if(val){
          setTimeout(()=>{
            if(this.lastCardIdMenu != undefined && this.SelectMode.selected.includes(this.lastCardIdMenu)){
              this.SelectMode.lastClick = this.lastCardIdMenu; 
            }
          }, 0)
        }
    }
  },
  methods: {
    ChangeCardState(data){
      this.$emit('change-card-state', data);
    },
    BtnDeleteCardById(id){ //Запуск анимации кдаления карточки
      let cardID = id.toString();
      if(this.$refs['card_'+cardID]){
        let el = this.$refs['card_'+cardID];
        el.style.setProperty('--card-height', el.clientHeight+'px');
        el.classList.toggle('_card-leave', true);
      }
    },
    CardAnimationEnd(event){
      switch (event.animationName) {
        case 'test-body-card-click--animation':
          event.target.classList.toggle('test-body-card-click', false);
          break;
        case 'card-leave--animation':
          var handleCard = event.target.querySelector('.handle-card');
          if(handleCard){
            let cardID = handleCard.getAttribute('card-id');
            let card = this.$refs['card_'+cardID];
            if(card){
              card.classList.toggle('_hide');
            }
            this.deleteCardById(cardID);
          }
          break;
        case 'card-enter--animation':
          event.target.classList.toggle('_card-enter', false);
          break;
        default:
          break;
      }
      
      //@animationend="AnimateCard($refs['card_'+items[index].id], false)" 
    },
    AnimateEnterCards(ids){ //Анимирование появления карт
      let arr = [];
      
      if( typeof ids == 'string' || typeof ids == 'number' ){
        arr.push(ids);
      }else if( typeof ids != 'object' || ids.length == 0){
        return false;
      }else{
        arr = ids;
      }
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        const card = this.$refs['card_'+el];
        if(card){
          let block = card.querySelector('.block'); 
          card.style.setProperty('--from-card-height', '0px');
          card.style.setProperty('--card-height', block.clientHeight+'px');
          card.classList.toggle('_card-enter', true);
        }
      }

    },
    AnimateCard(card, val){
      if(card != undefined){
        card.classList.toggle('test-body-card-click', val);
      }
    },
    ClickCardBody(event){
      if(this.SelectMode.enable)
        this.ClickHandleCard(event);
    },
    SelectModeEnable(val){
      if(this.SelectMode != undefined){
        this.SelectMode.enable = val;
      }
    },
    IsSelectMode(){
      if(this?.SelectMode){
        return this.SelectMode.enable;
      }
      return false;
    },
    OpenFolder(id){
      if(this.SelectMode.enable == false){
        this.$router.push({query: {folder: id}});
      }else{
        //Нажатие на папку в режиме to-folder (Перенос карточек в папку)
        if(this.SelectMode.mode == 'to-folder' && this.SelectMode.selected.includes(id) == false){
          for (let i = 0; i < this.items.length; i++) {
            const el = this.items[i];
            if(el.id == id && el.type == "Folder"){
              let selCards = this.GetSelectedCards();
              this.items[i].body.push.apply(this.items[i].body, selCards);
              this.DeleteSelectedCards();
              this.SelectMode.enable = false;
            }
          }
        }else{
          console.log("В эту папку нельзя переместить");
        }
      }
    },
    UpdateList(){
      //this.$emit('changeList', this.items);
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
      let handle = event.target.parentElement.parentElement;
      if(handle.classList.contains('handle-card')){
        let cardID = handle.getAttribute('card-id').toString();
        cardID = cardID.indexOf('.') >= 0 ? Number(cardID) : cardID; 
        this.lastCardIdMenu = cardID;
      }
    },
    toggleSelectMenu(event) {
      this.$refs.selectMenu.toggle(event);
    },
    SelectCardId(id){
      let cardID = id.toString();
      cardID = cardID.indexOf('.') >= 0 ? Number(cardID) : cardID; 
      if(this.SelectMode.enable){
        this.SelectMode.lastClick = cardID;
        if(this.items.filter(item=>item.id == cardID).length == 1 &&
          this.SelectMode.selected.includes(cardID) == false
        ){
          this.SelectMode.selected.push(cardID);
        }
      }
    },
    showinfo(){
      console.log(this.items);
    },
    addCard(cardType) {
      let newCardID = Math.random().toString().split('.')[1]; 
      switch (cardType) {
        case 'Simple':
        case 'Choice': 
        case 'Orthoepy':
            this.items.push({id: newCardID, type: cardType });
            break;
        case 'Folder':
          this.items.push({id: newCardID, type: cardType, name: 'Новая папка' });
          break
        default:
          break;
      }
      this.$nextTick(()=>{
        this.AnimateEnterCards(newCardID);
      });
      this.$emit('changeList', this.items); 
    },
    deleteCardById(id){
      let cardID =id.toString();
      cardID = cardID.indexOf('.') >= 0 ? Number(cardID) : cardID; 
      for (let i = 0; i < this.items.length; i++) {
        const el = this.items[i];
        if(el.id == cardID){
          this.items.splice(i, 1);
          break;
        }
      } 
    },
    CheckSelectCount(){
      setTimeout(()=>{
        if(this.SelectMode.selected.length == 0){
          this.SelectMode.enable = false;
        }
      },0)
    },
    DublicateCard(index){
      let card =  JSON.parse(JSON.stringify(this.items[index]));
      if(card.type == "Folder"){ // Присваивание новых id карточкам папки
        for (let i = 0; i < card.body.length; i++) {
          card.body[i].id = Math.random().toString().split('.')[1];
        }
      }
      card.id = Math.random().toString().split('.')[1];
      this.items.splice(index+1, 0, card);
      this.$emit('change-list', this.items);
      this.$nextTick(()=>{
        this.AnimateEnterCards(card.id);
      });
    },
    ClickHandleCard(event){
      if(this.SelectMode.enable){
        let handleCard = event.target.parentElement;
        if(handleCard.classList.contains('handle-card') == false){
          handleCard = handleCard.querySelector('.handle-card');
        }
        if(handleCard.classList.contains('handle-card')){
          if(this.SelectMode.mode != "move"){
            let cardID = handleCard.getAttribute('card-id').toString();
            cardID = cardID.indexOf('.') >= 0 ? Number(cardID) : cardID; 
            if(event.shiftKey){
              this.SelectMode.shiftLastClick = cardID;
              setTimeout(()=>{
                let val = this.SelectMode.selected.includes(this.SelectMode.shiftLastClick);
                this.SelectRange(this.SelectMode.lastClick, this.SelectMode.shiftLastClick, val);
              }, 0);
            }else{
              this.SelectMode.lastClick = cardID;
            }
            let checkboxCard = handleCard.querySelector(".p-checkbox input");
            checkboxCard.click();
            setTimeout(()=>{
              this.AnimateCard(this.$refs['card_'+cardID], true);
            });
          }else{
            let cardID = handleCard.getAttribute('card-id').toString();
            cardID = cardID.indexOf('.') >= 0 ? Number(cardID) : cardID; 
            if(this.SelectMode.selected.includes(cardID) == false){
              this.SelectMode.moveCardId = cardID;
              this.moveCardsDialog = true;
            }
            this.AnimateCard(this.$refs['card_'+cardID], true);
          }
        }
      }else{
        if(event.ctrlKey){
          this.SelectMode.enable = true;
          setTimeout(()=>{
            let handleCard = event.target.parentElement;
            if(handleCard.classList.contains('handle-card')){
              let cardID = handleCard.getAttribute('card-id').toString();
              cardID = cardID.indexOf('.') >= 0 ? Number(cardID) : cardID; 
              this.SelectMode.lastClick = cardID;
              let checkboxCard = handleCard.querySelector(".p-checkbox input");
              checkboxCard.click();
              this.AnimateCard(this.$refs['card_'+cardID.toString()], true);
            }
          }, 0);
        }
      }
      document.getSelection().removeAllRanges();
    },
    MoveCards(offset){
      let cardId = this.SelectMode.moveCardId;
      if( cardId != undefined && this.SelectMode.selected.includes(cardId) == false ){
        let cards = this.GetSelectedItems();
        this.DeleteSelectedCards();
        setTimeout(()=>{
          for (let i = 0; i < this.items.length; i++) {
            const el = this.items[i];
            if(el.id == cardId){
              this.items.splice(i+offset, 0, ...cards);
              break;
            }
          }
          this.$nextTick(() => {
            this.AnimateEnterCards(this.SelectMode.selected);
          });
          this.moveCardsDialog = false;
          this.SelectMode.mode = '';
        },0);
      }
    },
    SelectRange(first, last, val){//устанавливает чекбоксы в диапазоне в положение val(Булево). first, last - id карточек
      let range = [];
      let counter = 0;
      let topToDown = false;
      for (let i = 0; i < this.items.length; i++) {
        const el = this.items[i];
        if(el.id == first || el.id == last){
          counter++;
          if(counter == 1 && el.id == first) topToDown = true;
        }
        if(counter == 1){
          if(!topToDown && el.id != last) range.push(el.id);
          else if(topToDown && el.id != first) range.push(el.id);
        }
        if(counter == 2) break;
      }
      if(counter == 2){
        if(val){
          let rear = range.filter(item => this.SelectMode.selected.includes(item) == false);
          this.SelectMode.selected.push.apply(this.SelectMode.selected, rear);
        }else{
          let rear = range.filter(item => this.SelectMode.selected.includes(item) == true);
          let ct = this.SelectMode.selected.length-1;
          for (let i = ct; i >= 0 ; i--) {
            const el = this.SelectMode.selected[i];
            if(rear.includes(el)){
              this.SelectMode.selected.splice(i, 1);
            }
          }
        }
        let firstCardState = this.SelectMode.selected.includes(first);
        if(firstCardState != val){
          if(val){
            this.SelectMode.selected.push(first);
          }else{
            let indexFirstCardSelected = this.SelectMode.selected.indexOf(first);
            this.SelectMode.selected.splice(indexFirstCardSelected, 1);
          }
        }
      }
    },
    GetSelectedCards(){//Получает выбранные карточки (из папок изымаются карточки)
      let items = this.items.filter(item => this.SelectMode.selected.includes(item.id));
      let cards = [];
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
          if(el.type != "Folder"){
            cards.push(el);
          }else{
            let sBody = el.body;
            for (let j = 0; j < sBody.length; j++) {
              cards.push(sBody[j]);
           }
          }
      }
      return cards;
    },
    GetSelectedItems(){//Получает выбранные карточки (папки берутся как элемент)
      let items = this.items.filter(item => this.SelectMode.selected.includes(item.id));
      let cards = [];
      for (let i = 0; i < items.length; i++) {
        cards.push(items[i]);
      }
      return cards;
    },
    DeleteSelectedCards(){
      for (let i = this.items.length-1; i >= 0; i--) {
        const el = this.items[i];
        if(this.SelectMode.selected.includes(el.id)){
          this.items.splice(i, 1);
        }
      }
    },
    RemoveFromFolder(folderId, selected){
      let cards = [];
      let index;
      for (let i = 0; i < this.items.length; i++) {
        const el = this.items[i];
        if(el.id == folderId && el.type == "Folder"){
          cards = el.body.filter(item => selected.includes(item.id))
          index = i;
          break;
        }
      }
      let count = this.items[index].body.length-1;
      for (let i = count; i >= 0; i--) {
        const el = this.items[index].body[i];
        if(selected.includes(el.id)){
          this.items[index].body.splice(i, 1);
        }
      }
      this.SelectMode.enable = true;
      setTimeout(()=>{
        this.items.splice(index+1, 0, ...cards);
        this.SelectMode.selected = selected;
        this.$nextTick(()=>{
          this.AnimateEnterCards(this.SelectMode.selected);
        });
      }, 0);
    },
    ConfirmDeleteCards(){
      let count = this.items.length-1;
      for (let i = count; i >= 0 ; i--) {
        const el = this.items[i];
        if(this.SelectMode.selected.includes(el.id)){
          this.items.splice(i, 1);
          let dlid = this.SelectMode.selected.indexOf(el.id);
          this.SelectMode.selected.splice(dlid, 1);
        }
      }
      this.confirmDeleteCardsModal = false;
      this.CheckSelectCount();
    }, 
  },
  mounted(){
    if(this.isFolder){
      this.selectMenu = [
        {
          label: 'Убрать из папки',
					icon: 'pi pi-reply',
					command: () => {
            this.$emit('remove-from-folder', this.folderId, this.SelectMode.selected);
					}
        },
        {
          label: 'Переместить',
					icon: 'pi pi-sort',
					command: () => {
            this.SelectMode.mode = "move";
					}
        },
        {
          label: 'Удалить',
					icon: 'pi pi pi-trash',
					command: () => {
            this.confirmDeleteCardsModal = true;
					}
        },
      ];
    }else{
      this.selectMenu = [
        {
          label: 'Поместить в папку',
					icon: 'pi pi-folder-open',
					command: () => {
            this.SelectMode.mode = "to-folder";
					}
        },
        {
          label: 'Переместить',
					icon: 'pi pi-sort',
					command: () => {
            this.SelectMode.mode = "move";
					}
        },
        {
          label: 'Удалить',
					icon: 'pi pi pi-trash',
					command: () => {
            this.confirmDeleteCardsModal = true;
					}
        },
      ];
    }
  }
};
</script>

<style>
.select-mode-enable .block-card-wrapper:hover{
  outline: 4px solid #2196f34d;;
}

.select-mode-enable .inner-card{
  pointer-events: none;
}
.select-mode_to-folder .inner-card .folder-content .part-1{
  opacity: 1;
  pointer-events: all;
  animation: scale-pulse 1s infinite;
}
.select-mode_to-folder ._selected-card .inner-card .folder-content .part-1{
  opacity: 0.5;
  animation: none;
}

.select-mode_move .block{
  filter: none;
}
.select-mode_move .block._selected-card{
  filter: brightness(0.7);
}
</style>

<style scoped>


.handle-card .__card-check-box{
  margin-left: 8px;
  margin-top: 5px;
  margin-right: 10px;
}

.select-panel{
  width: 100%;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  height: 42px;
  line-height: 40px;
  background-color: #385894;
  animation: show-enter 0.2s;
}
.select-panel._folder{
  height: 52px;
  line-height: 46px;
}

.select-panel .inline-block{
  vertical-align: middle;
  font-size: 20px;
  color: rgb(197, 197, 197);
}

.handle-card-center{
  line-height: 28px;
  color: rgb(206, 206, 206);
}
.handle-part-right .it-icon {
  padding-right: 8px;
}
.btn-add-card {
  line-height: 18px;
  font-size: 18px;
}
.btn-add-card .it-icon {
  line-height: 23px;
  font-size: 26px;
}
.handle-card .it-icon {
  padding-left: 3px;
  padding-right: 3px;
  font-size: 24px;
  line-height: 30px;
  opacity: 0.5;
}
.inner-card {
  padding: 10px;
}
.block-card-wrapper{
  margin: 8px 8px;
  border-radius: 8px;
}
.block {
  padding: 0px;
  margin: 0px 0px;
  overflow: hidden;
}
.block._tool-bar{
  padding: 8px;
}
.handle-card .it-icon{
  cursor: pointer;
}
.handle-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  background-color: rgb(236, 236, 236);
  height: 30px;
}
.handle-card:hover {
  background-color: #b6cbf1;
  height: 30px;
}
.select-mode-enable .handle-card:hover {
  background-color: rgb(236, 236, 236);
}
.handle-card-center_draggable{
  cursor: move;
}
.blue-background-class .handle-card {
  opacity: 0.4;
}
.blue-background-class .block {
  background-color: #a5c0f3;
}
</style>