/* global window */

import Regular from 'regularjs'
import Tippy from './tippy'
import styles from './index.module.less'

// TODO: 最近浏览
const Layout = Regular.extend( {
  template: `
    <aside class="${ styles.sidebar }">
      <div class="${ styles.logo }"></div>
      {#if sidebar}
        <ul class="${ styles.sidebar__items }">
          {#list sidebar as item}
            <li
              class="${ styles.sidebar__item } { item.active ? '${ styles.is_active }' : '' }"
              title="{ item.title }"
              r-tippy="{ { placement: 'right', duration: 0 } }"
            >
              <a
                href="javascript:;"
                on-click="{ this.onRoute( item ) }"
                class="${ styles.sidebar__link }"
              >
                <i class="${ styles.sidebar__item_icon } nut-icons nut-icon-{ item.icon }"></i>
              </a>
            </li>
          {/list}
        </ul>
      {/if}
    </aside>

    <div class="${ styles.header }">
      <div class="${ styles.header__actions }"></div>
      <div class="${ styles.header__menu }">
        {#inc ctx.app.zh | t }
      </div>
      <div class="${ styles.header__user }">
        {#if ctx.user && ctx.user.nickname}
        <span style="cursor: pointer;">
          <i class="nut-icons nut-icon-user"></i>
          { ctx.user.nickname }
        </span>
        {/if}
      </div>
    </div>

    <div class="${ styles.content }">
      <div class="${ styles.progress_wrapper }">
        <div class="${ styles.progress_container }" id="progress-container"></div>
      </div>

      {#if currentPages.length > 0}
        <div class="${ styles.navbar }">
          <div class="${ styles.navbar__scroller }">
            {#list currentPages as page}
              <a
                href="javascript:;"
                on-click="{ this.onRoute( page.page ) }"
                class="${ styles.navbar__item } { page.active ? '${ styles.is_active }' : '' }"
              >
                {#if page.title}
                  { page.title }
                {#else}
                  未命名
                {/if}
              </a>
            {/list}
          </div>
        </div>
      {/if}

      <div class="${ styles.page_container }">
        {#if this.getActivePage( currentPages ).page.type === 'markdown'}
          <div class="${ styles.page_content }">
            <div
              class="markdown-body"
              style="padding: 30px 40px;"
              ref="$$mount"
            ></div>
          </div>
        {#else}
          <div class="${ styles.page_content }" ref="$$mount"></div>
        {/if}
      </div>
    </div>
  `,

  computed: {
    currentPages() {
      return this.getCurrentPages()
    },

    sidebar() {
      return this.data.ctx.api.sidebar.get()
    }
  },

  onRoute( item ) {
    if ( item.route ) {
      this.data.ctx.api.router.push( item.route )
      return
    }

    if ( item.link ) {
      window.open( item.link )
    }
  },

  getActivePage( pages ) {
    return pages.find( page => page.active ) || {}
  },

  getCurrentPages() {
    if ( !this.data.ctx ) {
      return []
    }

    const sidebar = this.data.ctx.api.sidebar.get()
    const found = sidebar.find( s => s.active )

    if ( !found ) {
      return []
    }

    return found.children || []
  },
} )

Layout.use( Tippy )
Layout.filter( 't', function ( v ) {
  v = String( v )
  const first = v.substr( 0, 1 )
  const rest = v.substr( 1 )
  return `<span class="${ styles.first_letter }">${ first }</span>${ rest }`
} )

export default async function ( ctx ) {
  let layout = null

  await ctx.api.layout.register( {
    name: 'side',

    mount( node ) {
      if ( !layout ) {
        layout = new Layout( {
          data: { ctx }
        } )
      }

      layout.$inject( node )
    },

    unmount() {
      if ( !layout ) {
        return
      }

      layout.$inject( false )
    },

    update( data = {} ) {
      if ( !layout ) {
        return
      }

      layout.data.ctx = data.ctx
      layout.$update()
    },

    getMountNode() {
      return layout && layout.$refs.$$mount
    },
  } )
}
