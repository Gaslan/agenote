'use client'
import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSSProperties, useState } from 'react';
import { Box } from '@mui/material';
import SortableWrapper from './sortable-wrapper';
import { Todo } from '@/db/db';

interface PageProps {

}

const itemsData = {
  's1': [
    { id: 11, title: 'KEmal 11' },
    { id: 12, title: 'KEmal 12' },
    { id: 13, title: 'KEmal 13' }
  ],
  's2': [
    { id: 21, title: 'KEmal 21' },
    { id: 22, title: 'KEmal 22' },
    { id: 23, title: 'KEmal 23' }
  ]
} as Record<UniqueIdentifier, Pick<Todo, 'id' | 'title'>[]>

export default function Page({ }: PageProps) {
  const [items, setItems] = useState<typeof itemsData>(itemsData)
  
  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: '#efefef' }}>
      <SortableWrapper items={items} onItemsChange={setItems}>
        {Object.entries(items).map(([key, val]) => (
          <SortableContext key={key} id={key} items={val.map(x => x.id) ?? []} strategy={verticalListSortingStrategy}>
            <ul style={{ margin: 0, padding: '8px' }}>
              {val.map((item, index) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </ul>
          </SortableContext>
        ))}
      </SortableWrapper>
    </Box>
  )
}




function SortableItem(props: any) {
  const { isDragging,
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
        {props.item.title}
      </div>
    </div>
  );
}

