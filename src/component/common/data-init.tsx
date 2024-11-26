import { useAppDispatch } from "@/redux/app/hooks"
import { fetchTodoLists } from "@/redux/features/todo/todoSlice"
import { useEffect } from "react"

interface DataInitProps {
  children: React.ReactNode
}

export default function DataInit({ children }: Readonly<DataInitProps>) {

  const dispatch = useAppDispatch()

  useEffect(() => {
    async function fetch() {
      await dispatch(fetchTodoLists())
    }
    fetch()
  }, [])

  return (
    <>
      {children}
    </>
  )
}
