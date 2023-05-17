import * as React from "react";
import Image from "next/image";
import placeholder from "../app/placeholder.svg";
import { getBackgroundColor, isColorDark, rgbToHex } from "@utils/color";
import { pasteImage } from "@utils/clipboard";
import { useRef, useEffect } from "react";
import { useToast } from "./ui/toast/use-toast";


export const ClipboardImage = ({
  insetColor,
  insetPadding,
  setInsetColor,
  setInsetPadding,
  setIsDark,
}: {
  insetColor: string;
  insetPadding: number;
  setInsetColor: (input: string) => void;
  setInsetPadding: (input: number) => void;
  setIsDark: (input: boolean) => void;
}) => {

  const {toast} = useToast();
  const shownImage = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if(shownImage.current){
      const existingImage: HTMLImageElement = shownImage.current;
      existingImage.addEventListener("load", () => {
        const backgroundColor = getBackgroundColor(existingImage);
        if (backgroundColor) {
          const hexColor = rgbToHex(backgroundColor);
          if (hexColor) {
            setInsetColor(hexColor);
            setInsetPadding(1);
          }
          const isDark = isColorDark(backgroundColor);
          if (isDark !== undefined) {
            setIsDark(isDark);
          }
        }
      });
    }

      
    
  }, [])


  const handleClick = async () => {
    if (shownImage.current){
      const response = await pasteImage(shownImage.current);
      if(response instanceof Error) {
        toast({title: response.message});
      }
      else {
         toast({title: "Image uploaded"})
      }
      
    } 
  }


  return (


    <Image
      onClick={handleClick}
      src={placeholder}
      ref={shownImage}
      alt="Image"
      quality={100}
      className="w-auto min-h-fit max-h-full object-contain rounded-md shadow-2xl"
      priority={true}
      style={{
        padding: `${insetPadding}%`,
        background: insetPadding ? insetColor : "transparent",
      }}
    />
     
  );
};
