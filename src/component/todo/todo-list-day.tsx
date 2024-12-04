import { Box, Collapse, IconButton, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader } from "@mui/material";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { Todo, TodoList } from "@/db/db";
import { Fragment, memo, ReactNode, useEffect, useState } from "react";
import { PriorityData, PriorityValue } from "./todo-priority";
import { Dayjs } from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper/types';
import styles from "./calendar/calendar-swiper.module.css";
import { useAppDispatch } from "@/redux/app/hooks";
import { setActiveDay, setActiveMonth, setActiveWeek } from "@/redux/features/todo/todoSlice";
import { getTodosByDate } from "@/db/todo-service";

interface TodoListDayProps {
  todos: Todo[]
  todoLists: TodoList[]
  day: Dayjs
  swipeable?: boolean
  loading: boolean
  onItemClick: (todo: Todo) => void
  onItemComplete: (todo: Todo) => void
}

export default function TodoListDay({ todoLists, day, swipeable = false, onItemClick, onItemComplete }: TodoListDayProps) {

  const [todosList, setTodosList] = useState<Record<string, Todo[]>>({})
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function fetch() {
      const yesterday = await getTodosByDate(day.add(-1, 'day').format('YYYY-MM-DD'))
      const today = await getTodosByDate(day.format('YYYY-MM-DD'))
      const tomorrow = await getTodosByDate(day.add(1, 'day').format('YYYY-MM-DD'))
      setTodosList({
        [day.add(-1, 'day').format('YYYY-MM-DD')]: yesterday,
        [day.format('YYYY-MM-DD')]: today,
        [day.add(1, 'day').format('YYYY-MM-DD')]: tomorrow
      })
    }
    fetch()
  }, [day])

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
      }, 10)
    }
    if (swiper.swipeDirection == 'next') {
      const nextDay = day.add(1, 'day')
      const nextWeek = nextDay.startOf('week')
      const nextMonth = nextDay.startOf('month')
      setTimeout(() => {
        dispatch(setActiveDay(nextDay.format('YYYY-MM-DD')))
        dispatch(setActiveWeek(nextWeek.format('YYYY-MM-DD')))
        dispatch(setActiveMonth(nextMonth.format('YYYY-MM-DD')))
      }, 10)
    }
  }

  return (
    <>
      <ListSubheader onClick={handleCollapseButtonClick} sx={{ background: 'linear-gradient(#ffffff, #f0f2f7)', bgcolor: '#fff', borderBottom: '1px solid #d3d5d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}>
        <Box sx={{ fontWeight: 700 }}>{day.format('MMMM D')}</Box>
        {collapsed ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
      </ListSubheader>

      <Collapse in={!collapsed} sx={{ '&.MuiCollapse-root': { flexGrow: 1 } }}>
        <Swiper
          key={Object.keys(todosList)[0]}
          initialSlide={1}
          slidesPerView={1}
          centeredSlides={true}
          className={styles.swiper}
          preventInteractionOnTransition
          onSlideChange={handleSlideChange}
          style={{ height: '100%' }}
        >
          <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
            <SwipeComp loading={false} todoLists={todoLists} todos={Object.values(todosList)[0]} day={Object.keys(todosList)[0]} onTodoItemClick={handleTodoItemClick} onCompleteTodo={handleCompleteTodo} />
          </SwiperSlide>
          <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
            <SwipeComp loading={false} todoLists={todoLists} todos={Object.values(todosList)[1]} day={Object.keys(todosList)[1]} onTodoItemClick={handleTodoItemClick} onCompleteTodo={handleCompleteTodo} />
          </SwiperSlide>
          <SwiperSlide style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
            <SwipeComp loading={false} todoLists={todoLists} todos={Object.values(todosList)[2]} day={Object.keys(todosList)[2]} onTodoItemClick={handleTodoItemClick} onCompleteTodo={handleCompleteTodo} />
          </SwiperSlide>

        </Swiper>
      </Collapse>

    </>
  )
}

function SwipeComp({ todos, loading, todoLists, onTodoItemClick, onCompleteTodo }: { todos: Todo[], loading: boolean, todoLists: TodoList[], day: string, onTodoItemClick: (todo: Todo) => void, onCompleteTodo: (todo: Todo) => void }) {

  if (!todos) {
    return null
  }

  if (todos?.length > 0 && !loading) {
    return (
      <Box sx={{ paddingY: '2px', width: '100%' }}>
        {todos && todos.map(todo => {
          const Priority = PriorityData[todo.priority as PriorityValue]
          return (
            <ListItem key={todo.id}
              disablePadding
              onClick={() => onTodoItemClick(todo)}
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
                  onClick={() => onCompleteTodo(todo)}
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
    )
  }

  if (todos.length == 0 && !loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '3rem', color: '#e3e5e9' }}>
        {/* <Icon icon={'mdi:inbox-outline'} width={'4rem'} height={'4rem'} /> */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{width: '6rem', height: '6rem', color: '#1976d2'}}>
          <path fill="currentColor" d="M21 15.998v-6c0-2.828 0-4.242-.879-5.121C19.353 4.109 18.175 4.012 16 4H8c-2.175.012-3.353.109-4.121.877C3 5.756 3 7.17 3 9.998v6c0 2.829 0 4.243.879 5.122c.878.878 2.293.878 5.121.878h6c2.828 0 4.243 0 5.121-.878c.879-.88.879-2.293.879-5.122" opacity={0.5}></path>
          <path fill="currentColor" d="M8 3.5A1.5 1.5 0 0 1 9.5 2h5A1.5 1.5 0 0 1 16 3.5v1A1.5 1.5 0 0 1 14.5 6h-5A1.5 1.5 0 0 1 8 4.5z"></path>
          <path fill="currentColor" fillRule="evenodd" d="M15.548 10.488a.75.75 0 0 1-.036 1.06l-4.286 4a.75.75 0 0 1-1.024 0l-1.714-1.6a.75.75 0 1 1 1.024-1.096l1.202 1.122l3.774-3.522a.75.75 0 0 1 1.06.036" clipRule="evenodd"></path>
        </svg>
        <Box sx={{ marginTop: '20px', color: '#606269' }}>No tasks for the day.</Box>
      </Box>
    )
  }
}
