import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, SwipeableDrawer, Typography } from "@mui/material";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from "react";
import EventIcon from '@mui/icons-material/Event';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import FlagIcon from '@mui/icons-material/Flag';
import dayjs, { Dayjs } from "dayjs";
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import TodoDetailOptions from "./todo-detail-options";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { Todo, TodoList } from "@/db/db";
import { changeCompleted, updateDuedate, updateListId, updatePriority } from "@/db/todo-service";
import { fetchActiveDayTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice";
import TodoPrioritySelector from "../todo-priority-selector";
import { PriorityData } from "../todo-priority";
import AddTodoCalendar, { AddTodoCalendarHandle } from "../add-todo-calendar";
import ListsTreeView from "../lists/lists-tree-view";
import { getTodoLists } from "@/db/todo-list-service";
import { grey } from "@mui/material/colors";

interface TodoDetailProps {

}

export interface TodoDetailHandle {
  open: () => void
  toggle: () => void
}

const TodoDetail: ForwardRefRenderFunction<TodoDetailHandle, TodoDetailProps> = function TodoDetail({ }: TodoDetailProps, ref) {

  const [open, setOpen] = useState(false)
  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const todoDetail = useAppSelector(state => state.todo.selectedTodoDetail)
  const todoDetailOptionsRef = useRef<SwipeableDrawerBaseHandle>(null)
  const todoPrioritySelectorRef = useRef<SwipeableDrawerBaseHandle>(null)
  const todoListSelectorRef = useRef<SwipeableDrawerBaseHandle>(null)
  const dueDateCalendarDrawerRef = useRef<AddTodoCalendarHandle>(null)
  const dispatch = useAppDispatch()


  useEffect(() => {
    fetchLists()
  }, [])

  async function fetchLists() {
    const lists = await getTodoLists()
    setTodoLists(lists)
  }

  useImperativeHandle(ref, () => {
    return {
      toggle() {
        setOpen(old => !old)
      },
      open() {
        setOpen(true)
      },
    }
  })

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  if (!todoDetail) {
    return null
  }

  function handleSelectedTodoDelete(): void {
    todoDetailOptionsRef.current?.close()
    setOpen(false)
  }

  function handleCompleteTodo(todo: Todo) {
    return async function () {
      await changeCompleted(todo.id, !todo.completed)
      await dispatch(fetchActiveDayTodos())
      await dispatch(fetchTodosOverdue())
      dispatch(setSelectedTodoDetail({ ...todo, completed: !todo.completed }))
    }
  }

  function handlePriorityClick() {
    setTimeout(() => {
      todoPrioritySelectorRef.current?.open()
    }, 200)
  }

  function handleDuedateClick() {
    setTimeout(() => {
      dueDateCalendarDrawerRef.current?.open()
    }, 200)
  }

  function handleListSelectClick() {
    setTimeout(() => {
      todoListSelectorRef.current?.open()
    }, 200)
  }

  async function handlePriorityValueChange(todo: Todo, value: number) {
    await updatePriority(todo.id, value)
    dispatch(setSelectedTodoDetail({ ...todoDetail, priority: value }))
    dispatch(fetchActiveDayTodos())
    dispatch(fetchTodosOverdue())
    todoPrioritySelectorRef.current?.close()
  }

  async function handleDateChange(todo: Todo, value: Dayjs | undefined) {
    if (!value) {
      return
    }
    updateDuedate(todo.id, value.format('YYYY-MM-DD'))
    dispatch(setSelectedTodoDetail({ ...todoDetail, date: value.format('YYYY-MM-DD') }))
    dispatch(fetchActiveDayTodos())
    dispatch(fetchTodosOverdue())
  }

  async function handleListValueChange(todo: Todo, value: number) {
    await updateListId(todo.id, value)
    dispatch(setSelectedTodoDetail({ ...todoDetail, listId: value }))
    dispatch(fetchActiveDayTodos())
    dispatch(fetchTodosOverdue())
    todoListSelectorRef.current?.close()
  }

  const priority = PriorityData[todoDetail.priority as keyof typeof PriorityData]

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={56}
        disableSwipeToOpen={true}
        disableRestoreFocus
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box sx={{ width: '100%', height: '100vh' }}>
          <Box>
            <Box width={'100%'} height={'50px'} px={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'1px solid #ddd'}>
              <IconButton onClick={toggleDrawer(false)}>
                <Icon icon="mdi:arrow-left" width="1.75rem" height="1.75rem" />
              </IconButton>
              <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500} color={'#256dc9'}>Detail</Typography>
              <IconButton onClick={() => todoDetailOptionsRef.current?.open()}>
                <Icon icon="mdi:dots-vertical" width="1.75rem" height="1.75rem" />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Box sx={{ paddingX: '16px', paddingTop: '20px', paddingBottom: '32px', fontSize: '20px', fontWeight: 500, display: 'flex', alignItems: 'flex-start' }}>
              <IconButton
                aria-label="complete"
                onClick={handleCompleteTodo(todoDetail)}
                sx={{ marginTop: '-8px', marginLeft: '-8px' }}
              >
                {todoDetail.completed && (
                  <Box component={'svg'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" sx={{ width: '2rem', height: '2rem', flexShrink: 0, color: (theme) => theme.palette.primary.main }}>
                    <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                  </Box>
                )}
                {!todoDetail.completed && <RadioButtonUncheckedRoundedIcon sx={{ fontSize: '2rem' }} />}
              </IconButton>
              <Box sx={{ marginLeft: '16px' }}>{todoDetail.title}</Box>
            </Box>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleListSelectClick} sx={{ paddingY: '16px', color: '#737579' }}>
                  <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText primary="List" sx={{ flex: 'none' }} />
                  <ListItemText sx={{ flex: 'none', marginLeft: 'auto', ...(todoDetail.listId && { color: '#121519' }) }}>
                    {todoDetail.listId ? todoLists.find(item => item.id == todoDetail.listId)?.name : 'No List'}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={handleDuedateClick} sx={{ paddingY: '16px', color: '#737579' }}>
                  <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText primary="Due Time" sx={{ flex: 'none' }} />
                  <ListItemText sx={{ flex: 'none', marginLeft: 'auto' }}>{dayjs(todoDetail.date).format('DD/MM/YYYY')}</ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={handlePriorityClick} sx={{ paddingY: '16px', color: '#737579' }}>
                  <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                    <FlagIcon />
                  </ListItemIcon>
                  <ListItemText primary="Priority" sx={{ flex: 'none' }} />
                  <ListItemText sx={{ flex: 'none', marginLeft: 'auto', '& .MuiTypography-root': { display: 'flex', alignItems: 'center' } }}>
                    {priority && (
                      <>
                        <Box sx={{ fontSize: '14px', color: priority.color, marginRight: '4px', fontWeight: 500 }}>{priority.label}</Box>
                        <priority.icon sx={{ color: priority.color }} />
                      </>
                    )}
                    {!priority && (<Box>None</Box>)}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => { }} sx={{ paddingY: '16px', color: '#737579' }}>
                  <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                    <EventRepeatIcon />
                  </ListItemIcon>
                  <ListItemText primary="Repeat Task" sx={{ flex: 'none' }} />
                  <ListItemText sx={{ flex: 'none', marginLeft: 'auto' }}>No</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </SwipeableDrawer>
      <SwipeableDrawerBase ref={todoDetailOptionsRef} onClose={() => { }} onOpen={() => { }} PaperProps={{ sx: { backgroundColor: 'transparent', borderTopLeftRadius: '8px' } }}>
        <TodoDetailOptions todo={todoDetail} onDelete={handleSelectedTodoDelete} />
      </SwipeableDrawerBase>
      <SwipeableDrawerBase ref={todoPrioritySelectorRef} onClose={() => { }} onOpen={() => { }} PaperProps={{ sx: { backgroundColor: 'transparent', borderTopLeftRadius: '8px' } }}>
        <TodoPrioritySelector value={todoDetail.priority} onChange={(value) => handlePriorityValueChange(todoDetail, value)} />
      </SwipeableDrawerBase>
      <SwipeableDrawerBase ref={todoListSelectorRef} onClose={() => { }} onOpen={() => { }} PaperProps={{ sx: { backgroundColor: 'transparent', borderTopLeftRadius: '8px' } }}>
        <Box sx={{ display: 'flex', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', bgcolor: '#fff' }}>
          <Puller />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', bgcolor: '#fff' }}>
          <Button variant="text" color="primary" onClick={() => handleListValueChange(todoDetail, 0)}>Clear List</Button>
        </Box>
        <ListsTreeView todoLists={todoLists} onItemClick={(value) => handleListValueChange(todoDetail, value.id)} />
      </SwipeableDrawerBase>
      <AddTodoCalendar ref={dueDateCalendarDrawerRef} selectedDate={dayjs(todoDetail.date, 'YYYY-MM-DD')} onDateSelect={(value) => handleDateChange(todoDetail, value)} />
    </>
  )
}

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  margin: '8px auto',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}))

export default forwardRef(TodoDetail)
