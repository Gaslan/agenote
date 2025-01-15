import { Todo } from "@/db/db";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties } from "react";

interface SortableItemProps {
  item: Todo
}

export default function SortableItem({ item }: SortableItemProps) {

  const { isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

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
        {item.title}
      </div>
    </div>
  )
}
