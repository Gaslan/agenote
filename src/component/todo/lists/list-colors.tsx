import { Box } from "@mui/material";
import { useState } from "react";

const COLORS = [
  '#787781',
  '#ab535a',
  '#2c9d5d',
  '#bf9dd4',
  '#726ba1',
  '#436bbb',
  '#94c299',
  '#d278af',
  '#717075',
  '#584aad',
  '#cd860a',
  '#aba0f1',
  '#f5d231',
  '#cb5522',
  '#32d383',
  '#383fe8'
]

interface ListColorsProps {
  selectedColor: string
  onColorSelect: (color: string) => void
}

export default function ListColors({  selectedColor, onColorSelect }: ListColorsProps) {


  return (
    <>
      <Box sx={{ bgcolor: '#fff', paddingY: '16px' }}>
        <Box sx={{ paddingBottom: '16px', paddingX: '16px', fontWeight: 500 }}>Colors</Box>
        <Box sx={{ '--size': '40px', paddingX: '16px', display: 'grid', alignItems: 'center', justifyItems: 'center', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--size), 1fr))', gridTemplateRows: 'minmax(var(--size), auto)' }}>
          {COLORS.map(color => (
            <Box 
              key={color}
              onClick={() => onColorSelect(color)} 
              sx={{ 
                width: 'var(--size)', height: 'var(--size)', borderRadius: 'var(--size)', bgcolor: color, display: 'flex', flexShrink: 0, position: 'relative',
                ...(selectedColor == color && { '&:after': {content: '""', position: 'absolute', left:'50%', top: '50%', transform: 'translate(-50%, -50%)',  width: '18px', height: '18px', borderRadius: '18px', bgcolor: 'rgba(0,0,0,.5)'}}) 
              }} />
          ))}
        </Box>
      </Box>
    </>
  )
}
