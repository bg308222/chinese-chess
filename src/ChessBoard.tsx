import "./ChessBoard.css";
import { useEffect, useRef, useState } from "react";
import { Board } from "./soruce/board";
import { Position } from "./soruce/position";
import { icons } from "./icons/preprocess";
import { EColor, EStatus, EWsAction } from "./soruce/type";
import eatAudio from "./audio/eat.mp3";
import moveAudio from "./audio/move.mp3";
import restartAudio from "./audio/restart.mp3";
import selectAudio from "./audio/select.mp3";
const playAudio = (audio: HTMLAudioElement) => {
  audio.currentTime = 0;
  audio.play();
};
function ChessBoard() {
  const board = useRef(new Board());
  const ws = useRef<WebSocket>();
  const isFirstRender = useRef(true);
  const isFirstAudio = useRef(true);
  const selectRef = useRef(new Audio());
  const moveRef = useRef(new Audio());
  const eatRef = useRef(new Audio());
  const restartRef = useRef(new Audio());
  const [giftedColor, setGiftedColor] = useState(EColor.r);
  const [positions, setPositions] = useState<Position[]>(
    board.current.resetPositions()
  );
  const offset = 450;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!ws.current) ws.current = new WebSocket("ws://1.169.185.1:3001");
      ws.current.addEventListener("open", () => {
        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              action: EWsAction.restart,
            })
          );
        }
      });

      ws.current.addEventListener("message", ({ data }) => {
        const { action, payload } = JSON.parse(data);
        switch (action) {
          case EWsAction.giftedColor: {
            setGiftedColor(payload === "r" ? EColor.r : EColor.b);
            break;
          }
          case EWsAction.handleInvokeClick: {
            board.current.handleInvokeClick(
              payload,
              () => {
                playAudio(selectRef.current);
              },
              () => {
                playAudio(moveRef.current);
              },
              () => {
                playAudio(eatRef.current);
              }
            );
            break;
          }
          case EWsAction.regret: {
            board.current.regret();
            break;
          }
          case EWsAction.reset: {
            if (ws.current) {
              ws.current.send(
                JSON.stringify({
                  action: EWsAction.reset,
                })
              );
            }
            break;
          }
          default: {
            if (isFirstAudio.current) {
              isFirstAudio.current = false;
            } else {
              playAudio(restartRef.current);
            }
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
      <audio ref={selectRef} src={selectAudio}></audio>
      <audio ref={moveRef} src={moveAudio}></audio>
      <audio ref={eatRef} src={eatAudio}></audio>
      <audio ref={restartRef} src={restartAudio}></audio>
      <div id="BoardContainer" style={{ position: "absolute", left: offset }}>
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
                  if (ws.current && board.current.checkColor(giftedColor)) {
                    ws.current.send(
                      JSON.stringify({
                        action: EWsAction.handleInvokeClick,
                        payload: no,
                      })
                    );
                  }
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
          style={{ position: "absolute", bottom: 130, left: 150 }}
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
          悔棋
        </button>

        <button
          style={{ position: "absolute", bottom: 130, left: 75 }}
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
          新局
        </button>

        {board.current.getCurrentColor() === EColor.r ? (
          <icons.rempty
            style={{
              position: "absolute",
              bottom: 169,
              left: 900,
              transform: "scale(0.70)",
            }}
          />
        ) : (
          <icons.bempty
            style={{
              position: "absolute",
              top: 0,
              left: 900,
              transform: "scale(0.70)",
            }}
          />
        )}

        {giftedColor === EColor.r ? (
          <icons.rempty
            style={{
              position: "absolute",
              bottom: 169,
              left: 820,
              transform: "scale(0.70)",
            }}
          />
        ) : (
          <icons.bempty
            style={{
              position: "absolute",
              top: 0,
              left: 820,
              transform: "scale(0.70)",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ChessBoard;
