const { interval } = rxjs
const { take, map, concatAll, mergeAll, switchAll } = rxjs.operators

const timestamp = +new Date()

const ho$ = interval(1000).pipe(
  take(2),
  map((x) =>
    interval(1500).pipe(
      map((y) => x + ':' + y),
      take(2)
    )
  ),
  //concatAll()
  //mergeAll()
  switchAll()
)

ho$.subscribe((x) => console.log(x, +new Date() - timestamp))
