import { AnimateLayoutChanges, defaultAnimateLayoutChanges, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Collapse, List } from "@mui/material";
import SortableItem from "./sortable-item";
import { Todo, TodoListSection } from "@/db/db";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useState } from "react";

interface ListSectionProps {
  section: TodoListSection
  items: Todo[]
}

export default function ListSection({ section, items }: ListSectionProps) {

  const [sectionsCollapsed, setSectionsCollapsed] = useState<boolean>(false)

  const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true })

  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: section.id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  });

  return (
    <Box key={section.id} style={{ padding: '0 4px' }}>
      <Button fullWidth variant="text" onClick={() => setSectionsCollapsed(old => !old)} sx={{ paddingX: '6px', paddingY: '12px', justifyContent: 'flex-start', textTransform: 'none', color: 'currentcolor' }}>
        <ExpandMoreRoundedIcon sx={{ marginRight: '6px', transition: 'transform ease .2s', ...(sectionsCollapsed && { transform: 'rotate(-90deg)' }) }} />
        {section.name}
      </Button>
      <Collapse in={!sectionsCollapsed}>
        <SortableContext key={section.id} id={`${section.id}`} items={items} strategy={verticalListSortingStrategy}>
          {items.length > 0 && items.map((item) => (
            <SortableItem key={item.id} item={item as Todo} />
          ))}

          {(items.length == 0) && (
            <div style={{ width: '100%', height: '50px', background: 'rgba(0,0,0,.05)' }}></div>
          )}
        </SortableContext>
      </Collapse>
    </Box>
  )
}
