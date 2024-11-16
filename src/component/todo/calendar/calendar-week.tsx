import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar-swiper.module.css";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { getTodosBetweenDates } from "@/db/todo-service";
import { setActiveDay, setActiveMonth, setActiveWeek } from "@/redux/features/todo/todoSlice";

interface CalendarWeekProps {
}

export default function CalendarWeek({}: CalendarWeekProps) {

  const [todosCount, setTodosCount] = useState<Record<string, number>>({})
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeWeekS = useAppSelector(state => state.todo.activeWeek)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const activeWeek = dayjs(activeWeekS)
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function fetch() {
      const activeWeekTodos = await getTodosBetweenDates(activeWeek.format('YYYY-MM-DD'), activeWeek.add(7, 'day').format('YYYY-MM-DD'))
      const activeWeekTodosMap = activeWeekTodos.reduce((acc, todo) => {
        if (!acc.hasOwnProperty(todo.date)) {
          acc = { ...acc, [todo.date]: 0 }
        }
        acc[todo.date]++
        return acc
      }, {} as Record<string, number>)
      setTodosCount(activeWeekTodosMap)
    }
    fetch()
  }, [activeWeekS])

  function renderWeekDays(firstDay: Dayjs) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const current = firstDay.add(i, 'day')
          const currentS = current.format('YYYY-MM-DD')
          return (
            <Box key={i} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'calc(100% / 7)', paddingY: '2px' }}>
              <Box
                onClick={() => handleDayClick(current)}
                sx={{
                  '--size': '36px', width: 'var(--size)', height: 'var(--size)', minWidth: 'var(--size)', minHeight: 'var(--size)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', position: 'relative',
                  ...(current.isSame(dayjs(), 'date') && { color: (theme) => theme.palette.primary.main }),
                  ...(activeDay.isSame(current, 'date') && { bgcolor: (theme) => theme.palette.primary.main, color: '#fff' }),
                  ...(todosCount[currentS] && !activeDay.isSame(current, 'date') && { '&:after': { content: '""', position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', bgcolor: '#b3b5b9', borderRadius: '50%' } })
                }}>
                {current.date()}
              </Box>
            </Box>
          )
        })}
      </Box>
    )
  }

  function renderWeeks() {
    const previousWeek = activeWeek.add(-1, 'week')
    const nextWeek = activeWeek.add(1, 'week')
    return (
      <>
        <SwiperSlide className={styles['swiper-slide']}>
          {renderWeekDays(previousWeek)}
        </SwiperSlide>
        <SwiperSlide className={styles['swiper-slide']}>
          {renderWeekDays(activeWeek)}
        </SwiperSlide>
        <SwiperSlide className={styles['swiper-slide']}>
          {renderWeekDays(nextWeek)}
        </SwiperSlide>
      </>
    )
  }

  function handleSlideChange(swiper: SwiperType) {
    if (swiper.swipeDirection == 'prev') {
      const previousWeek = activeWeek.weekday(-7)
      const previousMonth = previousWeek.startOf('month')
      setTimeout(() => {
        dispatch(setActiveDay(previousWeek.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(previousWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(previousMonth.format('YYYY-MM-DD')))
      }, 300)
    }
    if (swiper.swipeDirection == 'next') {
      const nextWeek = activeWeek.weekday(7)
      const nextMonth = nextWeek.startOf('month')
      setTimeout(() => {
        dispatch(setActiveDay(nextWeek.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(nextWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(nextMonth.format('YYYY-MM-DD')))
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
        key={activeWeekS}
        initialSlide={1}
        slidesPerView={1}
        centeredSlides={true}
        className={styles.swiper}
        preventInteractionOnTransition
        onSlideChange={handleSlideChange}
      >
        {renderWeeks()}
      </Swiper>

    </>
  )
}
