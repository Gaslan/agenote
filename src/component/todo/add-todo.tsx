'use client'
import { Box, Button, InputBase, styled, SwipeableDrawer } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ChangeEvent, forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from "react";
import AddTodoCalendar, { AddTodoCalendarHandle } from "./add-todo-calendar";
import dayjs, { Dayjs } from "dayjs";
import { Todo } from "@/db/db";
import { useAppDispatch } from "@/redux/app/hooks";
import { fetchActiveDayTodos } from "@/redux/features/todo/todoSlice";
import { addTodo } from "@/db/todo-service";
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "../mobile/swipeable-drawer-base";
import TodoPrioritySelector from "./todo-priority-selector";
import { PriorityData } from "./todo-priority";

interface AddTodoProps {

}

export interface AddTodoHandle {
  toggle: () => void
  open: () => void
}

const initialTodo = { title: '', detail: '', date: dayjs().format('YYYY-MM-DD') } as Todo

const AddTodo: ForwardRefRenderFunction<AddTodoHandle, AddTodoProps> = function AddTodo({ }: AddTodoProps, ref) {

  const [open, setOpen] = useState(false)
  const taskInputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<AddTodoCalendarHandle>(null)
  const todoPrioritySelectorRef = useRef<SwipeableDrawerBaseHandle>(null)

  const [todo, setTodo] = useState<Todo>(initialTodo)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (open) {
      taskInputRef.current?.focus()
    }
    setTodo(initialTodo)
  }, [open])

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  useImperativeHandle(ref, () => {
    return {
      toggle() {
        setOpen(old => !old)
      },
      open() {
        setOpen(true)
        taskInputRef.current?.focus()
      },
    }
  })

  function handleCalendarButtonClick() {
    calendarRef.current?.open()
  }

  function handlePriorityButtonClick() {
    todoPrioritySelectorRef.current?.open()
  }

  function handleDateSelect(date: Dayjs | undefined) {
    setTodo(old => ({ ...old, date: date?.format('YYYY-MM-DD') ?? dayjs().format('YYYY-MM-DD') }))
  }

  async function handleTodoSave() {
    await addTodo(todo)
    dispatch(fetchActiveDayTodos())
    setOpen(false)
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTodo(old => ({ ...old, title: event.target.value }))
  }

  function handleDetailChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTodo(old => ({ ...old, detail: event.target.value }))
  }

  function dateLabel() {
    if (todo.date == dayjs().format('YYYY-MM-DD')) {
      return 'Today'
    }
    return dayjs(todo.date).format('DD/MM/YYYY')
  }

  async function handlePriorityValueChange(value: number) {
    setTodo(old => ({ ...old, priority: value }))
    todoPrioritySelectorRef.current?.close()
  }

  const priority = PriorityData[todo.priority as keyof typeof PriorityData]

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
        <Box sx={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
          <Puller />
        </Box>
        <Box sx={{ paddingX: '16px', paddingTop: '12px', paddingBottom: '8px' }}>
          <InputBase
            inputRef={taskInputRef}
            fullWidth
            autoComplete="false"
            placeholder="Add Task"
            value={todo.title}
            onChange={handleTitleChange}
            sx={{ '&>.MuiInputBase-input': { fontSize: '20px' } }} />
        </Box>
        <Box sx={{ paddingX: '16px', paddingBottom: '16px' }}>
          <InputBase
            fullWidth
            autoComplete="false"
            multiline
            placeholder="Description"
            value={todo.detail}
            onChange={handleDetailChange}
            sx={{ '&>.MuiInputBase-input': { fontSize: '15px' } }} />
        </Box>
        <Box sx={{ padding: '0 16px', width: '100%', display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={handleCalendarButtonClick}
            variant="outlined"
            color={todo.date ? 'primary' : 'inherit'}
            sx={{ textTransform: 'none' }}>
            {dateLabel()}
          </Button>

          {todo.priority && (
            <Button
              onClick={handlePriorityButtonClick}
              variant="outlined"
              color={todo.date ? 'primary' : 'inherit'}
              sx={{ marginLeft: '8px', textTransform: 'none', borderColor: priority.color }}>
              <>
                <Box sx={{ fontSize: '14px', color: priority.color, marginRight: '4px', fontWeight: 500 }}>{priority.label}</Box>
                <priority.icon sx={{ color: priority.color }} />
              </>
              {!todo.priority && (<Box>Priority</Box>)}
            </Button>
          )}

          {!todo.priority && (
            <Button
              onClick={handlePriorityButtonClick}
              variant="outlined"
              color={todo.date ? 'primary' : 'inherit'}
              sx={{ marginLeft: '8px', textTransform: 'none' }}>
              Priority
            </Button>
          )}
        </Box>
        <Box sx={{ padding: '16px', width: '100%' }}>
          <Button onClick={handleTodoSave} variant="contained" fullWidth color="primary" sx={{ borderRadius: '40px', height: '40px' }}>Save</Button>
        </Box>
      </SwipeableDrawer>
      <AddTodoCalendar ref={calendarRef} selectedDate={dayjs(todo.date, 'YYYY-MM-DD')} onDateSelect={handleDateSelect} />
      <SwipeableDrawerBase ref={todoPrioritySelectorRef} onClose={() => { }} onOpen={() => { }} PaperProps={{ sx: { backgroundColor: 'transparent', borderTopLeftRadius: '8px' } }}>
        <TodoPrioritySelector value={todo.priority} onChange={(value) => handlePriorityValueChange(value)} />
      </SwipeableDrawerBase>
    </>
  )
}

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

export default forwardRef(AddTodo)
