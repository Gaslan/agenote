'use client'
import { Box, Button, InputBase, styled, SwipeableDrawer, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ChangeEvent, forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useRef, useState } from "react";
import AddTodoCalendar, { AddTodoCalendarHandle } from "./add-todo-calendar";
import dayjs, { Dayjs } from "dayjs";
import { db, Todo } from "@/db/db";

interface AddTodoProps {

}

export interface AddTodoHandle {
  toggle: () => void
  open: () => void
}

const AddTodo: ForwardRefRenderFunction<AddTodoHandle, AddTodoProps> = function AddTodo({ }: AddTodoProps, ref) {

  const [open, setOpen] = useState(false)
  const [dueDate, setDueDate] = useState<Dayjs>()
  const taskInputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<AddTodoCalendarHandle>(null)
  const [todo, setTodo] = useState<Todo>({ title: '', detail: '', date: dayjs().format('YYYY-MM-DD')} as Todo)

  useEffect(() => {
    if (open) {
      taskInputRef.current?.focus()
    }
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
        console.log(taskInputRef.current)
        taskInputRef.current?.focus()
      },
    }
  })

  function handleCalendarButtonClick() {
    calendarRef.current?.open()
  }

  function handleDateSelect(date: Dayjs | undefined) {
    setTodo(old => ({...old, date: date?.format('YYYY-MM-DD') ?? dayjs().format('YYYY-MM-DD')}))
  }

  async function handleTodoSave() {
    const id = await db.todos.add(todo)
    setOpen(false)
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTodo(old => ({...old, title: event.target.value}))
  }

  function handleDetailChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTodo(old => ({...old, detail: event.target.value}))
  }

  function dateLabel() {
    // console.log('todo.date', todo.date)
    // console.log('dayjs().format(YYYY-MM-DD)', dayjs().format('YYYY-MM-DD'))
    if (todo.date == dayjs().format('YYYY-MM-DD')) {
      return 'Today'
    }
    return dayjs(todo.date).format('DD/MM/YYYY')
  }

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
        <Box sx={{ padding: '0 16px', width: '100%' }}>
          <Button 
            onClick={handleCalendarButtonClick} 
            variant="outlined" 
            color={dueDate ? 'primary' : 'inherit'}>
              {dateLabel()}
          </Button>
        </Box>
        <Box sx={{ padding: '16px', width: '100%' }}>
          <Button onClick={handleTodoSave} variant="contained" fullWidth color="primary">Save</Button>
        </Box>
      </SwipeableDrawer>
      <AddTodoCalendar ref={calendarRef} selectedDate={dueDate} onDateSelect={handleDateSelect} />
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
