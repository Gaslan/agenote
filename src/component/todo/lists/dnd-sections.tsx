import { closestCenter, DndContext, DragEndEvent, DragStartEvent, KeyboardSensor, MeasuringConfiguration, MeasuringStrategy, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from "react";

const measuring: MeasuringConfiguration = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

interface DndSectionsProps {

}

export default function DndSections({ }: DndSectionsProps) {

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function handleDragEnd({ over }: DragEndEvent) {
    // if (over) {
    //   const overIndex = items.indexOf(over.id);

    //   if (activeIndex !== overIndex) {
    //     const newIndex = overIndex;

    //     setItems((items) => arrayMove(items, activeIndex, newIndex));
    //   }
    // }

    setActiveId(null);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
    >
      <SortableContext items={items}>
        <ul>
          {items.map((id, index) => (
            <></>
          ))}
        </ul>
      </SortableContext>

    </DndContext>
  )
}

const items = [
  { id: 1, name: 'KEmal 1' },
  { id: 2, name: 'KEmal 2' },
  { id: 3, name: 'KEmal 3' }
]

