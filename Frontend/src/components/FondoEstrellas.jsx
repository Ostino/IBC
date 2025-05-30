import { useEffect } from "react";

export default function FondoEstrellas() {
  useEffect(() => {
    const fondo = document.getElementById("fondo-estrellas");
    if (!fondo) return;

    for (let i = 0; i < 200; i++) {
      const estrella = document.createElement("div");
      estrella.className = "estrella";
      estrella.style.left = `${Math.random() * 100}vw`;
      estrella.style.top = `${Math.random() * 100}vh`;
      estrella.style.width = `${Math.random() * 2 + 1}px`;
      estrella.style.height = estrella.style.width;
      fondo.appendChild(estrella);
    }
  }, []);

  return (
    <div
      id="fondo-estrellas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        zIndex: -1,
        overflow: "hidden",
      }}
    />
  );
}
