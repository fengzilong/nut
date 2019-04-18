import Regular from 'regularjs'
import styles from './index.module.less'

const Shell = Regular.extend( {
  template: `
    <div class="${ styles.shell }">
      <div class="${ styles.header }">
        <div class="${ styles.header__name }">
          { ctx.app.zh }
        </div>
        <div class="${ styles.header__user }">
          {#if ctx.user && ctx.user.nickname}
          <i class="nut-icons nut-icon-user"></i>
          { ctx.user.nickname }
          {/if}
        </div>
      </div>
      <div class="${ styles.navbar }">
        <ul class="${ styles.navbar__items }">
          {#list ctx.app.sidebar as item}
            <li class="${ styles.navbar__item } { item.active ? '${ styles.is_active }' : '' }">
              <a
                href="{ item.route ? '#' + item.route : item.link }"
                {#if item.link}
                target="_blank"
                {/if}
              >
                {#if item.icon}
                <i class="nut-icons nut-icon-{ item.icon }"></i>
                {/if}
                { item.title }
              </a>
            </li>
          {/list}
        </ul>
      </div>

      {#if currentPage && currentPage.type === 'markdown'}
        <div class="${ styles.content }">
          <div class="${ styles.markdown } markdown-body" ref="$$view">
          </div>
        </div>
      {#else}
        <div class="${ styles.content }">
          <div class="${ styles.other }" ref="$$view"></div>
        </div>
      {/if}

    </div>
  `,

  computed: {
    currentPage() {
      const currentPages = this.getCurrentPages()
      return currentPages.find( page => page.active ) || {}
    },
  },

  getCurrentPages() {
    if ( !this.data.ctx ) {
      return []
    }

    const sidebar = this.data.ctx.app.sidebar
    const found = sidebar.find( s => s.active )

    if ( !found ) {
      return []
    }

    return found.children || []
  },
} )

export default Shell