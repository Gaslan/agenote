import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar-swiper.module.css";
import { Box, ButtonBase } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { getTodosBetweenDates } from "@/db/todo-service";
import { setActiveDay, setActiveMonth, setActiveWeek } from "@/redux/features/todo/todoSlice";

import { useDrag } from '@use-gesture/react'
import { useSpring } from "@react-spring/web";
import { setCalendarViewMode } from "@/redux/features/todo/todoCalendarSlice";
import CalendarWeekMonthSwiper from "./calendar-week-month-swiper";

interface CalendarMonthProps {
}

export default function CalendarMonth({ }: CalendarMonthProps) {

  const [todosCount, setTodosCount] = useState<Record<string, number>>({})
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeWeekS = useAppSelector(state => state.todo.activeWeek)
  const activeMonthS = useAppSelector(state => state.todo.activeMonth)
  const calendarViewMode = useAppSelector(state => state.todoCalendar.calendarViewMode)
  const activeDay = dayjs(activeDayS)
  const activeWeek = dayjs(activeWeekS)
  const activeMonth = dayjs(activeMonthS)
  const dispatch = useAppDispatch()

  const [style, api] = useSpring(() => ({ height: 40 })); // Başlangıç yüksekliği
  const initialHeight = useRef(100); // Dokunduğumuz andaki yüksekliği saklamak için

  useEffect(() => {
    async function fetch() {
      const activeWeekTodos = await getTodosBetweenDates(activeMonth.format('YYYY-MM-DD'), activeMonth.add(1, 'month').format('YYYY-MM-DD'))
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
  }, [activeMonthS])


  const bind = useDrag(({ movement: [, my], down, first, axis }) => {
    if (first) {
      initialHeight.current = style.height.get();
    }
    if (axis != 'y') {
      return
    }
    if (down) {
      // Kullanıcı sürüklerken, dokunma anındaki yüksekliği referans alarak güncelle
      const newHeight = Math.max(40, Math.min(240, initialHeight.current + my));
      api.start({ height: newHeight });
    } else {
      // Kullanıcı bıraktığında mesafeye göre yüksekliği ayarla
      if (my >= 20) {
        api.start({ height: 240 })
        dispatch(setCalendarViewMode('month'))
      } else if (my <= -20) {
        api.start({ height: 40 })
        dispatch(setCalendarViewMode('week'))
      } else {
        api.start({ height: initialHeight.current }); // Eski yüksekliğe geri dön
      }
    }
  });





  function renderWeekDays(firstDay: Dayjs, firstDayOfMonth: Dayjs) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '40px' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const current = firstDay.add(i, 'day')
          const currentS = current.format('YYYY-MM-DD')

          return (
            <Box key={i} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'calc(100% / 7)' }}>
              <ButtonBase
                onClick={() => handleDayClick(current)}
                sx={{
                  '--size': '36px', width: 'var(--size)', height: 'var(--size)', minWidth: 'var(--size)', minHeight: 'var(--size)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', position: 'relative',
                  ...(!current.isSame(firstDayOfMonth, 'month') && { color: 'rgba(0,0,0,.24)' }),
                  ...(current.isSame(dayjs(), 'date') && { color: (theme) => theme.palette.primary.main }),
                  ...(activeDay.isSame(current, 'date') && { bgcolor: (theme) => theme.palette.primary.main, color: '#fff' }),
                  ...(todosCount[currentS] && !activeDay.isSame(current, 'date') && { '&:after': { content: '""', position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', bgcolor: '#b3b5b9', borderRadius: '50%' } })
                }}>
                {current.date()}
              </ButtonBase>
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

    return (
      <Box sx={{ width: '100%' }}>
        {arr.map((week) => (
          <Fragment key={week.format('YYYYMMDD')}>
            {renderWeekDays(week, firstDayOfMonth)}
          </Fragment>
        ))}
      </Box>
    )
  }

  function renderMonths() {
    const previousMonth = activeMonth.add(-1, 'month')
    const nextMonth = activeMonth.add(1, 'month')
    return (
      <>
        <SwiperSlide key={previousMonth.format('YYYYMM')} className={styles['swiper-slide']}>
          {renderMonthDays(previousMonth)}
        </SwiperSlide>
        <SwiperSlide key={activeMonth.format('YYYYMM')} className={styles['swiper-slide']}>
          {renderMonthDays(activeMonth)}
        </SwiperSlide>
        <SwiperSlide key={nextMonth.format('YYYYMM')} className={styles['swiper-slide']}>
          {renderMonthDays(nextMonth)}
        </SwiperSlide>
      </>
    )
  }

  function handleSlideChange(swiper: SwiperType) {
    if (swiper.swipeDirection == 'prev') {
      const previousMonth = activeDay.add(-1, 'month').startOf('month')
      const previousMonthFirstDayOfWeek = previousMonth.startOf('week')
      setTimeout(() => {
        dispatch(setActiveDay(previousMonth.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(previousMonthFirstDayOfWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(previousMonth.format('YYYY-MM-DD')))
      }, 300)
    }
    if (swiper.swipeDirection == 'next') {
      const nextMonth = activeDay.add(1, 'month').startOf('month')
      const nextMonthFirstDayOfWeek = nextMonth.startOf('week')
      setTimeout(() => {
        dispatch(setActiveDay(nextMonth.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(nextMonthFirstDayOfWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(nextMonth.format('YYYY-MM-DD')))
      }, 300)
    }
  }


  function handleDayClick(day: Dayjs) {
    dispatch(setActiveDay(day.format('YYYY-MM-DD')))
    dispatch(setActiveWeek(day.startOf('week').format('YYYY-MM-DD')))
    dispatch(setActiveMonth(day.startOf('month').format('YYYY-MM-DD')))
  }

  const keyVal = calendarViewMode == 'week'
    ? activeWeek.format('YYYYMMDD')
    : calendarViewMode == 'month'
      ? activeMonth.format('YYYYMMDD')
      : activeDay.format('YYYYMMDD')

  return (
    <>
      {/* <animated.div
        {...bind()}
        style={{
          ...style,
          backgroundColor: "#fff",
          touchAction: "none", // Dokunma hareketleri için
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: 'hidden',
          position: 'relative'
        }}>
        <Swiper
          key={activeMonthS}
          initialSlide={1}
          slidesPerView={1}
          centeredSlides={true}
          className={styles.swiper}
          preventInteractionOnTransition
          onSlideChange={handleSlideChange}
        >
          {renderMonths()}
        </Swiper>
      </animated.div> */}

      <CalendarWeekMonthSwiper keyVal={keyVal} initialHeight={240} onSlideChange={handleSlideChange}>
        {renderMonths()}
      </CalendarWeekMonthSwiper>
    </>
  )
}
