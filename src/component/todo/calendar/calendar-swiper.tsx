import { Box } from '@mui/material';
import dayjs from 'dayjs';
import CalendarMonth from './calendar-month';
import 'swiper/css';

interface CalendarSwiperProps {
}

export default function CalendarSwiper({ }: CalendarSwiperProps) {

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', bgcolor: '#fff' }}>
        {dayjs.weekdaysShort(true).map((x, i) => (
          <Box key={`day_${i}`} sx={{ color: '#b3b5b9', fontSize: '14px', flexGrow: 1, textAlign: 'center', width: 'calc(100% / 7)' }}>{x}</Box>
        ))}
      </Box>
      <CalendarMonth />
    </>
  )
}
