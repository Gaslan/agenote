import { useSpring, animated, useResize } from "@react-spring/web";
import { setCalendarViewMode } from "@/redux/features/todo/todoCalendarSlice";
import { Swiper } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import React, { useRef } from "react";
import { useAppDispatch } from "@/redux/app/hooks";
import { useDrag } from "@use-gesture/react";
import styles from "./calendar-swiper.module.css";

interface CalendarWeekMonthSwiperProps {
  keyVal: string
  children: React.ReactNode
  initialHeight: number
  onSlideChange:  (swiper: SwiperType) => void
}

export default function CalendarWeekMonthSwiper({keyVal, children, initialHeight, onSlideChange}: CalendarWeekMonthSwiperProps) {
  
  const [style, api] = useSpring(() => ({ height: initialHeight })); // Başlangıç yüksekliği
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
      api.start({ height: newHeight });
    } else {
      // Kullanıcı bıraktığında mesafeye göre yüksekliği ayarla
      if (my >= 20) {
        api.start({ height: 240 })
        setTimeout(() => dispatch(setCalendarViewMode('month')), 500)
      } else if (my <= -20) {
        api.start({ height: 40 })
        setTimeout(() => dispatch(setCalendarViewMode('week')), 500)
      } else {
        api.start({ height: heightRef.current }); // Eski yüksekliğe geri dön
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
        >
          {children}
        </Swiper>
      </animated.div>
  )
}
