import { useSpring, animated, useResize } from "@react-spring/web";
import { setCalendarViewMode } from "@/redux/features/todo/todoCalendarSlice";
import { Swiper } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { useDrag } from "@use-gesture/react";
import styles from "./calendar-swiper.module.css";
import dayjs from "dayjs";

interface CalendarWeekMonthSwiperProps {
  keyVal: string
  children: React.ReactNode
  initialHeight: number
  onSlideChange:  (swiper: SwiperType) => void
}

export default function CalendarWeekMonthSwiper({keyVal, children, initialHeight, onSlideChange}: CalendarWeekMonthSwiperProps) {
  
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeDay = dayjs(activeDayS)
  const calendarViewMode = useAppSelector(state => state.todoCalendar.calendarViewMode)
  const wm = +activeDay.format('w') - +activeDay.startOf('M').format('w') 
  console.log('wm: ', wm)
  const [style, api] = useSpring(() => ({ '--kk': calendarViewMode == 'month' ? 0 : wm, height: initialHeight })); // Başlangıç yüksekliği
  const heightRef = useRef(initialHeight); // Dokunduğumuz andaki yüksekliği saklamak için
  const dispatch = useAppDispatch() 

  const bind = useDrag(({ movement: [, my], down, first, axis }) => {
    if (first) {
      heightRef.current = style.height.get();
    }
    if (axis != 'y') {
      return
    }
    if (down) {
      // Kullanıcı sürüklerken, dokunma anındaki yüksekliği referans alarak güncelle
      const newHeight = Math.max(40, Math.min(240, heightRef.current + my));
      api.start({ height: newHeight, '--kk': (1 - ((newHeight - 40) / 200.0)) * (wm-0) });
    } else {
      // Kullanıcı bıraktığında mesafeye göre yüksekliği ayarla
      if (my >= 20) {
        api.start({ height: 240, '--kk': 0 })
        setTimeout(() => dispatch(setCalendarViewMode('month')), 500)
      } else if (my <= -20) {
        api.start({ height: 40, '--kk':  wm })
        setTimeout(() => dispatch(setCalendarViewMode('week')), 500)
      } else {
        api.start({ height: heightRef.current, '--kk':  (calendarViewMode == 'month' ? 0 : wm) }); // Eski yüksekliğe geri dön
      }
    }
  })

  return (
    <animated.div
        {...bind()}
        style={{
          ...style,
          backgroundColor: "#fff",
          touchAction: "none", // Dokunma hareketleri için
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: 'hidden',
          position: 'relative'
        }}>
        <Swiper
          key={keyVal}
          initialSlide={1}
          slidesPerView={1}
          centeredSlides={true}
          className={styles.swiper}
          preventInteractionOnTransition
          onSlideChange={onSlideChange}
          style={{top: `calc((var(--kk) + ${wm-1}) * -40px)`}}
        >
          {children}
        </Swiper>
      </animated.div>
  )
}
