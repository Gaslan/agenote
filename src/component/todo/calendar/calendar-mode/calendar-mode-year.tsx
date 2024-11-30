import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import { setActiveDay, setActiveMonth, setActiveWeek } from "@/redux/features/todo/todoSlice"
import { Box } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { Fragment, useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from 'swiper/types';
import styles from "../calendar-swiper.module.css";
import { getTodosBetweenDates } from "@/db/todo-service"
import { Todo } from "@/db/db"

interface CalendarModeYearProps {

}

export default function CalendarModeYear({ }: CalendarModeYearProps) {

  const [todos, setTodos] = useState<Record<string, Todo[]>>({})
  const dispatch = useAppDispatch()
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeMonthS = useAppSelector(state => state.todo.activeMonth)
  const activeDay = dayjs(activeDayS)
  const activeMonth = dayjs(activeMonthS)

  // useEffect(() => {
  //   fetchTodos()
  // }, [activeMonthS])

  async function fetchTodos() {
    const todos = await getTodosBetweenDates(activeMonth.format('YYYY-MM-DD'), activeMonth.add(1, 'month').format('YYYY-MM-DD'))
    const todosMap = todos.reduce((acc, todo) => {
      if (!acc.hasOwnProperty(todo.date)) {
        acc = { ...acc, [todo.date]: [] }
      }
      acc[todo.date].push(todo)
      return acc
    }, {} as Record<string, Todo[]>)
    setTodos(todosMap)
  }

  function renderWeekDays(firstDay: Dayjs, firstDayOfMonth: Dayjs) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: 'calc(100% / 6)' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const current = firstDay.add(i, 'day')
          const currentS = current.format('YYYY-MM-DD')

          return (
            <Box
              key={i}
              onClick={() => handleDayClick(current)}
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: 'calc(100% / 7)', height: '100%', paddingY: '2px', userSelect: 'none' }}>
              <Box
                sx={{
                  '--size': '14px', width: 'var(--size)', height: 'var(--size)', minWidth: 'var(--size)', minHeight: 'var(--size)', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--size)', position: 'relative',
                  ...(!current.isSame(firstDayOfMonth, 'month') && { color: 'rgba(0,0,0,.24)' }),
                  ...(current.isSame(dayjs(), 'date') && { color: (theme) => theme.palette.primary.main }),
                  ...(activeDay.isSame(current, 'date') && current.isSame(firstDayOfMonth, 'month') && { bgcolor: (theme) => theme.palette.primary.main, color: '#fff' }),
                  // ...(todosCount[currentS] && !activeDay.isSame(current, 'date') && { '&:after': { content: '""', position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', bgcolor: '#b3b5b9', borderRadius: '50%' } })
                }}>
                {current.isSame(firstDayOfMonth, 'month') && current.date()}
              </Box>
              {/* {todos.hasOwnProperty(currentS) && todos[currentS].map(todo => (
                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                  <Box sx={{ padding: '0 1px', paddingBottom: '1px', maxWidth: '100%' }}>
                    <Box sx={{ fontSize: '10px', paddingX: '2px', bgcolor: '#f0f2f8', textAlign: 'left', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{todo.title}</Box>
                  </Box>
                </Box>
              ))} */}
            </Box>
          )
        })}
      </Box>
    )
  }

  function renderMonthDays(firstDayOfMonth: Dayjs) {
    let tempFirstDayOfWeek = firstDayOfMonth.startOf('week')
    const arr = []

    do {
      arr.push(tempFirstDayOfWeek)
      tempFirstDayOfWeek = tempFirstDayOfWeek.add(1, 'week')
    } while (tempFirstDayOfWeek.isSame(firstDayOfMonth, 'month'));

    if (arr.length == 5) {
      arr.push(undefined)
    }

    return (
      <Box sx={{ width: '100%', height: '100%' }}>
        {arr.map((week, i) => (
          <Fragment key={firstDayOfMonth.format('YYYYMM') + i}>
            {week 
              ? renderWeekDays(week, firstDayOfMonth) 
              : <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: 'calc(100% / 6)' }} />
            }
          </Fragment>
        ))}
      </Box>
    )
  }

  function renderYearMonths(activeYear: Dayjs) {
    let month = activeYear.startOf('year')
    const monthNames = dayjs.months()
    const weekDays = dayjs.weekdaysMin(true).map(day => day.slice(0, 1))
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', paddingX: '12px', height: '100%', maxHeight: '100%' }}>
        {[...Array(12)].map((_, i) => (
          <Box key={month.format('YYYY') + i} sx={{display: 'flex', flexDirection: 'column', paddingX: '4px'}}>
            <Box sx={{fontSize: '14px', padding: '4px 2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>{monthNames[i]}</Box>
            <Box sx={{ width: '100%', paddingBottom: '1px', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', bgcolor: '#fff', userSelect: 'none' }}>
              {weekDays.map((x, i) => (
                <Box key={`day_${i}`} sx={{ color: '#b3b5b9', fontSize: '10px', flexGrow: 1, textAlign: 'center', width: 'calc(100% / 7)' }}>{x}</Box>
              ))}
            </Box>
            {renderMonthDays(month.add(i, 'month'))}
          </Box>
        ))}
      </Box>
    )
  }

  function renderMonths() {
    const activeYear = activeMonth.startOf('year')
    const previousYear = activeMonth.add(-1, 'year')
    const nextYear = activeMonth.add(1, 'year')
    return (
      <>
        <SwiperSlide className={styles['swiper-slide']}>
          {renderYearMonths(previousYear)}
        </SwiperSlide>
        <SwiperSlide className={styles['swiper-slide']}>
          {renderYearMonths(activeYear)}
        </SwiperSlide>
        <SwiperSlide className={styles['swiper-slide']}>
          {renderYearMonths(nextYear)}
        </SwiperSlide>
      </>
    )
  }

  function handleSlideChange(swiper: SwiperType) {
    if (swiper.swipeDirection == 'prev') {
      const previousYear = activeDay.add(-1, 'year').startOf('year')
      const previousYearFirstDayOfWeek = previousYear.startOf('week')
      setTimeout(() => {
        dispatch(setActiveDay(previousYear.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(previousYearFirstDayOfWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(previousYear.format('YYYY-MM-DD')))
      }, 300)
    }
    if (swiper.swipeDirection == 'next') {
      const nextYear = activeDay.add(1, 'year').startOf('year')
      const nextYearFirstDayOfWeek = nextYear.startOf('week')
      setTimeout(() => {
        dispatch(setActiveDay(nextYear.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(nextYearFirstDayOfWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(nextYear.format('YYYY-MM-DD')))
      }, 300)
    }
  }

  function handleDayClick(day: Dayjs) {
    dispatch(setActiveDay(day.format('YYYY-MM-DD')))
    dispatch(setActiveWeek(day.startOf('week').format('YYYY-MM-DD')))
    dispatch(setActiveMonth(day.startOf('month').format('YYYY-MM-DD')))
  }

  return (
    <>
      <Swiper
        key={activeMonthS}
        initialSlide={1}
        slidesPerView={1}
        centeredSlides={true}
        className={styles.swiper}
        preventInteractionOnTransition
        onSlideChange={handleSlideChange}
        style={{ flexGrow: 1 }}
      >
        {renderMonths()}
      </Swiper>
    </>
  )
}
