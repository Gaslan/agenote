import { Box, Collapse, IconButton } from '@mui/material';
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
import CalendarModePanel from './calendar-mode-panel';

interface CalendarSwiperProps {

}

export default function CalendarSwiper({ }: CalendarSwiperProps) {

  const [isCalendarExpand, setIsCalendarExpand] = useState(false)
  const [calendarModePanelOpen, setCalendarModePanelOpen] = useState(false)
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
  
  function handleCalendarModeButtonClick(): void {
    setTimeout(() => {
      setCalendarModePanelOpen(old => !old)
    }, 10)
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
            <IconButton sx={{ marginLeft: '4px' }}>
              {isCalendarExpand
                ? <KeyboardArrowUpRoundedIcon />
                : <KeyboardArrowDownRoundedIcon />
              }
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={handleCalendarModeButtonClick} sx={{ fontSize: '22px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{fontSize: '22px', width: '1em', height: '1em'}}>
                <path fill="currentColor" d="M17 14.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5zm-1 0v-9A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5m-2-8a.5.5 0 0 1-.41.492L13.5 7h-7a.5.5 0 0 1-.09-.992L6.5 6h7a.5.5 0 0 1 .5.5m0 3.5a.5.5 0 0 1-.41.492l-.09.008h-7a.5.5 0 0 1-.09-.992L6.5 9.5h7a.5.5 0 0 1 .5.5m0 3.5a.5.5 0 0 1-.41.492L13.5 14h-7a.5.5 0 0 1-.09-.992L6.5 13h7a.5.5 0 0 1 .5.5" />
              </svg>
            </IconButton>
            <IconButton onClick={handleAddButtonClick} sx={{ fontSize: '22px' }}>
              <AddRoundedIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
        <Collapse in={calendarModePanelOpen}>
          <CalendarModePanel />
        </Collapse>
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
