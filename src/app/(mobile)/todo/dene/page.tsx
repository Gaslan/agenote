'use client'
import { Box } from "@mui/material";
import { FullGestureState, useDrag } from '@use-gesture/react'
import { useSpring, animated, useResize } from "@react-spring/web";
import { useRef } from "react";

interface PageProps {

}

export default function Page({ }: PageProps) {

  // const bind = useDrag(kemal)

  // const aa = useRef(null)
  // const [style, api] = useSpring(() => ({ height: 100 })); // Başlangıç yüksekliği 100px

  // // Sürükleme olayını işleyen hook
  // const bind = useDrag(({ movement: [, my], down, direction, currentTarget, delta, first, initial, offset,xy }) => {
  //   if (down) {
  //     console.log('start xy: ', xy)
  //     // Div'in yeni yüksekliğini hesapla ve sınırları belirle (örneğin min 100, max 500)
  //     const newHeight = Math.max(100, Math.min(320, 100 + my));
  //     api.start({ height: newHeight });
  //   } else {
  //     console.log('finish xy: ', xy)
  //     // Kullanıcı bıraktığında mesafeye göre yüksekliği ayarla
  //     if (my >= 120) {
  //       api.start({ height: 320 }); // Mesafe en az 120px ise 320px'e ayarla
  //     } else {
  //       api.start({ height: 90 }); // Mesafe 120px'den küçükse 90px'e ayarla
  //     }
  //   }
  // });





  const [style, api] = useSpring(() => ({ height: 100 })); // Başlangıç yüksekliği
  const initialHeight = useRef(100); // Dokunduğumuz andaki yüksekliği saklamak için

  const bind = useDrag(({ movement: [, my], down, first  }) => {
    if (first) {
      initialHeight.current = style.height.get();
    }
    if (down) {
      // Kullanıcı sürüklerken, dokunma anındaki yüksekliği referans alarak güncelle
      const newHeight = Math.max(100, Math.min(320, initialHeight.current + my));
      api.start({ height: newHeight });
    } else {
      // Kullanıcı bıraktığında mesafeye göre yüksekliği ayarla
      if (my >= 20) {
        api.start({ height: 320 }); // Mesafe en az 120px ise 320px'e ayarla
      } else if (my <= -20) {
        api.start({ height: 100 }); // Mesafe -120px veya daha azsa 90px'e ayarla
      } else {
        api.start({ height: initialHeight.current }); // Eski yüksekliğe geri dön
      }
    }
  }, {

    
    // onDragStart: () => {
    //   // Sürükleme başladığında mevcut yüksekliği kaydet
    //   initialHeight.current = style.height.get();
    // },
  });


  return (
    <>
      <Box sx={{padding: '50px'}}>
        <animated.div
          {...bind()}
          style={{
            ...style,
            width: "200px", // Div genişliği
            backgroundColor: "lightblue",
            touchAction: "none", // Dokunma hareketleri için
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Sürükleyin
        </animated.div>

      </Box>
    </>
  )
}

function kemal(state: Omit<FullGestureState<"drag">, "event"> & { event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent; }) {
  console.log(state, ' ---- ')
}

