import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';

export const PriorityData = {
  5: {
    label: 'Highest',
    value: 5,
    // color: '#bd391b',
    color: '#ff7452',
    icon: KeyboardDoubleArrowUpRoundedIcon
  },
  4: {
    label: 'High',
    value: 4,
    // color: '#bd391b',
    color: '#ff8f73',
    icon: KeyboardArrowUpRoundedIcon
  },
  3: {
    label: 'Medium',
    value: 3,
    // color: '#bdb21b',
    color: '#ffab00',
    icon: DragHandleRoundedIcon
  },
  2: {
    label: 'Low',
    value: 2,
    // color: '#1b80bd',
    color: '#0065ff',
    icon: KeyboardArrowDownRoundedIcon
  },
  1: {
    label: 'Lowest',
    value: 1,
    // color: '#1b80bd',
    color: '#2684ff',
    icon: KeyboardDoubleArrowDownRoundedIcon
  }
}

export type PriorityValue = keyof typeof PriorityData
