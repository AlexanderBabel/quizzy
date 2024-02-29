import "./ResultListTile.css";

function ResultListTile({ score, name, placement }) {
  return (
    <div className="resultListTile">
      <div className="tileStart">
        <h1 id="placementNumber" className="tileText">
          {placement}.
        </h1>{" "}
        <h1 className="tileText">{name}</h1>
      </div>
      <h1 className="tileText">{score}p</h1>
    </div>
  );
}

export default ResultListTile;
