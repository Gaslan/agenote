'use client'
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSSProperties, useState } from 'react';
import { Box } from '@mui/material';

interface PageProps {

}

const itemsData = {
  's1': [
    { id: 11, name: 'KEmal 11' },
    { id: 12, name: 'KEmal 12' },
    { id: 13, name: 'KEmal 13' }
  ],
  's2': [
    { id: 21, name: 'KEmal 21' },
    { id: 22, name: 'KEmal 22' },
    { id: 23, name: 'KEmal 23' }
  ]
}

export default function Page({ }: PageProps) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<typeof itemsData>(itemsData)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  )

  function handleDragStart({ active }: DragStartEvent) {
    console.log('handleDragStart active: ', active)
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    console.log('handleDragEnd active: ', active)
    console.log('handleDragEnd over: ', over)

    if (active.id !== over?.id) {
      setItems((old) => {
        const oldIndex = active.data.current?.sortable.index
        const newIndex = over?.data.current?.sortable.index
        const a = active.data.current?.sortable.containerId as 's1' | 's2'
        return {...old, [a]: arrayMove(old[a], oldIndex, newIndex)};
      })
    }

    setActiveId(null);
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: '#efefef' }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext id='s1' items={items.s1} strategy={verticalListSortingStrategy}>
          <ul style={{ margin: 0, padding: '8px' }}>
            {items.s1.map((item, index) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </ul>
        </SortableContext>
        <SortableContext id='s2' items={items.s2} strategy={verticalListSortingStrategy}>
          <ul style={{ margin: 0, padding: '8px' }}>
            {items.s2.map((item, index) => (
              <SortableItem key={item.id} item={item} strategy={verticalListSortingStrategy} />
            ))}
          </ul>
        </SortableContext>

        <DragOverlay>
          {activeId 
            ? (
                <div style={{backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px', padding: '4px 16px', height: '60px',}}>
                  KEmal {activeId}
                </div>
              ) 
            : null
          }
        </DragOverlay>
      </DndContext>

    </Box>
  )
}




function SortableItem(props: any) {
  const {isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '4px 16px',
    height: '60px',
    opacity: isDragging ? .4 : 1,
  } as CSSProperties;

  return (
    <div style={{ padding: '2px' }}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props.item.name}
      </div>
    </div>
  );
}

