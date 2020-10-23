const { Observable } = rxjs

const stream = (observer) => {
  let num = 1
  const timer = setInterval(() => {
    console.log({ num }, 'in source')
    if (num === 5) {
      // clearInterval(timer)
      observer.complete()
    }
    if (Math.random() > 0.1) {
      observer.next(num++)
    } else {
      observer.error('wrong')
      // clearInterval(timer)
    }
  }, 1000)
  return {
    unsubscribe: () => {
      console.log('unsubscribed!')
      clearInterval(timer)
    },
  }
}
const source$ = Observable.create(stream)

const nextHandler = (item) => console.log(item)
const completeHandler = () => console.log('complete')
const { error: errorHandler } = console

const theObserver = {
  next: nextHandler,
  complete: completeHandler,
  error: errorHandler,
}

source$.subscribe(theObserver)

// const subscription = source$.subscribe(
//   nextHandler,
//   errorHandler,
//   completeHandler
// )

setTimeout(() => {
  //subscription.unsubscribe()
  source$.subscribe(theObserver)
}, 2000)
