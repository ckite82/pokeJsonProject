<template>
  <div class="title-container">
  <img src="@/assets/pokemon.png">
  </div>
</template>

<script>
export default {
    name: "pokemon-title",
  props: ["title"]

}
</script>

<style scoped>

.title-container{
  display: flex;
  align-items: center;
  justify-content: center;
}

img{
  border: 5px;
  border-color: rgb(72, 105, 197);
  border-style: solid;
}

</style>