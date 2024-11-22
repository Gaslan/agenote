import { Box, Collapse, IconButton, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader } from "@mui/material";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { Todo, TodoList } from "@/db/db";
import { ReactNode, useState } from "react";
import { PriorityData, PriorityValue } from "./todo-priority";
import { Dayjs } from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar/calendar-swiper.module.css";
import { useAppDispatch } from "@/redux/app/hooks";
import { setActiveDay, setActiveMonth, setActiveWeek } from "@/redux/features/todo/todoSlice";

interface TodoListDayProps {
  todos: Todo[]
  todoLists: TodoList[]
  day: Dayjs
  swipeable?: boolean
  onItemClick: (todo: Todo) => void
  onItemComplete: (todo: Todo) => void
}

export default function TodoListDay({ todos, todoLists, day, swipeable = false, onItemClick, onItemComplete }: TodoListDayProps) {

  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useAppDispatch()

  function handleTodoItemClick(todo: Todo) {
    onItemClick(todo)
  }

  function handleCompleteTodo(todo: Todo) {
    onItemComplete(todo)
  }

  function handleCollapseButtonClick() {
    setCollapsed(old => !old)
  }



  function handleSlideChange(swiper: SwiperType) {
    if (swiper.swipeDirection == 'prev') {
      const previousDay = day.add(-1, 'day')
      const previousWeek = previousDay.startOf('week')
      const previousMonth = previousDay.startOf('month')
      setTimeout(() => {
        dispatch(setActiveDay(previousDay.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(previousWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(previousMonth.format('YYYY-MM-DD')))
      }, 300)
    }
    if (swiper.swipeDirection == 'next') {
      const nextDay = day.add(1, 'day')
      const nextWeek = nextDay.startOf('week')
      const nextMonth = nextDay.startOf('month')
      setTimeout(() => {
        dispatch(setActiveDay(nextDay.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(nextWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(nextMonth.format('YYYY-MM-DD')))
      }, 300)
    }
  }

  return (
    <>
      <ListSubheader onClick={handleCollapseButtonClick} sx={{ background: 'linear-gradient(#ffffff, #f0f2f7)', bgcolor: '#fff', borderBottom: '1px solid #d3d5d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}>
        <Box sx={{ fontWeight: 700 }}>{day.format('MMMM D')}</Box>
        {collapsed ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
      </ListSubheader>
      <Swiper
        key={day.format('YYYYMMDD')}
        initialSlide={1}
        slidesPerView={1}
        centeredSlides={true}
        className={styles.swiper}
        preventInteractionOnTransition
        onSlideChange={handleSlideChange}
        style={{ height: '100%' }}
      >
        {todos?.length > 0 && (

          <Collapse in={!collapsed} sx={{ '&.MuiCollapse-root': { flexGrow: 1 } }}>

            <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}></SwiperSlide>

            <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ paddingY: '2px', width: '100%' }}>
                {todos && todos.map(todo => {
                  const Priority = PriorityData[todo.priority as PriorityValue]
                  return (
                    <ListItem key={todo.id}
                      disablePadding
                      onClick={() => handleTodoItemClick(todo)}
                      sx={{ borderBottom: '0px solid #d3d5d9', padding: '2px 4px' }}>
                      <ListItemButton sx={{ paddingLeft: '48px', paddingY: '12px', borderRadius: '4px', bgcolor: '#fff', boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 3px rgba(0, 0, 0, .025), 0 1px 2px rgba(0, 0, 0, .05)' }}>
                        <Box sx={{ width: '100%' }}>
                          <ListItemText sx={{ ...(todo.completed && { color: '#939599', textDecoration: 'line-through', textDecorationColor: '#939599' }) }}>{todo.title}</ListItemText>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}></Box>
                            {!!todo.listId && <Box sx={{ fontSize: '12px' }}>{todoLists.find(list => list.id == todo.listId)?.name}</Box>}
                          </Box>
                        </Box>
                      </ListItemButton>
                      <ListItemSecondaryAction sx={{ right: 'auto', left: '18px', top: '8px', transform: "none", paddingTop: '2px' }}>
                        <IconButton
                          edge="start"
                          aria-label="complete"
                          onClick={() => handleCompleteTodo(todo)}
                        >
                          {todo.completed && (
                            <Box component={'svg'} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" sx={{ color: (theme) => theme.palette.primary.main }}>
                              <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                            </Box>
                          )}
                          {!todo.completed && <RadioButtonUncheckedRoundedIcon />}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </Box>
            </SwiperSlide>

            <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}></SwiperSlide>
          </Collapse>
        )}
        {todos.length == 0 && (
          <Collapse in={!collapsed}>

            <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}></SwiperSlide>
            <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '3rem', color: '#e3e5e9' }}>
                {/* <Icon icon={'mdi:inbox-outline'} width={'4rem'} height={'4rem'} /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="6rem" height="6rem" viewBox="0 0 48 48">
                  <path fill="#45413c" d="M2.42 42.98a21.58 2.02 0 1 0 43.16 0a21.58 2.02 0 1 0-43.16 0" opacity="0.15" />
                  <path fill="#ffe500" d="M2.25 7.93h43.5v17.53H2.25Z" />
                  <path fill="#fff48c" d="M44.4 7.93H3.6a1.34 1.34 0 0 0-1.35 1.35v3.46a1.34 1.34 0 0 1 1.35-1.35h40.8a1.34 1.34 0 0 1 1.35 1.35V9.28a1.34 1.34 0 0 0-1.35-1.35" />
                  <path fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.93h43.5v17.53H2.25Z" />
                  <path fill="#daedf7" d="M6.72 25.47h5.4v16.18A1.35 1.35 0 0 1 10.76 43H8.07a1.35 1.35 0 0 1-1.35-1.35zm29.17 0h5.4v16.18A1.35 1.35 0 0 1 39.93 43h-2.7a1.35 1.35 0 0 1-1.35-1.35V25.47z" />
                  <path fill="#c0dceb" d="M6.72 25.47h5.4v3.26h-5.4zm29.17 0h5.4v3.26h-5.4z" />
                  <path fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" d="M6.72 25.47h5.4v16.18A1.35 1.35 0 0 1 10.76 43H8.07a1.35 1.35 0 0 1-1.35-1.35zm29.17 0h5.4v16.18A1.35 1.35 0 0 1 39.93 43h-2.7a1.35 1.35 0 0 1-1.35-1.35V25.47z" />
                  <path fill="#656769" d="M8.84 7.93L3.2 25.41a1.8 1.8 0 0 0 .4.06h5.57l5.65-17.54Zm18.12 0h-5.98l-5.66 17.53h5.99zm12.14 0h-5.98l-5.66 17.53h5.99zm6.08.25L39.6 25.47h4.8a1.35 1.35 0 0 0 1.35-1.35V9.28a1.34 1.34 0 0 0-.57-1.1" />
                  <path fill="#87898c" d="m13.71 11.38l1.11-3.45H8.84l-1.12 3.45zm12.14 0l1.11-3.45h-5.98l-1.12 3.45zm12.14 0l1.11-3.45h-5.98L32 11.38zm7.19-3.2l-1 3.2h.26a1.35 1.35 0 0 1 1.35 1.35V9.28a1.34 1.34 0 0 0-.61-1.1" />
                  <path fill="none" stroke="#45413c" strokeLinecap="round" strokeLinejoin="round" d="M8.84 7.93L3.2 25.41a1.8 1.8 0 0 0 .4.06h5.57l5.65-17.54Zm18.12 0h-5.98l-5.66 17.53h5.99zm12.14 0h-5.98l-5.66 17.53h5.99zm6.08.25L39.6 25.47h4.8a1.35 1.35 0 0 0 1.35-1.35V9.28a1.34 1.34 0 0 0-.57-1.1" />
                </svg>
                <Box sx={{ marginTop: '20px', color: '#606269' }}>No tasks for the day.</Box>
              </Box>
            </SwiperSlide>
            <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}></SwiperSlide>
          
          </Collapse>
        )}
      </Swiper>

    </>
  )
}

function SwipeComp({swipeable, children}: {swipeable: boolean, children: ReactNode}) {
  if (swipeable) {
    
  return (
    
    {children}
  )
  }

  return (
    {children}
  )
}
