<template>
  <div class="item-group-wrapper">
    <div>
      <it-avatar size="56px" :text="data.name" :src="data.ico_url" />
    </div>
    <div>
      <h3 @click="goGroup" class="group-card-header">{{ data.name }}</h3>
      <div class="group-card-count-users" >Участники: {{ data.count_users }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['data'],
  data(){
    return{

    }
  },
  methods:{
    goGroup(){
      this.$router.push(`/group/${this.data.gr_id}`);
    }
  }
}
</script>

<style>
.item-group-wrapper{
  display: grid;
  grid-template-columns: 60px 1fr;
}
.group-card-header{
  margin: 3px;
}
.group-card-count-users{
  color: gray;
  font-size: 13px;
}
h3.group-card-header:hover{
  cursor: pointer;
  text-decoration: underline;
}
</style>