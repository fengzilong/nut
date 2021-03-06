/* global window, document, location */

import Regular from 'regularjs'
import NProgress from 'nprogress'
import Headroom from 'headroom.js'
import docsearch from 'docsearch.js'
import './docsearch.less'
import styles from './index.module.less'
import headroomStyles from './headroom.module.less'
import './nprogress.css'

const NavItem = Regular.extend( {
  template: `
    {#if page.children && page.children.length > 0}
      <a
        href="javascript:;"
        on-click="{ this.onToggleOpen( page ) }"
        class="${ styles.navbar__title } { page.active ? '${ styles.is_active }' : '' } { this.getOpenState( page ) ? '${ styles.is_open }' : '' }"
      >
        <i class="icon nut-icons nut-icon-right ${ styles.navbar__icon }"></i>
        { page.title }
      </a>

      {#if this.getOpenState( page ) && page.children && page.children.length > 0}
        <ul class="${ styles.link__items }">
          {#list page.children as child}
          <li class="${ styles.link__wrapper }">
            <nav-item
              page="{ child }"
              ctx="{ ctx }"
              on-route="{ this.onRoute( $event ) }"
            ></nav-item>
          </li>
          {/list}
        </ul>
      {/if}
    {#else}
      <a
        href="{ page.page.route | routerMode }"
        on-click="{ this.onEmit( $event, page.page ) }"
        class="${ styles.link__item } { page.active ? '${ styles.is_active } nut-layout-now2-lvl1' : '' }"
      >
        { page.title }
      </a>
    {/if}
  `,

  getOpenState( page ) {
    return typeof page.open === 'undefined' ?
      page.active :
      page.open
  },

  onToggleOpen( page ) {
    page.open = !this.getOpenState( page )
  },

  onEmit( e, page ) {
    e.preventDefault()
    this.$emit( 'route', page )
  },

  onRoute( page ) {
    this.$emit( 'route', page )
  },
} )

NavItem.component( 'nav-item', NavItem )
NavItem.filter( 'routerMode', routerModeFilter )

