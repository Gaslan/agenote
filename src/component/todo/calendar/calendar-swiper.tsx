import { Box } from '@mui/material';
import dayjs from 'dayjs';
import CalendarMonth from './calendar-month';
import CalendarWeek from './calendar-week';
import 'swiper/css';
import { useAppSelector } from '@/redux/app/hooks';

interface CalendarSwiperProps {
}

export default function CalendarSwiper({ }: CalendarSwiperProps) {

  const calendarViewMode = useAppSelector(state => state.todoCalendar.calendarViewMode)

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', bgcolor: '#fff' }}>
        {dayjs.weekdaysShort(true).map((x, i) => (
          <Box key={`day_${i}`} sx={{ color: '#b3b5b9', fontSize: '14px', flexGrow: 1, textAlign: 'center', width: 'calc(100% / 7)' }}>{x}</Box>
        ))}
      </Box>
      {calendarViewMode == 'month' && <CalendarMonth />}
      {calendarViewMode == 'week' && <CalendarWeek />}
    </>
  )
}
