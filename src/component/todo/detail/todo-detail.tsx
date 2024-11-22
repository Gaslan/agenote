import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, styled, SwipeableDrawer, Typography } from "@mui/material";
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from "react";
import EventIcon from '@mui/icons-material/Event';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import FlagIcon from '@mui/icons-material/Flag';
import dayjs, { Dayjs } from "dayjs";
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import TodoDetailOptions from "./todo-detail-options";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { RecurringEventFrequency, Todo, TodoList } from "@/db/db";
import { changeCompleted, updateDuedate, updateListId, updatePriority, updateRecurrence } from "@/db/todo-service";
import { fetchActiveDayTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice";
import TodoPrioritySelector from "../todo-priority-selector";
import { PriorityData } from "../todo-priority";
import AddTodoCalendar, { AddTodoCalendarHandle } from "../add-todo-calendar";
import ListsTreeView from "../lists/lists-tree-view";
import { getTodoLists } from "@/db/todo-list-service";
import { grey } from "@mui/material/colors";
import ModalBase, { ModalBaseHandle } from "@/component/ModalBase";
import TodoRecurrenceSelector from "../todo-recurrence-selector";

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
  const repeatModeSelectorRef = useRef<ModalBaseHandle>(null)
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

  async function handlePriorityValueChange(todo: Todo, value: number | undefined) {
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

  async function handleListValueChange(todo: Todo, value: number | undefined) {
    await updateListId(todo.id, value)
    dispatch(setSelectedTodoDetail({ ...todoDetail, listId: value }))
    dispatch(fetchActiveDayTodos())
    dispatch(fetchTodosOverdue())
    todoListSelectorRef.current?.close()
  }

  async function handleRecurrenceValueChange(todo: Todo, value: RecurringEventFrequency | null) {
    await updateRecurrence(todo.id, value)
    dispatch(setSelectedTodoDetail({ ...todoDetail, recurrence: value }))
    dispatch(fetchActiveDayTodos())
    dispatch(fetchTodosOverdue())
    repeatModeSelectorRef.current?.close()
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
        <Box sx={{ width: '100%', height: '100vh', bgcolor: '#f0f2f7', display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
          <Box bgcolor={'#fff'} width={'100%'} height={'50px'} px={'8px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} borderBottom={'1px solid #d0d2d7'}>
            <IconButton onClick={toggleDrawer(false)}>
              <WestRoundedIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
            {/* <Typography variant="body1" flexGrow={1} textAlign={'center'} fontSize={'1.125rem'} fontWeight={500} color={'#256dc9'}>Detail</Typography> */}
            <IconButton onClick={() => todoDetailOptionsRef.current?.open()}>
              <MoreVertRoundedIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ bgcolor: '#fff', paddingX: '16px', paddingY: '16px', fontSize: '20px', fontWeight: 500, display: 'flex', alignItems: 'flex-start' }}>
              <IconButton
                aria-label="complete"
                onClick={handleCompleteTodo(todoDetail)}
                sx={{ marginLeft: '-8px' }}
              >
                {todoDetail.completed && (
                  <Box component={'svg'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" sx={{ width: '2rem', height: '2rem', flexShrink: 0, color: (theme) => theme.palette.primary.main }}>
                    <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                  </Box>
                )}
                {!todoDetail.completed && <RadioButtonUncheckedRoundedIcon sx={{ fontSize: '2rem' }} />}
              </IconButton>
              <Box sx={{ marginLeft: '16px', marginTop: '9px' }}>{todoDetail.title}</Box>
            </Box>
            {/* <Box sx={{ bgcolor: '#f0f2f9', color: 'rgba(0, 0, 0, 0.54)', paddingX: '20px', paddingBottom: '16px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'flex-start' }}>
              <NotesRoundedIcon sx={{ fontSize: '1.25rem' }} />
              <Box sx={{ marginLeft: '28px' }}>{todoDetail.detail?.length == 0 ? 'Detail' : todoDetail.detail}</Box>
            </Box> */}
            <Box sx={{ padding: '4px', paddingTop: '24px' }}>
              <List disablePadding sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                <ListItem disablePadding sx={{ padding: 0 }}>
                  <ListItemButton onClick={handleListSelectClick} sx={{ paddingY: '16px', color: '#737579', height: '64px' }}>
                    <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                      <FormatListBulletedRoundedIcon />
                    </ListItemIcon>
                    {todoDetail.listId
                      ? <ListItemText primary="List" secondary={todoLists.find(item => item.id == todoDetail.listId)?.name} sx={{ flex: 'none' }} primaryTypographyProps={{ sx: { fontSize: '12px' } }} secondaryTypographyProps={{ sx: { fontSize: '15px', fontWeight: 500, color: '#1976d2' } }} />
                      : <ListItemText primary="List" sx={{ flex: 'none' }} />
                    }
                  </ListItemButton>
                  {todoDetail.listId && <ListItemSecondaryAction sx={{ left: 'auto', right: '8px' }}>
                    <IconButton onClick={() => handleListValueChange(todoDetail, undefined)}>
                      <ClearRoundedIcon sx={{ fontSize: '18px', marginLeft: 'auto' }} />
                    </IconButton>
                  </ListItemSecondaryAction>}
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ padding: 0 }}>
                  <ListItemButton onClick={handleDuedateClick} sx={{ paddingY: '16px', color: '#737579', height: '64px' }}>
                    <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                      <EventIcon />
                    </ListItemIcon>
                    {todoDetail.date
                      ? <ListItemText primary="Due Time" secondary={dayjs(todoDetail.date).format('DD/MM/YYYY')} sx={{ flex: 'none' }} primaryTypographyProps={{ sx: { fontSize: '12px' } }} secondaryTypographyProps={{ sx: { fontSize: '15px', fontWeight: 500, color: '#1976d2' } }} />
                      : <ListItemText primary="Due Time" sx={{ flex: 'none' }} />
                    }
                  </ListItemButton>
                  {todoDetail.date && <ListItemSecondaryAction sx={{ left: 'auto', right: '8px' }}>
                    <IconButton onClick={() => { }}>
                      <ClearRoundedIcon sx={{ fontSize: '18px', marginLeft: 'auto' }} />
                    </IconButton>
                  </ListItemSecondaryAction>}
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ padding: 0 }}>
                  <ListItemButton onClick={handlePriorityClick} sx={{ paddingY: '16px', color: '#737579', height: '64px' }}>
                    <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                      <FlagIcon />
                    </ListItemIcon>
                    {todoDetail.priority && priority
                      ? <ListItemText
                        primary="Priority"
                        secondary={(
                          <>
                            <Box sx={{ fontSize: '14px', color: priority.color, marginRight: '4px', fontWeight: 500 }}>{priority.label}</Box>
                            <priority.icon sx={{ color: priority.color }} />
                          </>
                        )}
                        sx={{ flex: 'none' }}
                        primaryTypographyProps={{ sx: { fontSize: '12px' } }}
                        secondaryTypographyProps={{ sx: { fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center' } }} />
                      : <ListItemText
                        primary="Priority"
                        sx={{ flex: 'none' }} />
                    }
                  </ListItemButton>
                  {todoDetail.priority && <ListItemSecondaryAction sx={{ left: 'auto', right: '8px' }}>
                    <IconButton onClick={() => handlePriorityValueChange(todoDetail, undefined)}>
                      <ClearRoundedIcon sx={{ fontSize: '18px', marginLeft: 'auto' }} />
                    </IconButton>
                  </ListItemSecondaryAction>}
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ padding: 0 }}>
                  <ListItemButton onClick={() => { repeatModeSelectorRef.current?.open() }} sx={{ paddingY: '16px', color: '#737579', height: '64px' }}>
                    <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                      <EventRepeatIcon />
                    </ListItemIcon>
                    {todoDetail.recurrence
                      ? <ListItemText primary="Repeat" secondary={todoDetail.recurrence} sx={{ flex: 'none' }} primaryTypographyProps={{ sx: { fontSize: '12px' } }} secondaryTypographyProps={{ sx: { fontSize: '15px', fontWeight: 500, color: '#1976d2' } }} />
                      : <ListItemText primary="Repeat" sx={{ flex: 'none' }} />
                    }
                  </ListItemButton>
                  {todoDetail.recurrence && <ListItemSecondaryAction sx={{ left: 'auto', right: '8px' }}>
                    <IconButton onClick={() => handleRecurrenceValueChange(todoDetail, null)}>
                      <ClearRoundedIcon sx={{ fontSize: '18px', marginLeft: 'auto' }} />
                    </IconButton>
                  </ListItemSecondaryAction>}
                </ListItem>
              </List>
            </Box>
            <Typography variant="h4" sx={{ color:'rgba(0,0,0,.56)',paddingX: '16px', paddingTop: '24px', fontSize: '16px', fontWeight: 500,  }}>Detail</Typography>
            <Box sx={{ padding: '4px' }}>
              <List disablePadding sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                <ListItem disablePadding sx={{ padding: 0 }}>
                  <ListItemButton onClick={() => { }} sx={{ paddingY: '16px', color: '#737579', height: '64px' }}>
                    <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                      <NotesRoundedIcon />
                    </ListItemIcon>
                    {todoDetail.detail}
                  </ListItemButton>
                </ListItem>

              </List>
            </Box>


          </Box>
          <Box sx={{ borderTop: '0px solid #d0d2d7' }}>
            <Box sx={{ padding: '8px 16px', fontSize: '12px', color: 'rgba(0,0,0,.56)' }}>Created at {dayjs(todoDetail.createdAt).format('DD/MM/YYYY')}</Box>
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
          <Button variant="text" color="primary" onClick={() => handleListValueChange(todoDetail, undefined)}>Clear List</Button>
        </Box>
        <ListsTreeView todoLists={todoLists} onItemClick={(value) => handleListValueChange(todoDetail, value.id)} />
      </SwipeableDrawerBase>
      <AddTodoCalendar ref={dueDateCalendarDrawerRef} selectedDate={dayjs(todoDetail.date, 'YYYY-MM-DD')} onDateSelect={(value) => handleDateChange(todoDetail, value)} />
      <SwipeableDrawerBase ref={repeatModeSelectorRef} onClose={() => { }} onOpen={() => { }} PaperProps={{ sx: { backgroundColor: 'transparent' } }}>
        <TodoRecurrenceSelector value={todoDetail.recurrence} onChange={(value) => handleRecurrenceValueChange(todoDetail, value)} />
      </SwipeableDrawerBase>
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
