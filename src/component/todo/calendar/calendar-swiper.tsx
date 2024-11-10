import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar-swiper.module.css";
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/redux/app/hooks';
import { setActiveDay, setActiveWeek } from "@/redux/features/todo/todoSlice";
// import "dayjs/locale/tr";
import 'swiper/css';

interface CalendarSwiperProps {

}

export default function CalendarSwiper({ }: CalendarSwiperProps) {
  console.log('dayjs', dayjs.locale())

  const dispatch = useAppDispatch()
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeWeekS = useAppSelector(state => state.todo.activeWeek)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const activeWeek = dayjs(activeWeekS, 'YYYY-MM-DD')

  function handleSlideChange(swiper: SwiperType) {
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

  function handleDayClick(day: Dayjs) {
    dispatch(setActiveDay(day.format('YYYY-MM-DD')))
  }

  function renderWeekDays(firstDay: Dayjs) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const current = firstDay.add(i, 'day')
          return (
            <Box key={i} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'calc(100% / 7)' }}>
              <Box onClick={() => handleDayClick(current)} sx={{ '--size': '36px', width: 'var(--size)', height: 'var(--size)', minWidth: 'var(--size)', minHeight: 'var(--size)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', ...(activeDay.isSame(current, 'date') && { bgcolor: (theme) => theme.palette.primary.main, color: '#fff' }) }}>{current.date()}</Box>
            </Box>
          )
        }
        )}
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ paddingY: '16px', bgcolor: '#fff', userSelect: 'none', borderRadius: '8px', position: 'sticky', top: '50px' }}>
        <Box sx={{ paddingX: '16px', paddingBottom: '8px' }}>{activeWeek.format('MMMM YYYY')}</Box>
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
        </Swiper>
      </Box>
    </>
  )
}
