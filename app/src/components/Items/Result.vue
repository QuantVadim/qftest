<template>
  <div>
    <div class="card_test_top_header">
      <div class="card-autor-name">{{ date_created }}</div>
      <div>
        <div v-if="data.usr_id == $store.state.ME.data.usr_id">
        <it-icon name="more_horiz" @click="toggle"/>
        <Menu ref="menu" :model="itemsMenu" :popup="true" />
        </div>
      </div>
    </div>
    <div class="card-result-body" @click="goResult">
      
      <div class="itm-result-center">
        <div>
          <it-avatar square size="56px" :src="data.ico_url" :text="data.name" />
          <it-avatar v-if="data?.gr_id" size="30px" class="group-avatar" :src="data.group_ico_url" :text="data.name" @click.stop="goGroup" :title="data.group_name" />
        </div>
        
        <h3 class="card-test-title"><span >{{ data.name }}</span></h3>
        <span v-if="data?.description?.length" class="card-description">
          <pre>{{ data.description}}</pre>
        </span>
      </div>
      <div>
         <span v-if="data.ready == 1">
            <Knob v-model="score" :min="0" :max="100" :size="50" :valueTemplate="score+'%'" readonly />
            <div class="result-card-score">{{ data.score+"/"+data.max_score }}</div>
         </span>
        <span v-else>
          <div class="pencil-writing" style=" padding: 10px"></div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Knob from 'primevue/knob';
import Menu from 'primevue/menu';

export default {
  components:{
    Knob, Menu
  },
  props: ['data', 'index'],
  data(){
    return{
      score: Math.floor((+this.data.score/+this.data.max_score)*100),
      itemsMenu: [
        {
					label: 'К тесту',
					icon: 'pi pi-caret-right',
					command: () => {
						this.goTest();
					}
				},
        {
					label: 'Удалить',
					icon: 'pi pi-times',
					command: () => {
						this.$emit('delete', this.data, this?.index );
					}
				},
      ],
    }
  },
  computed: {
    user_name(){
      if(this.data?.first_name){
        return this.data?.first_name+' '+this.data?.last_name;
      }else
      return this.data?.user_name;
    },
    date_created(){
      if(this?.data?.date_created){
      return this.data.date_created;
      }else return "";
    }
  },
  watch:{
    score(){
      this.score = Math.floor((+this.data.score/+this.data.max_score)*100);
    }
  },
  methods:{
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    goGroup(){
      if(this.data.gr_id != null){
        this.$router.push(`/group/${this.data.gr_id}`);
      }
    },
    goTest(){
      if(this.data.gr_id != null){
        this.$router.push(`/gtest/${this.data.ref_test_id}`);
      }else{
        this.$router.push(`/test/${this.data.ref_test_id}`);
      }
      
    },
    goResult(){
      if(this.data.ready == 1){
        this.$router.push(`/result/${this.data.res_id}`);
      }else if(this.data.ready == 0){
        this.goTest();
      }
      
    }
  },
  renderTracked(){
    this.score = Math.floor((+this.data.score/+this.data.max_score)*100);
  }

}
</script>

<style scoped>
.group-avatar{
  margin-left: -70px;
  margin-top: 30px;
  outline: 3px solid white;
  transition: transform 0.2s;
  cursor: pointer;
}
.group-avatar:hover{
  transform: scale(1.6) translate( 6px, -6px )
}

.p-knob.p-component{
  height: 45px;
  display: flex;
  justify-content: space-around;
}


.result-card-score{
  text-align: center;
  color: gray;
  font-size: 14px;
}
.itm-result-center{
  margin-left: 0px;
}
.card-result-body{
  display: grid;
  grid-template-columns: 1fr auto;
  cursor: pointer;
}
.card-result-body:hover .card-test-title span{
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.it-avatar{
  float: left;
  margin-right: 8px;
}

.it-icon{
  cursor: pointer;
}

.card_test_top_header{
  display: grid;
  grid-template-columns: 1fr auto;
}
pre{
  margin: 0px
}
h3{
  margin: 0px;
}
.card-autor-name{
  color: gray;
}
.card-description pre{
  color: gray;
  margin-right: 6px;
  border-radius: 8px;
  padding-top: 3px;

  max-height: 300px;
  overflow-y: auto;
  font-size: 12px !important;
  max-height: 84px;
  overflow: hidden;
}
</style>