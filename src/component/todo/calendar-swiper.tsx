import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar-swiper.module.css";
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import "dayjs/locale/tr";
import 'swiper/css';

interface CalendarSwiperProps {
  activeDay: Dayjs
  onActiveDayChange: (activeDay: Dayjs) => void
}

dayjs.extend(weekday)

export default function CalendarSwiper({ activeDay, onActiveDayChange }: CalendarSwiperProps) {

  const [activeWeek, setActiveWeek] = useState<Dayjs>(dayjs().weekday(0))

  return (
    <>
      <Box sx={{ paddingY: '16px', bgcolor: '#fff' }}>
        <Box sx={{ paddingX: '16px', paddingY: '8px' }}>{activeWeek.format('MMMM YYYY')}</Box>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', bgcolor: '#fff' }}>
          {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((x, i) => (
            <Box key={`day_${i}`} sx={{ flexGrow: 1, textAlign: 'center', width: 'calc(100% / 7)' }}>{x}</Box>
          ))}
        </Box>
        <ActiveWeekRow key={activeWeek.toISOString()} activeWeek={activeWeek} activeDay={activeDay} onActiveWeekChange={setActiveWeek} onActiveDayChange={onActiveDayChange} />
      </Box>
    </>
  )
}

function ActiveWeekRow({ activeWeek, activeDay, onActiveWeekChange, onActiveDayChange }: { activeWeek: Dayjs, activeDay: Dayjs, onActiveWeekChange: (activeWeek: Dayjs) => void, onActiveDayChange: (activeDay: Dayjs) => void }) {

  function handleSlideChange(swiper: SwiperType) {
    if (swiper.swipeDirection == 'prev') {
      const previousWeek = activeWeek.weekday(-7)
      setTimeout(() => {
        onActiveWeekChange(previousWeek)
        onActiveDayChange(previousWeek)
      }, 300)
    }
    if (swiper.swipeDirection == 'next') {
      const nextWeek = activeWeek.weekday(7)
      setTimeout(() => {
        onActiveWeekChange(nextWeek)
        onActiveDayChange(nextWeek)
      }, 300)
    }
  }

  function handleDayClick(day: Dayjs) {
    onActiveDayChange(day)
  }

  function renderWeekDays(firstDay: Dayjs) {
    return (
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const current = firstDay.add(i, 'day')
          return(
          <Box key={i} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'calc(100% / 7)' }}>
            <Box onClick={() => handleDayClick(current)} sx={{ '--size': '36px', width: 'var(--size)', height: 'var(--size)', minWidth: 'var(--size)', minHeight: 'var(--size)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', ...(activeDay.isSame(current, 'date') && { bgcolor: (theme) => theme.palette.primary.main, color: '#fff' }) }}>{current.date()}</Box>
          </Box>
        )}
        )}
      </Box>
    )
  }

  return (
    <Swiper initialSlide={1}
      slidesPerView={1}
      centeredSlides={true}
      spaceBetween={0}
      navigation={false}
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
  )
}
