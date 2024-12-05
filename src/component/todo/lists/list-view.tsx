'use client'
import { alpha, Box, Button, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import { Todo, TodoList, TodoListSection } from "@/db/db";
import TodoListItem from "@/component/todo/todo-list-item";
import { changeCompleted, getTodosByListId } from "@/db/todo-service";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PopupMenuBase, { PopupMenuBaseHandle } from "@/component/mobile/popup-menu-base";
import SwipeableDrawerBase, { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import AddSectionDrawer from "@/component/todo/list/add-section-drawer";
import { addTodoListSection, getTodoListById, getTodoListSectionsByListId } from "@/db/todo-list-service";
import { BeforeCapture, DragDropContext, DragStart, Droppable } from "react-beautiful-dnd";

interface ListViewProps {
  listId: number
}

// const completedSound = new Audio('/completed.mp3')

export default function ListView({ listId }: ListViewProps) {

  const [loading, setLoading] = useState(false)
  const [todos, setTodos] = useState<Todo[]>([])
  const [todoList, setTodoList] = useState<TodoList>()
  const [sections, setSections] = useState<TodoListSection[]>([])
  const [sectionsCollapsed, setSectionsCollapsed] = useState<Map<number, boolean>>(new Map())
  const [completedCollapsed, setCompletedCollapsed] = useState(false)
  const menuRef = useRef<PopupMenuBaseHandle>(null)
  const addSectionDrawerRef = useRef<SwipeableDrawerBaseHandle>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      await fetchTodos()
      await fetchTodoList()
      await fetchSections()
      setLoading(false)
    }
    fetch()
  }, [])

  async function fetchTodos() {
    const todos = await getTodosByListId(listId)
    setTodos(todos)
  }

  async function fetchTodoList() {
    const todoList = await getTodoListById(listId)
    setTodoList(todoList)
  }

  async function fetchSections() {
    const sections = await getTodoListSectionsByListId(listId)
    setSections(sections)
  }

  async function handleItemComplete(todo: Todo) {
    await changeCompleted(todo.id, !todo.completed)
    if (!todo.completed) {
      // completedSound.play()
    }
    navigator.vibrate(50)
    fetchTodos()
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const unCompletedTodos = todos.filter(todo => !todo.completed)

  async function handleSectionNameSubmit(name: string) {
    await addTodoListSection(name, listId)
    await fetchSections()
    addSectionDrawerRef.current?.close()
  }

  function handleSectionCollapseButtonClick(id: number) {
    setSectionsCollapsed(old => {
      return new Map(old.set(id, !old.get(id)))
    })
  }

  if (loading) {
    return null
  }

  function kemal(start: DragStart): void {
    console.log(start)
  }

  function osman(before: BeforeCapture): void {
    console.log(before)
  }

  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '60px', paddingBottom: '60px' }}>
        <Box sx={{ bgcolor: '#ffffff00', zIndex: 999, userSelect: 'none', borderRadius: '0px', borderBottom: '0px solid #d3d5d9', height: '60px', position: 'fixed', top: 0, left: 0, right: 0 }}>
          <Box sx={{ height: '100%', paddingX: '16px', color: 'rgba(19,21,25,.75)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => router.push('/todo/lists')} sx={{ fontSize: '1.5rem', marginLeft: '-8px', marginRight: '8px' }}>
                <WestRoundedIcon fontSize="inherit" />
              </IconButton>
              {todoList?.name}
            </Box>
            <Box>
              <IconButton onClick={(e) => menuRef.current?.open(e)} sx={{ fontSize: '1.5rem', marginRight: '-8px' }}>
                <MoreVertRoundedIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box sx={{ paddingY: '2px', width: '100%', flexGrow: 1 }}>
          {todos.length == 0 && sections.length == 0 && (
            <Box sx={{ height: '100%', paddingTop: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" viewBox="0 0 24 24">
                <path fill="#0674ea" d="M2 12.204c0-2.289 0-3.433.52-4.381c.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2s2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715S22 9.915 22 12.203v1.522c0 3.9 0 5.851-1.172 7.063S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.626 2 13.725z" opacity="0.5" />
                <path fill="#0674ea" d="M12.75 11a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V17a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25z" />
              </svg>
              <Box sx={{ color: '#0674ea', marginTop: '12px' }}>
                <Button variant="text" sx={{ textTransform: 'none', fontSize: '15px', fontWeight: 400 }}>Add new task</Button>
              </Box>
            </Box>
          )}
          {/* <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, flexGrow: 1, '& ul': { padding: 0, listStyle: 'none' }, '& .MuiCollapse-root': { flexGrow: 1 }, '& .MuiCollapse-wrapper': { height: '100%' } }} subheader={<li />}>
            {unCompletedTodos.map((todo, i) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                order={i}
                isListNameVisible={false}
                onComplete={handleItemComplete}
                onItemClick={() => { }} />
            ))}
            {completedTodos.length > 0 && (
              <>
                <li style={{ padding: '0 4px' }}>
                  <Button fullWidth variant="text" onClick={() => setCompletedCollapsed(old => !old)} sx={{ paddingX: '6px', paddingY: '12px', justifyContent: 'flex-start', textTransform: 'none', color: 'currentcolor' }}>
                    <ExpandMoreRoundedIcon sx={{ marginRight: '6px', transition: 'transform ease .2s', ...(completedCollapsed && { transform: 'rotate(-90deg)' }) }} />
                    <Box sx={{ flexGrow: 1, textAlign: 'left' }}>Completed</Box>
                    <Box sx={{ paddingX: '4px', fontSize: '12px', color: alpha('#000', .6) }}>{completedTodos.length}</Box>
                  </Button>
                </li>
                <Collapse in={!completedCollapsed}>
                  {completedTodos.map((todo, i) => (
                    <TodoListItem
                      key={todo.id}
                      todo={todo}
                      order={i}
                      isListNameVisible={false}
                      onComplete={handleItemComplete}
                      onItemClick={() => { }} />
                  ))}
                </Collapse>
              </>
            )}
          </List> */}
          <DragDropContext  onDragEnd={() => console.log('BIRAKTI')} onBeforeDragStart={kemal} onBeforeCapture={osman}>
            {sections.length > 0 && (

              <Droppable droppableId="droppable-list">
                {(provided) => (
                  <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, flexGrow: 1, '& ul': { padding: 0, listStyle: 'none' }, '& .MuiCollapse-root': { flexGrow: 1 }, '& .MuiCollapse-wrapper': { height: '100%' } }} subheader={<li />}>
                    {sections.map(section => (
                      <li key={section.id} style={{ padding: '0 4px' }}>
                        <Button fullWidth variant="text" onClick={() => handleSectionCollapseButtonClick(section.id)} sx={{ paddingX: '6px', paddingY: '12px', justifyContent: 'flex-start', textTransform: 'none', color: 'currentcolor' }}>
                          <ExpandMoreRoundedIcon sx={{ marginRight: '6px', transition: 'transform ease .2s', ...(sectionsCollapsed.get(section.id) && { transform: 'rotate(-90deg)' }) }} />
                          {section.name}
                        </Button>
                        <Collapse in={!sectionsCollapsed.get(section.id)}>

                          <List ref={provided.innerRef} {...provided.droppableProps} sx={{ position: 'relative', overflow: 'auto', paddingY: 0, flexGrow: 1, '& ul': { padding: 0, listStyle: 'none' }, '& .MuiCollapse-root': { flexGrow: 1 }, '& .MuiCollapse-wrapper': { height: '100%' } }} subheader={<li />}>
                            {unCompletedTodos.filter(x => x.sectionId == section.id).map((todo, i) => (
                              <TodoListItem
                                key={todo.id}
                                todo={todo}
                                order={i}
                                isListNameVisible={false}
                                onComplete={handleItemComplete}
                                onItemClick={() => { }} />
                            ))}
                            {provided.placeholder}
                          </List>
                        </Collapse>
                      </li>
                    ))}
                  </List>

                )}
              </Droppable>
            )}
          </DragDropContext>
        </Box>
      </Box>

      <PopupMenuBase ref={menuRef} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <ListItem disablePadding sx={{ paddingX: '4px' }}>
          <ListItemButton disableTouchRipple onClick={() => setTimeout(() => addSectionDrawerRef.current?.open(), 200)} sx={{ borderRadius: '4px' }}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1em', height: '1em', fontSize: '24px' }} viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 20h.01M4 20h.01M8 20h.01M12 20h.01M16 20h.01M20 4h.01M4 4h.01M8 4h.01M12 4h.01M16 4v.01M4 9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
              </svg>
            </ListItemIcon>
            <ListItemText sx={{ marginLeft: '8px' }}>Add Section</ListItemText>
          </ListItemButton>
        </ListItem>
      </PopupMenuBase>
      <SwipeableDrawerBase ref={addSectionDrawerRef} onOpen={() => { }} onClose={() => { }} PaperProps={{ sx: { bgcolor: 'transparent' } }} ModalProps={{ keepMounted: true }}>
        <AddSectionDrawer onNameSubmit={handleSectionNameSubmit} />
      </SwipeableDrawerBase>
    </>
  )
}
