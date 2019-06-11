export default function ( all = {} ) {
  const source = all.default || ''
  const attributes = all.attributes || {}

  return {
    $$nut( ctx ) {
      return {
        attributes,

        mount( node ) {
          node.innerHTML = source
        },

        unmount( node ) {
          node.innerHTML = ''
        },
      }
    }
  }
}
