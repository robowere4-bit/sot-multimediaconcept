let board = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    board.push(req.body);
    board.sort((a,b)=>b.percent-a.percent);
    board = board.slice(0,10);
    return res.json(board);
  }
  res.json(board);
}