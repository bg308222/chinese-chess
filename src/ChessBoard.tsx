import './ChessBoard.css';
import { useEffect, useRef, useState } from 'react';
import { Board } from './soruce/board';
import { Position } from './soruce/position';
import { icons } from './icons/preprocess';
import { EStatus } from './soruce/type';



function ChessBoard() {
  const board = useRef(new Board());
  const [positions, setPositions] = useState<Position[]>(board.current.originPositions)

  useEffect(()=>{
    board.current.setSetter(setPositions)
  },[])

  return (
    <div>
      <div id="BoardContainer" >
        <div id="ChessContainer" >
          {positions.map(({no,role ,color, status}) => {
            const left = `${(no % 9) * 84 + 65}px`
            const top = `${Math.floor(no / 9) * 80 + (no >= 45 ? 14 : 0)}px`
            const Role = (icons as any)[`${color}${role}`]

            let backgroundColor = ""
            switch(status) {
              case EStatus.selected:
              case EStatus.movable: {
                backgroundColor = "#2696be"
                break;
              }
              case EStatus.hover: {
                backgroundColor = "#2696be"
                break;
              }
              case EStatus.eatable: {
                backgroundColor = "#e37b3e"
                break;
              }
              default: backgroundColor = ""
            }

            return <div 
              key={no}
              onClick={()=>{
                  board.current.handleInvokeClick(no)
                }}
              style={{ position: "absolute", left, top }}
              >
                {<Role data-no={no} style={{ transform: "scale(0.70)", backgroundColor }}/> } 
              </div>
          })}
        </div>
        <icons.BoardSvg />
      </div>
    </div>
  );
}

export default ChessBoard;
