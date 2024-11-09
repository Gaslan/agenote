import { Box, Button, SwipeableDrawer } from "@mui/material"
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useState } from "react"
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerSelectionState } from "@mui/x-date-pickers/internals";
import { DateView } from "@mui/x-date-pickers/models";
import { Dayjs } from "dayjs";

interface AddTodoCalendarProps {
  selectedDate: Dayjs | undefined
  onDateSelect: (date: Dayjs | undefined) => void
}

export interface AddTodoCalendarHandle {
  open: () => void
}

const AddTodoCalendar: ForwardRefRenderFunction<AddTodoCalendarHandle, AddTodoCalendarProps> = function AddTodoCalendar({ selectedDate: selectedDateState, onDateSelect }: AddTodoCalendarProps, ref) {

  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>()

  useEffect(() => {
    setSelectedDate(selectedDateState)
  }, [selectedDateState])

  useImperativeHandle(ref, () => {
    return {
      open() {
        setOpen(true)
      },
    }
  })

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  function handleChange(value: Dayjs, selectionState?: PickerSelectionState | undefined, selectedView?: DateView | undefined) {
    setSelectedDate(value)
  }

  function handleSaveButtonClick() {
    onDateSelect(selectedDate)
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

        <DateCalendar value={selectedDate ?? null} onChange={handleChange} />
        <Box sx={{padding: '16px', width: '100%'}}>
          <Button fullWidth onClick={handleSaveButtonClick} variant="contained" color="primary" sx={{borderRadius: '30px', height: '50px'}}>Save</Button>
        </Box>
      </SwipeableDrawer>
    </>
  )

}

export default forwardRef(AddTodoCalendar)
