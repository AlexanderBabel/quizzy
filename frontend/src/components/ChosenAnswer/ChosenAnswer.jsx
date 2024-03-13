import "./ChosenAnswer.css";

export default function ChosenAnswer({ count, backgroundColor }) {
  return (
    <div
      className="countBar"
      style={{ height: `${count * 2}rem`, background: backgroundColor , maxHeight:'30rem'}}
    >
      {count > 0 && count}
    </div>
  );
}
