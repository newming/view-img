# view-img for vue.js

a component for mobile preview img with hammerjs. support move and zoom

[demo](https://newming.github.io/view-img)

## Usage

### A.Globally

```js
// in your app entry
import ViewImg from 'view-img'
Vue.use(ViewImg)

// then in your templete write
// <view-img :show="show" :img='img' @hide='hide'></view-img>
```

### B.Single

```js
// in your component
import {ViewImg} from 'img-view'
export default {
  components: {
    'view-img': ViewImg
  }
}
```

## Properties

| property | required | type | default | description |
| -------- | -------- | ---- | ------- | ----------- |
| show     | true     | Boolean | false | if the model display |
| img      | true     | String | '' | the image url will show |

## Events
| name | required | description |
| ---- | -------- | ----------- |
| hide | true     | the event for click the model, you can hide the model with this event |

## References

[hammer](http://hammerjs.github.io/)
