RxJS 起手式

[示例代码](https://github.com/Guo-dalu/try-rxjs)

# what? 前世今生

## 官方介绍

> REACTIVE EXTENSIONS LIBRARY FOR JAVASCRIPT

> RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code. This project is a rewrite of Reactive-Extensions/RxJS with better performance, better modularity, better debuggable call stacks, while staying mostly backwards compatible, with some breaking changes that reduce the API surface.

> An API for asynchronous programming with observable streams.

重点：

- 通过可监听流来做异步编程的 API。
- 函数式编程

## 别的语言中的 Rx：

Rx 的概念最初由微软公司实现并开源，也就是 Rx.NET，因为 Rx 带来 的编程方式大大改进了异步编程模型，在.NET 之后，众多开发者在其他平台和语言上也实现了 Rx 的类库。可见，Rx 其实是一个大家族，在这个大家族中，还有用 Java 实现的 RxJava，用 C++实现的 RxCpp，用 Ruby 实现的 Rx.rb，用 Python 实现的 RxPy，当然，还有这个大家族中最年长的 Rx.NET。

## 版本变迁

- 6 -> 7：webSocket，代码结构的变化，import 位置变化
- 7 -> 8：不再暴露 lift 等内部 API。typescript 更新到 3.5.3。

## 竞品

[Bacon.js](https://baconjs.github.io/)
[Cycle.js](https://cycle.js.org/)

[让这些 functional reactive stream 库](https://medium.com/better-programming/compare-leading-javascript-functional-reactive-stream-libraries-544163c1ded6) 分出谁胜谁负没有太大意义，关键是了解其思想。

# how? 如何使用

## 基础概念

### [Observerable](https://rxjs-dev.firebaseapp.com/guide/observable)

Observables are lazy Push collections of multiple values.

2 features:

- lazy
- push

### lazy

只有订阅了数据源，数据源才会吐数据。

#### push-based

拉取很简单，就是一种消费者主动索取所需数据的方式，生产者只有当消费者发出需求信号时才会提供数据。函数调用就是一种简单的拉取实例，消费者主动调用。

推送则是由生产者决定何时向消费者传送数据，消费者无法自己单独决定获取数据的时机，被动接受。Js 中的事件监听和 Promise（还包括回调函数）就是很典型的数据推送系统（或者叫观察者模式/Observer Pattern，回调可以看做只有一个观察者的观察者模式），而 Observable 就是一种更为强大的数据推送系统（ Promise ++）。

以下为几类常见的拉取和推送模型：

Function: 单次拉取模型，调用时会同步的返回单一值
Generator/Iterator: 多次拉取模型，调用时会同步的返回 0 到无限多个值
Promise: 单次推送模型，由生产者决定时机返回单一值
Observable: 多次推送模型，由生产者决定时机返回 0 到无限多个值

### Observer

观察者, 当订阅者产生了数据时, 观察者就可以拿到数据做自己的业务逻辑。

### Subscriber

订阅者, 实现了 Observer 的接口，如 unsubscribe。可以简单地理解为跟 Observer 是同一个角色。

### Subscribtion

Observable 调用 subscribe 方法后得到一个 Subscribtion, 可以被取消。
注意，Observable 产生的事件，只有 Observer 通过 subscribe 订阅之后才会收到，在 unsubscribe 之后就不会再收到。数据源与 Observer 是独立的，可能还在不停的吐数据，只是不再接受这个数据了。

见 observer-basics.js。

### Subject

既是 Observable 也是 Observer, 和 EventEmmiter 类似。

Cold Observerable vs Hot Observerable

- Cold Observerable: 每次被 subscribe 都产生一个全新的数据序列的数据流。如 interval, range 等。如果没有订阅者，连数据都不会真正产生。
- Hot Observerable: 只有一个数据源。如 fromPromise, fromEvent 等，数据源是来自于外部的。

自己写的去调用 next() 的 Observable 是冷的吗？是的。

见 cold-observer.js 和 click-stream.js。

要把 Cold Observable 变成 Hot Observable，就需要用到一个中间人。

- 中间人要提供 subscribe 方法，让其他人能够订阅自己的数据源。
- 中间人要能够有办法接受推送的数据，包括 Cold Observable 推送的数据。

Subject 就是这样的一个中间人。后加入的观察者，并不会获得加入之前 Subject 对象上吐出的的数据。

![subject](https://social.xingshulinimg.com/rich-editor/1603379766262.png)

见 hot-overser.js。

_注意，Subject 并不适用于合并数据流，因为任何一个上游数据源的结束或报错，都会终止 Subject 对象的生命。_

见 unexpected-subject.js。

### Stream

万物皆流。

- 网页 DOM 的事件
- 通过 WebSocket 获得的服务器端推送消息
- 通过 AJAX 获得服务器端的数据资源

流具有时序性，就像弹珠图的横轴是时间一样，可以借助各种操作符去 declare 流的转变，限制流的变化。

## 操作符方法

在 RxJS 中，有一系列用于产生 Observable 的函数，这些函数有的凭空创造 Observable 对象，有的根据外部数据源产生 Observable 对象，更多的是根据其他的 Observable 中的数据来产生新的 Observable 对象，也就是把上游数据转化为下游数据，所有这些函数统称为操作符。

不过有的操作符是 Observable 类的静态函数，也就是不需要 Observable 实例就可以执行的函数，所以称为「静态操作符」；另一类操作符是 Observable 的实例函数，前提是要有一个创建好的 Observable 对象，这一类称为「实例操作符」。

静态操作符：of, range, from, timer, interval...
实例操作符：concat, zip, combineLatest，debounce， throttle...

可以参考 ramda 来理解。

### 高阶操作符

吐出 Observable 的 Observable。

数据流虽然管理的是数据，数据流自身也可以认为是一种数据，既然数据可以用 Observable 来管理，那么数据流本身也可以用 Observable 来管理。

见 higher-order-observable.js

concatAll
![concatAll](https://social.xingshulinimg.com/rich-editor/1603437140436.png)

mergeAll
![mergeAll](https://social.xingshulinimg.com/rich-editor/1603437172733.png)

switchAll
![switchAll](https://social.xingshulinimg.com/rich-editor/1603439446404.png)


# why? 优势

## 从特性出发

- lazy
- pull-based
- 解耦
- 函数式，declarative
- 对比 promise，会吐出多个数据。

## 流式的思维方式

天然具有时序性，提供了多种多样的操作符，只要编织各个流的转化即可得到最终的结果。

### 例子 1：联想搜索

```js
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

const searchBox = document.getElementById('search-box');

const typeahead = fromEvent(searchBox, 'input').pipe(
  map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
  filter(text => text.length > 2),
  debounceTime(100),
  distinctUntilChanged(),
  switchMap(searchTerm => ajax(`/api/endpoint?search=${searchTerm}`))
);

typeahead.subscribe(data => {
  // Handle the data from the API
});
```

### 例子 2：每次隔更久的 retry

```js
import { of, pipe, range, throwError, timer, zip } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { map, mergeMap, retryWhen } from 'rxjs/operators'

export function backoff(maxTries, delay) {
  return pipe(
    retryWhen((attempts) =>
      zip(range(1, maxTries + 1), attempts).pipe(
        mergeMap(([i, err]) => (i > maxTries ? throwError(err) : of(i))),
        map((i) => i * i),
        mergeMap((v) => timer(v * delay))
      )
    )
  )
}

ajax('/api/endpoint')
  .pipe(backoff(3, 250))
  .subscribe(function handleData(data) {
    /* ... */
  })
```

## 延伸

[如何看待 snabbdom 的作者开发的前端框架 Turbine 抛弃了虚拟 DOM？](https://www.zhihu.com/question/59953136)

# best practice: 结合框架使用

## Vue/Angualr 框架

在三大框架中，[Angular 最早集成了 RxJs](https://angular.io/guide/rx-library)，属于官方推荐，Angular6 支持了 RxJS v6，Angular7 支持了 RxJS 6.3。

Vue 也推出了[vue-rx](https://github.com/vuejs/vue-rx)，集成了 RxJS v6。但是因为 Vue 本身会监听 props/data 的改变，所以 RxJS 没有被广泛使用。

```js
// provide Rx observables with the `subscriptions` option
new Vue({
  el: '#app',
  subscriptions: {
    msg: messageObservable
  }
```

或者，在组件中使用：

```js
import { Observable } from 'rxjs'

Vue.component('foo', {
  subscriptions: function () {
    return {
      msg: new Observable(...)
    }
  }
})
```

## 结合 react & redux 使用

### 页面结构

每一个页面都写在 containers/pages 中，一个页面一个文件夹，主要包括以下部分：

- constants.js
  定义了包括 actions 的 type 在内的一系列常量

- actions.js
  export 一系列小函数，每个函数都返回一个对象，格式为：

```js
{
  type: CONSTANTS, //  引入constants中的常量作为type
    payload
}
```

- reducer.js

定义了这个页面的 state，以及接受到 action 时对 state 的同步操作。
所有的 state 都是 immutable 的，注意 updateIn, update, set, concat 等的用法。

- epics.js

定义了这个页面的所有异步流，以流的方式接收异步 action，并吐出同步的 action。
用到了 RxJS, 注意操作符的选择(switchMap, flatMap)和生成流(forkJoin, of)的操作符。

- selectors.js

定义了所有的选择器，利用封装的 createSelector 方法，从\$state 中获取需要的 selector。

- styled.js/css 文件

定义了 DomWrapper 为主的样式。利用了'styled-components'。

- index.js

页面主体部分，有自己的 state。接收所有的 actions, selectors 作为 props。
所有其余的文件均在这里拼接：

```js
export default pipe(
  connect(
    createStructuredSelector({
      $infos: $infos_,
      $records: $records_,
    }),
    actions
  ),
  authViewWrapper
)(HrCreateFailedPage)
```

### 数据流向

示意图如下：

```ascii

+-----------------+    +-----------------------------------+
|                 |    |                                   |
|    component    |    |              component            |
|                 |    |                                   |
+--------^--------+    +-----------------^-----------------+
         |                               |
         |                               |
+----------------------------------------------------------+
|                                                          |
|                          container                       |
|                                                          |
+--------^-------------------------------+-----------------+
         |                               |
         |                               |
+--------+--------+    +-----------------v-----------------+
|                 |    |                                   |
|     selector_   |    |               action              |
|                 |    |                                   |
+---+---------^---+    +-------+-------------------+-------+
    |         |                |                   |
    |         |                |                   |
+---v---------+---+    +-------v------+    +-------v-------+
|                 |    |              |    |               |
|     $state      <----+    reducer   <----+     epics$    |
|                 |    |              |    |               |
+-----------------+    +--------------+    +---------------+

```

- selector： getter/computer

  - val_ = createSelector( state_, (state) => state.val ) => val

- store

  - data => immutable 数据 + reducer setter (同步)

- epics$: redux 和 redux-observable 结合 RxJS 异步 action

  - epic(action$, state$).pipe(...).subscribe(store.dispatch)

- container

  - props => connect(state + action)/HOC

- component
  - data => props + component/el

### 如何组装 epics 和 reducer

每个单独的 epics 都在 root-epics 中被引入，并 combine 成一个总体的 epcis。所以不同页面的流，是同时存在，并起作用的。
每个 reducer 也是通过 combineReducer 方法(redux-immutable)组装成一个总的 reducer 的。但 reducer 是异步加载的。state 也是异步加载的。

```js
// in  store.js
const middlewares = [epicMiddleware, routerMiddleware(history)]
const enhancers = [applyMiddleware(...middlewares)]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  createReducer(),
  fromJS(initialState),
  composeEnhancers(...enhancers)
)

// in reducer.js
export default function createReducer(asyncReducers) {
  return combineReducers({
    route: routeReducer,
    ...asyncReducers,
  })
}
```

### 请求实例

get请求：

```js
const getUserInfos = actions$ => actions$.ofType(GET_USER_INFOS).pipe(
  switchMap(({ username }) => request$(genFailedPaymentFilesUrl(), {
    userInfo: username,
    pageIndex: 1,
    pageSize: 49,
    scope: 'all',
    status: 0,
  }).pipe(
    map(R.path(['data'])),
    map(({ infos }) => ({
      type: SET_USER_INFOS,
      infos,
    })),
    catchError(catchError$),
    takeUntil(actions$.ofType(LOCATION_CHANGE))
  ))
)
```

post请求：

```js
const addRecord = actions$ => actions$.ofType(ADD_FAILED_FILE).pipe(
  throttleTime(1000),   // 视情况而定，要看此时action还是同样的数据
  throttle(() => requesting$(ADD_FAILED_FILE)),
  flatMap(({ infoId, userInfo, reason }) => {
    const data = new FormData()
    data.set('reason', reason)
    return request$
      .post(genFailedPayUrl(infoId), data, {
        'Content-Type': 'multipart/form-data',
      })
      .pipe(
        map(({ succeed }) => succeed
          ? {
            type: CONCAT_RECORDS,
            infoId,
            userInfo,
            reason,
          }
          : { type: '' }),
        catchError(catchError$),
        finalize(() => requesting$(ADD_FAILED_FILE).next())
      )
  })
)
```

concat多个action：

```js
const getProjects = actions$ => actions$.ofType(GET_PROJECTS).pipe(
  switchMap(
    ({ limit, offset, projectName }) => concat(of({ type: TOGGLE_LOADING }),
      request$('/api/projects', {
        limit, offset, projectName,
      }).pipe(
        map(({ data: { projectList, projectsCount } }) => (
          { type: SET_PROJECTS, projects: projectList, projectsCount })),
        takeUntil(actions$.ofType(LOCATION_CHANGE)),
      ),
      of({ type: TOGGLE_LOADING })),
  ),
  catchError(catchError$),
)
```

在pipe中发出多个action：

```js
const exportReportStatus = actions$ => actions$.ofType(EXPORT_REPORT_STATUS).pipe(
  switchMap(() => request$(genExprotReportStatus()).pipe(
    map(throwSeverApiError),
    map(R.path(['data'])),
      
    switchMap((data) => {
      const { tips } = data
      if (data.available) { return of({ type: OFF_EXPORT_REPORT_LOADING }) }
      return of({ type: ON_EXPORT_REPORT_LOADING }, { type: SET_TIPS, tips })
    }),
      
    catchError(catchError$),
    takeUntil(actions$.ofType(LOCATION_CHANGE))
  ))
)
```

forJoin多个流：

```js
const finishPay = actions$ => actions$.ofType(FINISH_PAY).pipe(
  switchMap(({ fileIds, tableData }) => concat(
    of({ type: ON_LOADING, tip: '正在完结支付' }),
    forkJoin(
      ...R.map(item => request$.getByConfig({
        url: genCompletPayUrl(item),
        method: 'PUT',
        timeout: 0,
      })
        .pipe(
          map(throwSeverApiError),
          catchError(catchError$),
        ))(fileIds)
    ).pipe(
      map(R.map(data => throwSeverApiError(data))), //  forkJoin返回的是数组
      map(R.path(['data'])),
      map(() => ({
        type: GET_LIST,
        ...tableData,
      })),
      catchError(catchError$),
      takeUntil(actions$.ofType(LOCATION_CHANGE)),
    ),
    of({ type: OFF_LOADING }),
  ))
)

const submitLoginLdap = (actions$, state$) => actions$.ofType(SUBMIT_LOGIN_LDAP).pipe(
  throttleTime(1000),
  switchMap(() => {
    const loginObj = {
      username: username_(state$.value),
      password: password_(state$.value),
    }
    return forkJoin(
      request$.post('/api/login', loginObj),
      request$.post('/auth-api/login', loginObj).pipe(catchError(catchError$))  // 单独抓每个流里的错误，不影响整体
    ).pipe(
      map(([v1, v2]) => ({ loginSucceed: R.path(['data', 'success'])(v1), tokenSucceed: R.path(['result'])(v2) })),
      flatMap(({ loginSucceed, tokenSucceed }) => (loginSucceed && tokenSucceed)
        ? from([{ type: SET_CURRENT_AUTH_STATUS, auth: true }, { type: GET_CURRENT }]) : EMPTY),
      catchError(catchError$)
    )
  })
)

```

# 参考文档

[官网](https://rxjs.dev/)

[learn-rxjs 相对详细的 api 示例](https://www.learnrxjs.io/)

[rxmarbles 非常重要的理解流程的方法](http://rxmarbles.com/)

《深入浅出 RxJS》
