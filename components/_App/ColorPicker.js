import React from "react"
import { HexColorPicker } from "react-colorful"

export default function App({ color, setColor }) {
  return (
    <>
      <HexColorPicker color={color} onChange={setColor} />

      <div className="value" style={{ borderLeftColor: color }}>
        Current color is {color}
      </div>
    </>
  )
}