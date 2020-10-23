const { interval, Subject } = rxjs
const { map, take } = rxjs.operators

const tick$ = interval(1000).pipe(take(3))

const subject = new Subject()

tick$.subscribe(subject)

subject.subscribe((v) => console.log('observer1: ', v))

setTimeout(() => {
  subject.subscribe((v) => console.log('observer2: ', v))
}, 2000)
