export default function roundChip(config) {
  const chip = document.createElement("div");
  chip.classList.add("round-chip");
  chip.innerHTML = config.text;
  chip.onclick = config.onClick;
  return chip;
}
export function Chip(config) {
  const chip = document.createElement("div");
  chip.classList.add("chip");
  chip.innerHTML = config.text;
  chip.onclick = config.onClick;
  return chip;
}
