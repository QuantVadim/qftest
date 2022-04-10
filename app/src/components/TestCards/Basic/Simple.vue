<template>
<div>
  <div v-if="dt != undefined">
  <div></div>
  <pre>{{ dt.text }}</pre>
  <it-input v-model="dt.answer" placeholder="Ответ" @change="ChangeState"></it-input>
  </div>
  <div v-else>Пусто</div>
</div>
</template>

<script>

export default {
  props: ['data'],
  data(){
    return{
      dt: this.data,
    }
  },
  mounted(){
    console.log(this.dt);
  },
  methods:{
    ChangeState(){
      this.$emit('change-card-state', this.dt);
    }
  }
}
</script>

<style>
</style>