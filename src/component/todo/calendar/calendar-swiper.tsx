import { Box, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar-swiper.module.css";
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/redux/app/hooks';
import { setActiveDay, setActiveWeek } from "@/redux/features/todo/todoSlice";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import 'swiper/css';
import { Fragment, useEffect, useState } from 'react';
import { getTodosBetweenDates } from '@/db/todo-service';

interface CalendarSwiperProps {

}

export default function CalendarSwiper({ }: CalendarSwiperProps) {

  const [isCalendarExpand, setIsCalendarExpand] = useState(false)
  const [activeWeekTodosCount, setActiveWeekTodosCount] = useState<Record<string, number>>({})
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeWeekS = useAppSelector(state => state.todo.activeWeek)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const activeWeek = dayjs(activeWeekS, 'YYYY-MM-DD')
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
      setActiveWeekTodosCount(activeWeekTodosMap)
    }
    fetch()
  }, [activeWeekS])

  function handleSlideChange(swiper: SwiperType) {
    if (isCalendarExpand) {
      if (swiper.swipeDirection == 'prev') {
        const previousMonth = activeDay.add(-1, 'month').startOf('month')
        const previousMonthFirstDayOfWeek = previousMonth.startOf('week')
        setTimeout(() => {
          dispatch(setActiveDay(previousMonth.format('YYYY-MM-DD')))
          dispatch(setActiveWeek(previousMonthFirstDayOfWeek.format('YYYY-MM-DD')))
        }, 300)
      }
      if (swiper.swipeDirection == 'next') {
        const nextMonth = activeDay.add(1, 'month').startOf('month')
        const nextMonthFirstDayOfWeek = nextMonth.startOf('week')
        setTimeout(() => {
          dispatch(setActiveDay(nextMonth.format('YYYY-MM-DD')))
          dispatch(setActiveWeek(nextMonthFirstDayOfWeek.format('YYYY-MM-DD')))
        }, 300)
      }
    } else {
      if (swiper.swipeDirection == 'prev') {
        const previousWeek = activeWeek.weekday(-7)
        setTimeout(() => {
          dispatch(setActiveDay(previousWeek.format('YYYY-MM-DD')))
          dispatch(setActiveWeek(previousWeek.format('YYYY-MM-DD')))
        }, 300)
      }
      if (swiper.swipeDirection == 'next') {
        const nextWeek = activeWeek.weekday(7)
        setTimeout(() => {
          dispatch(setActiveDay(nextWeek.format('YYYY-MM-DD')))
          dispatch(setActiveWeek(nextWeek.format('YYYY-MM-DD')))
        }, 300)
      }
    }
  }

  function handleDayClick(day: Dayjs) {
    dispatch(setActiveDay(day.format('YYYY-MM-DD')))
  }

  function renderWeekDays(firstDay: Dayjs, firstDayOfMonth?: Dayjs) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const current = firstDay.add(i, 'day')
          const currentS = current.format('YYYY-MM-DD')
          return (
            <Box key={i} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'calc(100% / 7)', paddingBottom: '12px' }}>
              <Box
                onClick={() => handleDayClick(current)}
                sx={{
                  '--size': '36px', width: 'var(--size)', height: 'var(--size)', minWidth: 'var(--size)', minHeight: 'var(--size)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', position: 'relative',
                  ...(isCalendarExpand && !current.isSame(firstDayOfMonth, 'month') && {color: 'rgba(0,0,0,.24)'}),
                  ...(current.isSame(dayjs(), 'date') && { color: (theme) => theme.palette.primary.main }),
                  ...(activeDay.isSame(current, 'date') && { bgcolor: (theme) => theme.palette.primary.main, color: '#fff' }),
                  ...(activeWeekTodosCount[currentS] && !activeDay.isSame(current, 'date') && { '&:after': { content: '""', position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', bgcolor: '#b3b5b9', borderRadius: '50%' } })
                }}>
                {current.date()}
              </Box>
            </Box>
          )
        })}
      </Box>
    )
  }

  function renderMonthDays(offset: number) {
    const firstDayOfMonth = activeDay.startOf('month')
    const lastDayOfMonth = activeDay.endOf('month')

    const temp = firstDayOfMonth.add(offset, 'month').clone()
    let startOfWeek = temp.startOf('week')
    const arr = [];
    do {
      arr.push(startOfWeek)
      startOfWeek = startOfWeek.add(1, 'week')
    } while (startOfWeek.isSame(temp, 'month'));
    
    return (
      <Box sx={{ width: '100%' }}>
        {arr.map((week) => {
          return (
            <Fragment key={week.format('YYYYMMDD')}>
              {renderWeekDays(week, temp)}
            </Fragment>
          )
        })}
      </Box>
    )
  }

  function handleCalendarExpandButtonClick() {
    setIsCalendarExpand(old => !old)
  }

  return (
    <>
      <Box sx={{ paddingY: '16px', bgcolor: '#fff', userSelect: 'none', borderRadius: '8px' }}>
        <Box sx={{ paddingX: '16px', paddingBottom: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {activeWeek.format('MMMM YYYY')}
          <IconButton onClick={handleCalendarExpandButtonClick}>
            {isCalendarExpand
              ? <KeyboardArrowDownRoundedIcon />
              : <KeyboardArrowUpRoundedIcon />
            }
          </IconButton>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', bgcolor: '#fff' }}>
          {dayjs.weekdaysShort(true).map((x, i) => (
            <Box key={`day_${i}`} sx={{ color: '#b3b5b9', fontSize: '14px', flexGrow: 1, textAlign: 'center', width: 'calc(100% / 7)' }}>{x}</Box>
          ))}
        </Box>
        <Swiper
          key={activeWeekS}
          initialSlide={1}
          slidesPerView={1}
          centeredSlides={true}
          className={styles.swiper}
          preventInteractionOnTransition
          onSlideChange={handleSlideChange}
        >
          <>
            {isCalendarExpand
              ? (
                <>
                  <SwiperSlide className={styles['swiper-slide']}>
                    {renderMonthDays(-1)}
                  </SwiperSlide>
                  <SwiperSlide className={styles['swiper-slide']}>
                    {renderMonthDays(0)}
                  </SwiperSlide>
                  <SwiperSlide className={styles['swiper-slide']}>
                    {renderMonthDays(1)}
                  </SwiperSlide>
                </>
              )
              : (
                <>
                  <SwiperSlide className={styles['swiper-slide']}>
                    {renderWeekDays(activeWeek.weekday(-7))}
                  </SwiperSlide>
                  <SwiperSlide className={styles['swiper-slide']}>
                    {renderWeekDays(activeWeek)}
                  </SwiperSlide>
                  <SwiperSlide className={styles['swiper-slide']}>
                    {renderWeekDays(activeWeek.weekday(7))}
                  </SwiperSlide>
                </>
              )
            }
          </>
        </Swiper>
      </Box>
    </>
  )
}
