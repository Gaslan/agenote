import { Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useAppSelector } from '@/redux/app/hooks';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { useState } from 'react';
import CalendarMonth from './calendar-month';
import CalendarWeek from './calendar-week';
import 'swiper/css';

interface CalendarSwiperProps {

}

export default function CalendarSwiper({ }: CalendarSwiperProps) {

  const [isCalendarExpand, setIsCalendarExpand] = useState(false)
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeMonthS = useAppSelector(state => state.todo.activeMonth)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const activeMonth = dayjs(activeMonthS, 'YYYY-MM-DD')

  function handleCalendarExpandButtonClick() {
    setIsCalendarExpand(old => !old)
  }

  return (
    <>
      <Box sx={{ paddingY: '8px', bgcolor: '#fff', userSelect: 'none', borderRadius: '8px' }}>
        <Box sx={{ paddingX: '16px', paddingBottom: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isCalendarExpand
            ? activeMonth.format('MMMM YYYY')
            : activeDay.format('MMMM YYYY')
          }
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

        {isCalendarExpand
          ? <CalendarMonth />
          : <CalendarWeek />
        }
      </Box>
    </>
  )
}
