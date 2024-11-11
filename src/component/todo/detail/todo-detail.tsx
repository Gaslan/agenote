import { useAppSelector } from "@/redux/app/hooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef, useState } from "react";
import EventIcon from '@mui/icons-material/Event';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import FlagIcon from '@mui/icons-material/Flag';
import dayjs from "dayjs";
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import TodoDetailOptions from "./todo-detail-options";

interface TodoDetailProps {

}

export interface TodoDetailHandle {
  open: () => void
  toggle: () => void
}

const TodoDetail: ForwardRefRenderFunction<TodoDetailHandle, TodoDetailProps> = function TodoDetail({ }: TodoDetailProps, ref) {

  const [open, setOpen] = useState(false)
  const todoDetail = useAppSelector(state => state.todo.selectedTodoDetail)
  const todoDetailOptionsRef = useRef<SwipeableDrawerBaseHandle>(null)

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
    setOpen(false)
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
              <Box sx={{ '--size': '22px', height: 'var(--size)', width: 'var(--size)', border: '2px solid #737579', borderRadius: 'var(--size)', marginTop: '4px' }} />
              <Box sx={{ marginLeft: '16px' }}>{todoDetail.title}</Box>
            </Box>
            <Box sx={{ paddingX: '16px', color: '#939599' }}>
              <Box sx={{ paddingY: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d3d5d9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon />
                  <Box sx={{ marginLeft: '16px' }}>Due Time</Box>
                </Box>
                <Box>{dayjs(todoDetail.date).format('DD/MM/YYYY')}</Box>
              </Box>
            </Box>
            <Box sx={{ paddingX: '16px', color: '#939599' }}>
              <Box sx={{ paddingY: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d3d5d9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FlagIcon />
                  <Box sx={{ marginLeft: '16px' }}>Priority</Box>
                </Box>
                <Box>Priority 1</Box>
              </Box>
            </Box>
            <Box sx={{ paddingX: '16px', color: '#939599' }}>
              <Box sx={{ paddingY: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d3d5d9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventRepeatIcon />
                  <Box sx={{ marginLeft: '16px' }}>Repeat Task</Box>
                </Box>
                <Box>No</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>
      <SwipeableDrawerBase ref={todoDetailOptionsRef} onClose={() => {}} onOpen={() => {}} PaperProps={{sx: {backgroundColor: 'transparent', borderTopLeftRadius: '8px'}}}>
        <TodoDetailOptions todo={todoDetail} onDelete={handleSelectedTodoDelete} />
      </SwipeableDrawerBase>
    </>
  )
}

export default forwardRef(TodoDetail)
