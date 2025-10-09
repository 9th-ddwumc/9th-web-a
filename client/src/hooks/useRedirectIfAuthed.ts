import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export function useRedirectIfAuthed() {
  const nav = useNavigate();
  useEffect(() => {
    if (getToken()) nav("/", { replace: true });
  }, [nav]);
}
