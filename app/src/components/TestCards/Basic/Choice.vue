<template>
  <div>
    <div v-if="dt != undefined">
      <div></div>
      <pre>{{dt.text}}</pre>
      <div class="choices-body" :class="{'image-mode': isImageMode, [curAspect] : true, [curSize]: true, 'vertical': isVertical, 'cover': isCover}">
        <template v-for="(item, index) in dt.choices" :key="index" class="choice-line">
              <!-- Режим обычный: -->
              <div class="choice-line" v-if="isImageMode == false">
                <it-checkbox v-if="dt.isMultiple" v-model="dt.choices[index].selected"  @input="ChangeState">{{ dt.choices[index].label }}</it-checkbox>
                <it-radio v-else v-model="dt.answer" :value="dt.choices[index].id" :label="dt.choices[index].label"  @input="ChangeState" />
              </div>
              <!-- Режим картинок: -->
              <div class="wrapper-choice" v-else>
                <span class="choice-body" :class="{'_selected': dt.choices[index]?.selected || dt?.answer == dt.choices[index].id }">
                  <div class="choice-image-wrapper" @click="toggle('tgbox'+dt.choices[index].id)">
                  <div class="choice-image _back" :style="'background-image: url(\''+dt.choices[index]?.image?.url+'\')'"></div>
                  <div class="choice-image _front" :style="'background-image: url(\''+dt.choices[index]?.image?.url+'\')'"></div>
                  </div>
                  <div class="choice-image-panel _bottom">
                    <it-checkbox v-if="dt.isMultiple" :ref="'tgbox'+dt.choices[index].id" v-model="dt.choices[index].selected" @input="ChangeState"> </it-checkbox>
                    <it-radio v-else v-model="dt.answer" :ref="'tgbox'+dt.choices[index].id" :value="dt.choices[index].id" @input="ChangeState" />
                  </div>
                  <div class="choice-body-title">
                    <div class="choice-body-text" v-if="dt.choices[index].label.trim().length > 0" @click="toggle('tgbox'+dt.choices[index].id)">
                      <span>
                        {{dt.choices[index].label}}
                      </span>
                    </div>
                    
                  </div>
                </span>
              </div>
        </template>
      </div>

      <div class="card-more-footer">
        <div>
        </div>
        <div class="mini-gray-text">{{ dt.score }}</div>
      </div>
      
    </div>
    <div v-else>Пусто</div>
  </div>
</template>

<script>

export default {
  props: ["data"],
  data() {
    return {
      dt: this.data,

      isImageMode: false,
      isVertical: false,
      isCover: true,
      curAspect: 'a1_1',
      curSize: 'normal',
    };
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

    console.log(this.dt);
  },
  methods: {
    ChangeState(){
      this.$nextTick(()=>{
        this.$emit('change-card-state', this.dt);
      });
    },
    toggle(ref){
      const inp = this.$refs[ref].$el.getElementsByTagName('input')[0];
      inp.click();
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
  },
};
</script>

<style scoped>
.choice-body {
    padding: 0px !important;
 
    /* background-color: #f3f3f3 !important;
    outline: 1px solid #e7e7e7; */
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
  grid-template-columns: auto 1fr;
}
.btn-choice-delete{
  margin-left: 8px;
}
.choice-input-line .it-btn {
  height: 32px !important;
  width: 32px !important;
}
.choice-line {
  display: flex;
  margin-top: 6px;
  margin-bottom: 6px;
}
.choice-line>*{
  cursor: pointer;
}
.prop-line{
  margin-top: 10px !important;
}

</style>