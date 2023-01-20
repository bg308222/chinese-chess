import "./ChessBoard.css";
import { useEffect, useRef, useState } from "react";
import { Board } from "./soruce/board";
import { Position } from "./soruce/position";
import { icons } from "./icons/preprocess";
import { EColor, EStatus, EWsAction } from "./soruce/type";

function ChessBoard() {
  const board = useRef(new Board());
  const ws = useRef<WebSocket>();
  const isFirstRender = useRef(true);
  const urlColor = useRef<EColor>(EColor.r);
  const [positions, setPositions] = useState<Position[]>(
    board.current.resetPositions()
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const colorStr = document.URL.match(/:\d+\/(.*)/)?.at(1);
      if (colorStr && colorStr[1] === "b") urlColor.current = EColor.b;

      if (!ws.current) ws.current = new WebSocket("ws://localhost:3001");
      ws.current.addEventListener("open", () => {
        const groupStr = document.URL.match(/:\d+\/(.*)/);

        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              action: EWsAction.restart,
            })
          );
          ws.current.send(
            !groupStr || !groupStr[1] || groupStr[1] === "r"
              ? EColor.r
              : EColor.b
          );
        }
      });

      ws.current.addEventListener("message", async ({ data }) => {
        const { action, payload } = JSON.parse(data);
        switch (action) {
          case EWsAction.handleInvokeClick: {
            board.current.handleInvokeClick(payload);
            break;
          }
          case EWsAction.regret: {
            board.current.regret();
            break;
          }
          default: {
            board.current.restart();
            break;
          }
        }
      });

      board.current.setSetter(setPositions);
    }
  }, []);

  return (
    <div>
      <div id="BoardContainer">
        <div id="ChessContainer">
          {positions.map(({ no, role, color, status }) => {
            const left = `${(no % 9) * 84 + 65}px`;
            const top = `${Math.floor(no / 9) * 80 + (no >= 45 ? 14 : 0)}px`;
            const Role = (icons as any)[`${color}${role}`];

            let backgroundColor = "";
            switch (status) {
              case EStatus.selected:
              case EStatus.movable: {
                backgroundColor = "#2696be";
                break;
              }
              case EStatus.hover: {
                backgroundColor = "#2696be";
                break;
              }
              case EStatus.eatable: {
                backgroundColor = "#e37b3e";
                break;
              }
              default:
                backgroundColor = "";
            }

            return (
              <div
                key={no}
                onClick={() => {
                  if (ws.current && board.current.checkColor(urlColor.current))
                    ws.current.send(
                      JSON.stringify({
                        action: EWsAction.handleInvokeClick,
                        payload: no,
                      })
                    );
                  // board.current.handleInvokeClick(no);
                }}
                style={{ position: "absolute", left, top }}
              >
                {
                  <Role
                    data-no={no}
                    style={{ transform: "scale(0.70)", backgroundColor }}
                  />
                }
              </div>
            );
          })}
        </div>
        <icons.BoardSvg />
        <button
          style={{ position: "absolute", top: 0, left: 900 }}
          onClick={() => {
            if (ws.current)
              ws.current.send(
                JSON.stringify({
                  action: EWsAction.regret,
                })
              );
            // board.current.regret();
          }}
        >
          Regret
        </button>
        <button
          style={{ position: "absolute", top: 0, left: 1000 }}
          onClick={() => {
            if (ws.current)
              ws.current.send(
                JSON.stringify({
                  action: EWsAction.restart,
                })
              );
            // board.current.restart();
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default ChessBoard;
