<template>
  <div :class="$style.x">
    vue test
    <button @click="onRoute">link</button>
  </div>
</template>

<script type="text/javascript">
export const attributes = {
  title: 'title test for vue'
}

export default {
  beforeEnter( ctx ) {
    setTimeout( () => {
      ctx.next( function ( vm ) {
        console.log( 'beforeEnter vm', vm )
      } )
    }, 2000 )
  },

  enter( ctx ) {
    console.log( 'enter vm', ctx, this )
  },

  created() {
    console.log( this.$ctx )
  },

  methods: {
    onRoute() {
      this.$ctx.api.router.push( 'pages/x' )
    },
  },
}
</script>

<style module lang="scss">
  $blue: #1875e7;

  .x {
    color : $blue;
  }
</style>
