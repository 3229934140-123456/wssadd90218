export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/creators/index',
    'pages/calendar/index',
    'pages/disputes/index',
    'pages/payments/index',
    'pages/creator-detail/index',
    'pages/commission-config/index',
    'pages/settlement-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '医美达人管理',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8FAFC'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页看板'
      },
      {
        pagePath: 'pages/creators/index',
        text: '达人卡片'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '结算日历'
      },
      {
        pagePath: 'pages/disputes/index',
        text: '争议处理'
      },
      {
        pagePath: 'pages/payments/index',
        text: '付款记录'
      }
    ]
  }
})
