import { Box, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useAppSelector } from '@/redux/app/hooks';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useRef, useState } from 'react';
import CalendarMonth from './calendar-month';
import CalendarWeek from './calendar-week';
import 'swiper/css';
import AddTodo, { AddTodoHandle } from '../add-todo';

interface CalendarSwiperProps {

}

export default function CalendarSwiper({ }: CalendarSwiperProps) {

  const [isCalendarExpand, setIsCalendarExpand] = useState(false)
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeMonthS = useAppSelector(state => state.todo.activeMonth)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const activeMonth = dayjs(activeMonthS, 'YYYY-MM-DD')
  const addButtonRef = useRef<AddTodoHandle>(null)

  function handleCalendarExpandButtonClick() {
    setIsCalendarExpand(old => !old)
  }

  function handleAddButtonClick(): void {
    setTimeout(() => {
      addButtonRef.current?.open()
    }, 200)
  }

  return (
    <>
      <Box sx={{ paddingY: '8px', bgcolor: '#fff', userSelect: 'none', borderRadius: '0px', borderBottom: '1px solid #d3d5d9' }}>
        <Box sx={{ paddingX: '16px', paddingBottom: '8px', paddingTop: '4px', color: 'rgba(19,21,25,.75)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box onClick={handleCalendarExpandButtonClick} sx={{ display: 'flex', alignItems: 'center' }}>
            {isCalendarExpand
              ? activeMonth.format('MMMM YYYY')
              : activeDay.format('MMMM YYYY')
            }
            <IconButton sx={{marginLeft: '4px'}}>
              {isCalendarExpand
                ? <KeyboardArrowUpRoundedIcon />
                : <KeyboardArrowDownRoundedIcon />
              }
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={handleAddButtonClick} sx={{ fontSize: '22px' }}>
              <AddRoundedIcon fontSize="inherit" />
            </IconButton>
          </Box>
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

      <AddTodo ref={addButtonRef} />
    </>
  )
}
