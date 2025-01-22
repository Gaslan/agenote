import { Todo } from "@/db/db";
import { closestCenter, CollisionDetection, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, getFirstCollision, KeyboardSensor, PointerSensor, pointerWithin, rectIntersection, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ReactNode, useCallback, useRef, useState } from "react";
import SortableItem from "./sortable-item";

export type SortableTodoItemsType = Record<UniqueIdentifier, Todo[]>

interface SortableWrapperProps {
  children: ReactNode
  items: SortableTodoItemsType
  onItemsChange: (fn: (old: SortableTodoItemsType) => SortableTodoItemsType) => void
}

export default function SortableWrapper({ items, children, onItemsChange }: SortableWrapperProps) {

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
  }








  function handleDragEnd({ active, over }: DragEndEvent) {
    // if (active.id in items && over?.id) {
    //   setContainers((containers) => {
    //     const activeIndex = containers.indexOf(active.id);
    //     const overIndex = containers.indexOf(over.id);

    //     return arrayMove(containers, activeIndex, overIndex);
    //   });
    // }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    // if (overId === TRASH_ID) {
    //   setItems((items) => ({
    //     ...items,
    //     [activeContainer]: items[activeContainer].filter(
    //       (id) => id !== activeId
    //     ),
    //   }));
    //   setActiveId(null);
    //   return;
    // }

    // if (overId === PLACEHOLDER_ID) {
    //   const newContainerId = getNextContainerId();

    //   unstable_batchedUpdates(() => {
    //     setContainers((containers) => [...containers, newContainerId]);
    //     setItems((items) => ({
    //       ...items,
    //       [activeContainer]: items[activeContainer].filter(
    //         (id) => id !== activeId
    //       ),
    //       [newContainerId]: [active.id],
    //     }));
    //     setActiveId(null);
    //   });
    //   return;
    // }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = items[activeContainer].findIndex(x => x.id === active.id);
      const overIndex = items[overContainer].findIndex(x => x.id === overId);

      if (activeIndex !== overIndex) {
        onItemsChange((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  }











  // function handleDragEnd({ active, over }: DragEndEvent) {
  //   if (active.id !== over?.id) {
  //     onItemsChange((old) => {
  //       const oldIndex = active.data.current?.sortable.index
  //       const newIndex = over?.data.current?.sortable.index
  //       const a = active.data.current?.sortable.containerId
  //       return { ...old, [a]: arrayMove(old[a], oldIndex, newIndex) };
  //     })
  //   }

  //   setActiveId(null);
  // }

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {

        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.some(x => x.id === container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );

  function findContainer(id: UniqueIdentifier) {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => items[key].some(x => x.id == id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id)

    if (!overContainer || !activeContainer) {
      return
    }

    if (activeContainer === overContainer) {
      return
    }

    onItemsChange((items) => {
      const activeItems = items[activeContainer];
      const overItems = items[overContainer];
      const overIndex = overItems.findIndex(x => x.id == overId)
      const activeIndex = activeItems.findIndex(x => x.id == active.id);

      let newIndex: number;

      if (overId in items) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top >
          over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex =
          overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      recentlyMovedToNewContainer.current = true;

      return {
        ...items,
        [activeContainer]: items[activeContainer].filter(
          (item) => item.id !== active.id
        ),
        [overContainer]: [
          ...items[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...items[overContainer].slice(
            newIndex,
            items[overContainer].length
          ),
        ],
      }
    })
  }

  
  const activeContainer = findContainer(activeId as UniqueIdentifier)
  const activeItems = activeContainer ? items[activeContainer] : [];
  const activeIndex = activeItems.findIndex(x => x.id == activeId)

  return (
    <DndContext
      sensors={sensors} 
      collisionDetection={collisionDetectionStrategy} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver}>
      {children}
      <DragOverlay>
        {activeId
          ? (
            // <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px', padding: '4px 16px', height: '60px', }}>
            //   KEmal {activeId}
            // </div>
            <SortableItem item={activeItems[activeIndex]} />
          )
          : null
        }
      </DragOverlay>
    </DndContext>
  )
}
