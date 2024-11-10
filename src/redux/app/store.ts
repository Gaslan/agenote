import { configureStore } from '@reduxjs/toolkit'
import appReducer from '../features/app/appSlice'
import settingsReducer from '../features/settings/settingsSlice'
import todoReducer from '../features/todo/todoSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      settings: settingsReducer,
      todo: todoReducer
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

