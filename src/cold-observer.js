const { interval } = rxjs
const { take } = rxjs.operators

const tick$ = interval(1000).pipe(take(3))

tick$.subscribe((v) => console.log('observer1: ', v))

setTimeout(() => {
  tick$.subscribe((v) => console.log('observer2: ', v))
}, 6000)
