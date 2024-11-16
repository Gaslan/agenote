import { TodoList } from "@/db/db";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

interface ListItem extends TodoList {
  children: ListItem[]
}

interface ListsTreeViewProps {
  todoLists: TodoList[]
  onItemClick: (item: TodoList) => void
}

export default function ListsTreeView({ todoLists, onItemClick }: ListsTreeViewProps) {

  function handleItemClick(item: TodoList) {
    onItemClick(item)
  }

  function createDataTree(dataset: TodoList[]) {
    const hashTable = Object.create(null)
    dataset.forEach(aData => hashTable[aData.id] = { ...aData, children: [] })
    const dataTree = [] as ListItem[]
    dataset.forEach(aData => {
      if (aData.parentId) hashTable[aData.parentId].children.push(hashTable[aData.id])
      else dataTree.push(hashTable[aData.id])
    })
    return dataTree
  }

  function renderListItem(listItems: ListItem[], level: number = 0): JSX.Element | null {
    if (!listItems || listItems.length == 0) {
      return null
    }
    return (
      <Box sx={{ bgcolor: '#fff' }}>
        <List disablePadding>
          {listItems.map(listItem => (
            <ListItem key={listItem.id} disablePadding>
              <Box sx={{ width: '100%' }}>
                <ListItemButton onClick={() => handleItemClick(listItem)} sx={{ paddingLeft: `${level * 12 + 16}px` }}>
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ marginLeft: '12px' }}>{listItem.name}</ListItemText>
                </ListItemButton>
                {renderListItem(listItem.children, level + 1)}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }

  return (
    <>
      {renderListItem(createDataTree(todoLists))}
    </>
  )
}
