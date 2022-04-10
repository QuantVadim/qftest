<template>
  <div>
    <div v-if="dt != undefined">
      <div></div>
      <pre>{{ dt.text }}</pre>
      <div class="choices-body choices-body--result" :class="{'image-mode': isImageMode, [curAspect] : true, [curSize]: true, 'vertical': isVertical, 'cover': isCover}" >
        <template v-for="(item, index) in dt.choices" :key="index" class="choice-line">

              <!-- Режим обычный: -->
              <div class="choice-line" v-if="isImageMode == false">
                <it-checkbox
                :class="{ not_marked: getType(item) == 'warning' }"
                :type="getType(item)"
                v-if="dt.isMultiple"
                v-model="dt.choices[index].selected"
                >{{ dt.choices[index].label }}</it-checkbox>
              <it-radio
                v-else
                :class="{ not_marked: getType(item) == 'warning' }"
                :type="getType(item)"
                :label="dt.choices[index].label"
                v-model="dt.answer"
                :value="dt.choices[index].id"
                />
              </div>
              <!-- Режим картинок: -->
              <div class="wrapper-choice" v-else :class="{ not_marked: getType(item) == 'warning' }" :type="getType(item)">
                <span class="choice-body" :class="{'_selected': dt.choices[index]?.selected || dt?.answer == dt.choices[index].id }">
                  <div class="choice-image-wrapper">
                    <div class="choice-image _back" :style="'background-image: url(\''+dt.choices[index]?.image?.url+'\')'"></div>
                    <div class="choice-image _front" :style="'background-image: url(\''+dt.choices[index]?.image?.url+'\')'"></div>
                  </div>
                  <div class="choice-image-panel _bottom">
                    <it-checkbox v-if="dt.isMultiple" v-model="dt.choices[index].selected" :class="{ not_marked: getType(item) == 'warning' }" :type="getType(item)"> </it-checkbox>
                    <it-radio v-else v-model="dt.answer" :value="dt.choices[index].id" :class="{ not_marked: getType(item) == 'warning' }" :type="getType(item)" />
                  </div>
                  <div class="choice-body-title">
                    <div class="choice-body-text" v-if="dt.choices[index].label.trim().length > 0">
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
        <div></div>
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
    this.dt.text = this.data?.text ? this.data.text : "";
    this.dt.score = this.data?.score ? this.data.score : 0;
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
    getType(item) {
      let ret = "success";
      if (this.dt.isMultiple) {
        if (item.selected && item.state == "incorrect") {
          ret = "danger";
        }
        if (!item.selected && item.state == "not_marked") {
          ret = "warning";
        }
      } else {
        if (item.id == this.dt.answer && item.state == "incorrect") {
          ret = "danger";
        }
        if (item.state == "not_marked") {
          ret = "warning";
        }
      }
      return ret;
    },
  },
};
</script>

<style scoped>
.wrapper-choice .choice-body{
  overflow: unset !important;
}
.wrapper-choice .choice-body._selected{
  outline: none !important;
}

.choice-body {
    padding: 0px !important;
    /* outline: 1px solid #e7e7e7;
    background-color: #f3f3f3 !important; */
}
.choices-body.image-mode{
  row-gap: 8px;
  column-gap: 8px;
}
.choice-body._selected {
    outline: 3px solid #3051FF !important;
}

.choices-body--result .it-checkbox-wrapper {
  pointer-events: none !important;
}
.choices-body--result .it-radio-wrapper {
  pointer-events: none !important;
}

.choice-options {
  padding-bottom: 6px !important;
  opacity: 0.23;
  transition: opacity 0.2s;
}
.choice-options:hover {
  opacity: 1;
}
.choice-input-line {
  display: grid;
  grid-template-columns: auto 1fr;
}
.btn-choice-delete {
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
.choice-line > * {
  cursor: pointer;
}
.prop-line {
  margin-top: 10px !important;
}
</style>