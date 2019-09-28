import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'

class App extends Taro.Component {
  config = {
    pages: ['pages/index/index'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '日历',
      navigationBarTextStyle: 'black'
    },
    sitemapLocation: 'sitemap.json'
  }

  componentWillMount() {
    this.$app.globalData = this.globalData
  }

  render() {
    return null
  }
} //app.js

export default App
Taro.render(<App />, document.getElementById('app'))
