module.exports = {
  zh: '某个系统',
  en: 'PMP',
  theme: 'ocean',
  layout: 'default',
  plugins: {
    login: {
      path: require.resolve( './plugins/login-netease-openid' ),
      enable: true,
      // env: [ 'development' ],
    },
    test: {
      path: require.resolve( './plugins/test' ),
      enable: true,
    }
  },
  markdown: {
    theme: 'prism-okaidia',
  },
  sidebar: [
    {
      icon: 'sketch',
      title: '宝石',
      pages: [
        'pages/home/home',
        'pages/home/regular',
        'pages/home/vue',
        '!pages/home/demo/_id', // 隐藏页面（!）TODO: 将_id和另一个页面放一起
      ]
    },
    {
      icon: 'read',
      title: '文档',
      pages: [
        'pages/documents/index',
        'pages/documents/reference',
      ],
    },
  ],
  landing: {
    use: 'default',
    options: {
      title: '某个不知名的系统',
      description: '哈哈哈',
      preview: '',
      buttonText: '',
    },
  },
}
