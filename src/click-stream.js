const { fromEvent, interval, merge } = rxjs
const { map, tap, mapTo, scan } = rxjs.operators

const up$ = fromEvent(upbtn, 'click').pipe(mapTo(1))
const down$ = fromEvent(downbtn, 'click').pipe(mapTo(-1))

const count$ = merge(up$, down$).pipe(
  // tap(console.log),
  scan((acc, one) => acc + one)
)

count$.subscribe((num) => {
  console.log('observer 1: ', num)
  count.innerText = num
})

setTimeout(() => {
  count$.subscribe((v) => console.log('observer 2: ', v))
}, 2000)
