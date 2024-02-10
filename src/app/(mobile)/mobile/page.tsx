'use client'
import { Folder } from "@/component/Folders";
import NoteEditor, { NoteEditorHandle } from "@/component/editor/NoteEditor";
import { saveNote } from "@/db/note-service";
import { Note } from "@/db/schema";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { selectNote } from "@/redux/features/app/appSlice";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

export default function Home() {

  return (
  <div>kkk</div>
  )
}
