---
title: 列表
permission: [ 'admin' ]
---

import Regular from 'regularjs'

const Page = Regular.extend( {
  template: `
    列表页 { count }
  `,

  config() {
    this.data.count = 0
  },

  init() {
    setInterval( () => {
      this.data.count = this.data.count + 1
      this.$update()
    }, 1000 )
  }
} )

export default function ( ctx ) {
  let instance

  return {
    beforeEnter( { next } ) {
      next()
    },

    mount( node ) {
      if ( !instance ) {
        instance = new Page()
      }
      instance.$inject( node )
    },

    unmount( node ) {
      if ( !instance ) {
        return
      }

      instance.$inject( false )
    },
  }
}
