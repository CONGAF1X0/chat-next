import React, { useState, useEffect, useRef } from "react";

export function useFocus<T extends HTMLElement>(): [
  typeof ref,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const ref = useRef<T>(); //defining the ref
  const [focussed, setFocussed] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return; //return if ref does not exist

    const currentElement = ref.current; //storing the current ref
    const onFocus = () => setFocussed(true); //fn for focus
    const onBlur = () => setFocussed(false); //fn for remove focus

    currentElement.addEventListener("focus", onFocus); //when element is focussed
    currentElement.addEventListener("blur", onBlur); //when focus is removed

    return () => {
      //removing the event listeners
      currentElement.removeEventListener("focus", onFocus);
      currentElement.removeEventListener("blur", onBlur);
    };
  }); //no dependency array means useEffect will rerun on every render

  return [ref, focussed, setFocussed];
}

export const isEmpty = (v: any) => {
  if (typeof v === "string") {
    return v === null || v === undefined || v === "";
  }
  if (typeof v === "object") {
    return Object.keys(v).length === 0;
  }
  return false;
};