const Layout = Regular.extend( {
  template: `
    <div class="${ styles.progress_container }">
      <div class="${ styles.progress_container__inner }" id="nut-layout-now2-progress"></div>
    </div>
    <div ref="header" class="${ styles.header } ${ headroomStyles.unpinned }">
      <div class="${ styles.header__content }">
        <div class="${ styles.title }" on-click="{ this.onHome() }">
          {#if ctx.app.logo}
            <img class="${ styles.logo }" src="{ ctx.app.logo }" alt="" />
          {/if}

          <div>{ ctx.app.zh | uppercase }</div>
        </div>
        <div class="${ styles.header__right }">
          {#if options.search && options.search.indexName && options.search.apiKey}
            <div class="${ styles.search }">
              <input
                spellcheck="false"
                class="${ styles.search__input }"
                id="nut-layout-now2-search-input"
                placeholder="{ options.search.placeholder || 'Search' }"
                type="text"
              />
            </div>
          {/if}
          <div class="${ styles.sidebar }">
            {#list ctx.api.sidebar.get() as item}
              <a
                href="{ item.route | routerMode }"
                on-click="{ this.onEmit( $event, item ) }"
                class="${ styles.sidebar__item } { item.active ? '${ styles.is_active } nut-layout-now2-lvl0' : '' }"
              >
                {#if item.icon}
                  <span class="icon nut-icons nut-icon-{ item.icon }"></span>
                {/if}
                { item.title }
              </a>
            {/list}
          </div>
        </div>
      </div>
    </div>

    <div class="${ styles.main }">
      <div class="${ styles.main__content }">
        <aside
          class="${ styles.navbar } { headPinned ? '${ styles.is_head_pinned }' : '' }"
          style="{ options.navbar && options.navbar.width ? 'width: ' + options.navbar.width + ';' : '' }"
        >
          <div class="${ styles.navbar__scroller }">
            {#list currentPages as page}
              <nav-item
                page="{ page }"
                ctx="{ ctx }"
                on-route="{ this.onRoute( $event ) }"
              ></nav-item>
            {/list}
          </div>
        </aside>

        <div class="${ styles.content } markdown-body nut-layout-now2-content">
          <div ref="$$mount"></div>

          <div class="${ styles.pagination }">
            {#if prevPage}
              <a
                class="${ styles.pagination__item }"
                href="{ prevPage.page.route | routerMode }"
                on-click="{ this.onEmit( $event, prevPage.page ) }"
              >
                <i style="margin-right: 4px;" class="nut-icons nut-icon-arrowleft"></i>
                { prevPage.title }
              </a>
            {#else}
              <div style="width: 80px;"></div>
            {/if}

            {#if options.editpage}
            <div class="${ styles.edit_page }">
              <a href="javascript:;" on-click="{ this.onEditPage() }">
                <span class="icon nut-icons nut-icon-edit"></span> 编辑本页
              </a>
            </div>
            {/if}

            {#if nextPage}
              <a
                class="${ styles.pagination__item }"
                href="{ nextPage.page.route | routerMode }"
                on-click="{ this.onEmit( $event, nextPage.page ) }"
              >
                { nextPage.title }
                <i style="margin-left: 4px;" class="nut-icons nut-icon-arrowright"></i>
              </a>
            {#else}
              <div style="width: 80px;"></div>
            {/if}
          </div>

        </div>

      </div>
    </div>
  `,

  computed: {
    currentPages() {
      return this.getCurrentPages()
    },
  },

  config() {
    this.data.headPinned = false
  },

  init() {
    const ctx = this.data.ctx

    const headroom = this.headroom = new Headroom( this.$refs.header, {
      classes: headroomStyles,
      onPin: () => {
        this.data.headPinned = true
        this.$update()
      },
      onUnpin: () => {
        this.data.headPinned = false
        this.$update()
      },
    } )

    setTimeout( () => {
      headroom.init()

      // update headroom state manually
      if ( headroom.getScrollY() === 0 ) {
        headroom.pin()
      }

      setTimeout( () => {
        this.$refs.header.classList.add( headroomStyles.transition )
      }, 10 )

      const searchOptions = this.data.options.search || {}
      if ( searchOptions.indexName && searchOptions.apiKey ) {
        docsearch(
          Object.assign( {}, searchOptions, {
            inputSelector: '#nut-layout-now2-search-input',
            debug: Boolean( searchOptions.debug ),
            layout: 'collumns',
            handleSelected( input, event, suggestion, datasetNumber, context ) {
              if (
                context.selectionMethod === 'click' ||
                context.selectionMethod === 'enterKey'
              ) {
                input.setVal( '' )
                ctx.api.router.push( suggestion.url, {}, () => {
                  // page DOM maybe not ready
                  setTimeout( triggerAnchor, 100 )
                } )
              }
            },
          } )
        )

        setTimeout( triggerAnchor, 100 )
      }
    }, 0 )

    function triggerAnchor() {
      if (
        ctx.app.router &&
          ctx.app.router.mode === 'history' &&
          location.hash
      ) {
        // force anchor
        let tag = document.createElement( 'a' )
        tag.href = location.hash
        tag.click()
        tag = null

        // check headroom
        setTimeout( checkHeadroom, 50 )
        setTimeout( checkHeadroom, 400 )
      }
    }

    function checkHeadroom() {
      if ( headroom.getScrollY() > 0 ) {
        headroom.unpin()
      }
    }
  },

  onEditPage() {
    const options = this.data.options || {}
    // if you are in some monorepo or use some plugin to provide pages
    // please provide a custom handler
    const handler = options.editpage && options.editpage.handler
    let base = ( options.editpage && options.editpage.base ) || ''
    const currentRouter = this.data.ctx.api.router.current

    if ( currentRouter && currentRouter.options ) {
      const page = {
        page: currentRouter.options.page,
        extension: currentRouter.options.extension,
        provider: currentRouter.options.page,
        plugin: currentRouter.options.plugin,
      }

      if ( handler ) {
        return handler( this.data.ctx, page )
      }

      if ( !base ) {
        return console.warn( 'no pages base uri found for editpage, try to add `editpage.base`' )
      }

      base = base.replace( /\/$/, '' )

      window.open( base + '/' + page.page + page.extension )
    }
  },

  onEmit( e, page ) {
    e.preventDefault()
    this.onRoute( page )
  },

  onRoute( page ) {
    if ( page && page.route ) {
      this.data.ctx.api.router.push( page.route )
      return
    }

    if ( page && page.link ) {
      window.open( page.link )
    }
  },

  getActivePage( pages ) {
    let found

    walkChildren( pages, null, child => {
      if ( child.page && child.active ) {
        found = child
      }
    } )

    return found || {}
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

  onHome() {
    this.data.ctx.api.router.push( '/' )
  },
} )

function walkChildren( children, parent, callback ) {
  if ( !children ) {
    return
  }

  if ( Array.isArray( children ) ) {
    children.forEach( ( v, i ) => {
      callback( v, i, parent )

      if ( Array.isArray( v.children ) ) {
        walkChildren( v.children, v, callback )
      }
    } )
  }
}

Layout.filter( 'uppercase', v => v && v.toUpperCase() )
Layout.filter( 'routerMode', routerModeFilter )
Layout.component( 'nav-item', NavItem )

function routerModeFilter( url ) {
  const config = this.data.ctx && this.data.ctx.app
  const routerMode = ( config && config.router && config.router.mode ) || 'hash'

  if ( routerMode === 'hash' ) {
    return '#' + url
  }

  return url
}

export default async function ( ctx, options = {} ) {
  let layout = null

  const progressElId = 'nut-layout-now2-progress'

  ctx.api.router.beforeEach( function ( { next } ) {
    const $progress = document.getElementById( progressElId )

    if ( $progress ) {
      NProgress.configure( {
        parent: '#' + progressElId
      } )
      NProgress.start()
    }

    next()
  } )

  ctx.api.router.afterEach( function () {
    const $progress = document.getElementById( progressElId )

    if ( $progress ) {
      NProgress.configure( {
        parent: '#' + progressElId
      } )
      NProgress.done()
    }
  } )

  await ctx.api.layout.register( {
    name: 'now',

    mount( node ) {
      if ( !layout ) {
        layout = new Layout( {
          data: {
            ctx,
            options,
          },
        } )

        ctx.events.on( 'page:after-mount', () => {
          window.scrollTo( 0, 0 )

          // update pagination
          const pages = layout.$get( 'currentPages' )
          const leafPages = []
          walkChildren( pages, null, child => {
            if ( !child.children || ( child.children.length === 0 ) ) {
              leafPages.push( child )
            }
          } )

          let activeIndex
          leafPages.forEach( ( page, index ) => {
            if ( page.active ) {
              activeIndex = index
            }
          } )

          if ( activeIndex > 0 ) {
            layout.data.prevPage = leafPages[ activeIndex - 1 ]
          } else {
            layout.data.prevPage = null
          }

          if ( ( activeIndex + 1 ) < leafPages.length ) {
            layout.data.nextPage = leafPages[ activeIndex + 1 ]
          } else {
            layout.data.nextPage = null
          }

          // update open
          const sidebar = ctx.api.sidebar.get()
          if ( sidebar && sidebar.length > 0 ) {
            // reset when route change
            sidebar.forEach( s => {
              if ( s.children && s.children.length > 0 ) {
                s.children.forEach( c => {
                  c.open = void 0
                } )
              }
            } )
          }

          layout.$update()
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
      layout.data.options = options
      layout.$update()
    },

    getMountNode() {
      return layout && layout.$refs.$$mount
    },
  } )
}
