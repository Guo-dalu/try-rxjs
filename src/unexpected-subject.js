const { Subject, interval } = rxjs
const { take, mapTo } = rxjs.operators

const tick1$ = interval(1000).pipe(mapTo('a'), take(2))
const tick2$ = interval(1000).pipe(mapTo('b'), take(2))

const subject = new Subject()

tick1$.subscribe(subject)
tick2$.subscribe(subject)
subject.subscribe((value) => console.log('observer 1: ' + value))
subject.subscribe((value) => console.log('observer 2: ' + value))
