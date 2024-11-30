'use client'
import { Todo, TodoList } from "@/db/db"
import { changeCompleted } from "@/db/todo-service"
import { Box, Collapse, IconButton, List } from "@mui/material"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"
import CalendarSwiper from "./calendar/calendar-swiper"
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { fetchActiveDayTodos, fetchTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import TodoDetail, { TodoDetailHandle } from "./detail/todo-detail"
import { getTodoLists } from "@/db/todo-list-service"
import TodoListDay from "./todo-list-day"
import CalendarModePanel from "./calendar/calendar-mode-panel"
import AddTodo, { AddTodoHandle } from "./add-todo"
import CalendarModeList from "./calendar/calendar-mode/calendar-mode-list"
import CalendarModeMonth from "./calendar/calendar-mode/calendar-mode-month"
import CalendarModeYear from "./calendar/calendar-mode/calendar-mode-year"

interface TodoListProps {

}

export default function TodoLists({ }: TodoListProps) {

  const [loading, setLoading] = useState(true)
  const [isCalendarExpand, setIsCalendarExpand] = useState(false)
  const [calendarModePanelOpen, setCalendarModePanelOpen] = useState(false)
  const addButtonRef = useRef<AddTodoHandle>(null)
  const dispatch = useAppDispatch()
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeMonthS = useAppSelector(state => state.todo.activeMonth)
  const calendarMode = useAppSelector(state => state.todoCalendar.calendarMode)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const activeMonth = dayjs(activeMonthS, 'YYYY-MM-DD')

  useEffect(() => {
    async function fetchActiveDayTodos() {
      setLoading(true)
      await dispatch(fetchTodos(activeDayS))
      setLoading(false)
    }
    fetchActiveDayTodos()
  }, [activeDayS])


  function handleCalendarExpandButtonClick() {
    if (calendarMode != 'list') {
      return
    }
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
      <Box sx={{ paddingBottom: '60px', paddingX: '0px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ paddingTop: '8px', bgcolor: '#fff', userSelect: 'none', borderRadius: 0 }}>
          <Box sx={{ paddingX: '16px', paddingBottom: '8px', paddingTop: '4px', color: 'rgba(19,21,25,.75)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box onClick={handleCalendarExpandButtonClick} sx={{ display: 'flex', alignItems: 'center' }}>
              {isCalendarExpand
                ? activeMonth.format('MMMM YYYY')
                : activeDay.format('MMMM YYYY')
              }
              {calendarMode == 'list' && <IconButton sx={{ marginLeft: '4px' }}>
                {isCalendarExpand
                  ? <KeyboardArrowUpRoundedIcon />
                  : <KeyboardArrowDownRoundedIcon />
                }
              </IconButton>}
            </Box>
            <Box>
              <IconButton onClick={handleCalendarModeButtonClick} sx={{ fontSize: '22px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ fontSize: '22px', width: '1em', height: '1em' }}>
                  <path fill="currentColor" d="M17 14.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5zm-1 0v-9A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5m-2-8a.5.5 0 0 1-.41.492L13.5 7h-7a.5.5 0 0 1-.09-.992L6.5 6h7a.5.5 0 0 1 .5.5m0 3.5a.5.5 0 0 1-.41.492l-.09.008h-7a.5.5 0 0 1-.09-.992L6.5 9.5h7a.5.5 0 0 1 .5.5m0 3.5a.5.5 0 0 1-.41.492L13.5 14h-7a.5.5 0 0 1-.09-.992L6.5 13h7a.5.5 0 0 1 .5.5" />
                </svg>
              </IconButton>
              <IconButton onClick={handleAddButtonClick} sx={{ fontSize: '22px' }}>
                <AddRoundedIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
          <Collapse in={calendarModePanelOpen}>
            <CalendarModePanel onSelect={() => setTimeout(() => setCalendarModePanelOpen(false), 100)} />
          </Collapse>
        </Box>

        {calendarMode == 'list' && (
          <CalendarModeList isCalendarExpand={isCalendarExpand} />
        )}

        {calendarMode == 'month' && (
          <CalendarModeMonth />
        )}

        {calendarMode == 'year' && (
          <CalendarModeYear />
        )}

      </Box>
      <AddTodo ref={addButtonRef} />
    </>
  )
}
