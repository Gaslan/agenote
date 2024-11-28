import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { setCalendarMode } from "@/redux/features/todo/todoCalendarSlice";
import { alpha, Box, ButtonBase, Typography } from "@mui/material";

interface CalendarModePanelProps {

}

export default function CalendarModePanel({ }: CalendarModePanelProps) {

  const calendarMode = useAppSelector(state => state.todoCalendar.calendarMode)
  const dispatch = useAppDispatch()

  function handleCalendarModeButtonClick(mode: string) {
    return () => dispatch(setCalendarMode(mode))
  }

  return (
    <>
      <Box sx={{paddingX: '4px', paddingBottom: '16px',width: '100%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', justifyItems: 'center' }}>
        <ButtonBase 
          onClick={handleCalendarModeButtonClick('list')} 
          sx={{width: 'calc(100% - 8px)', borderRadius: '12px', padding: '2px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', ...(calendarMode == 'list' && {color: theme => theme.palette.primary.main, bgcolor: theme => alpha(theme.palette.primary.main, 0.08)})}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ width: '1em', height: '1em', fontSize: '28px' }}>
            <path fill="currentColor" d="M17 14.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5zm-1 0v-9A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5m-2-8a.5.5 0 0 1-.41.492L13.5 7h-7a.5.5 0 0 1-.09-.992L6.5 6h7a.5.5 0 0 1 .5.5m0 3.5a.5.5 0 0 1-.41.492l-.09.008h-7a.5.5 0 0 1-.09-.992L6.5 9.5h7a.5.5 0 0 1 .5.5m0 3.5a.5.5 0 0 1-.41.492L13.5 14h-7a.5.5 0 0 1-.09-.992L6.5 13h7a.5.5 0 0 1 .5.5" />
          </svg>
          <Typography sx={{fontSize: '14px'}}>List</Typography>
        </ButtonBase>
        <ButtonBase 
          onClick={handleCalendarModeButtonClick('day')} 
          sx={{width: 'calc(100% - 8px)', borderRadius: '12px', padding: '2px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', ...(calendarMode == 'day' && {color: theme => theme.palette.primary.main, bgcolor: theme => alpha(theme.palette.primary.main, 0.08)})}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ width: '1em', height: '1em', fontSize: '28px' }}>
            <path fill="currentColor" d="M14.5 3A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3zm0 1h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 4m-1.782 5c.446 0 .607.046.77.134q.246.132.378.378c.088.163.134.324.134.77v2.436c0 .446-.046.607-.134.77a.9.9 0 0 1-.378.378c-.162.088-.324.134-.77.134H7.282c-.446 0-.607-.046-.77-.134a.9.9 0 0 1-.378-.378c-.088-.162-.134-.324-.134-.77v-2.436c0-.446.046-.607.134-.77a.9.9 0 0 1 .378-.378c.163-.088.324-.134.77-.134zm.194 1.002H7.088l-.08.005l-.006.08v2.825l.005.08l.08.006h5.825l.08-.005l.006-.08v-2.825l-.005-.08zM13.5 6a.5.5 0 0 1 .09.992L13.5 7h-7a.5.5 0 0 1-.09-.992L6.5 6z" />
          </svg>
          <Typography sx={{fontSize: '14px'}}>Day</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={handleCalendarModeButtonClick('week')} 
          sx={{width: 'calc(100% - 8px)', borderRadius: '12px', padding: '2px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', ...(calendarMode == 'week' && {color: theme => theme.palette.primary.main, bgcolor: theme => alpha(theme.palette.primary.main, 0.08)})}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ width: '1em', height: '1em', fontSize: '28px' }}>
            <path fill="currentColor" d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM7 9V7h6v2zm10-3.5A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5zM5.5 4h9A1.5 1.5 0 0 1 16 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4" />
          </svg>
          <Typography sx={{fontSize: '14px'}}>Week</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={handleCalendarModeButtonClick('month')} 
          sx={{width: 'calc(100% - 8px)', borderRadius: '12px', padding: '2px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', ...(calendarMode == 'month' && {color: theme => theme.palette.primary.main, bgcolor: theme => alpha(theme.palette.primary.main, 0.08)})}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ width: '1em', height: '1em', fontSize: '28px' }}>
            <path fill="currentColor" d="M14.5 3A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3zm0 1h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 4M7 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2m3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2M7 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2m3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2m3 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2" />
          </svg>
          <Typography sx={{fontSize: '14px'}}>Month</Typography>
        </ButtonBase>
        <ButtonBase
          onClick={handleCalendarModeButtonClick('year')} 
          sx={{width: 'calc(100% - 8px)', borderRadius: '12px', padding: '2px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', ...(calendarMode == 'year' && {color: theme => theme.palette.primary.main, bgcolor: theme => alpha(theme.palette.primary.main, 0.08)})}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ width: '1em', height: '1em', fontSize: '28px' }}>
            <path fill="currentColor" d="M7 11a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 2a1 1 0 1 1-2 0a1 1 0 0 1 2 0m2-2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m1 2a1 1 0 1 1-2 0a1 1 0 0 1 2 0m2-2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4-5.5A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5zM4 7h12v7.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5zm1.5-3h9A1.5 1.5 0 0 1 16 5.5V6H4v-.5A1.5 1.5 0 0 1 5.5 4" />
          </svg>
          <Typography sx={{fontSize: '14px'}}>Year</Typography>
        </ButtonBase>
      </Box>

    </>
  )
}
