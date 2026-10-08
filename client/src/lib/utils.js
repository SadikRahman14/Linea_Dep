import { clsx } from "clsx";  
import { twMerge } from "tailwind-merge";  
import animationData from "@/assets/notun.json"


export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const colors = [

  // Pink/Red Theme
  "bg-[#6d0202] text-[#ff4d6d] border border-[#ff4d6d80]",

  // Gold/Amber Theme
  "bg-[#ffb7031a] text-[#ffb703] border border-[#ffb70380]",

  // Teal Theme
  "bg-[#00b4d81a] text-[#00b4d8] border border-[#00b4d880]",

  // Violet Theme
  "bg-[#9d4edd1a] text-[#9d4edd] border border-[#9d4edd80]",

];

export const getColor = (color) => {
    if (color >= 0 && color < colors.length) {
        return colors[color];
    }
    return colors[0]; 
};


export const animationDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
}