import { ECollisionType, EColor, EMoveType, ERole, EStatus } from "./type";

export class Position {
  constructor(
    public no: number,
    public role: ERole,
    public color: EColor,
    public status: EStatus = EStatus.none
  ) {}

  private chechIsValid(
    originPosition: number,
    newPosition: number,
    isRowMove = false
  ) {
    if (newPosition < 0) return false; //top boundary
    if (newPosition > 89) return false; //down boundary
    if (
      isRowMove &&
      Math.floor(newPosition / 9) !== Math.floor(originPosition / 9)
    )
      return false; //row boundary
    return true;
  }

  private move(moveType: EMoveType) {
    let isValid = true;
    switch (moveType) {
      case EMoveType.up: {
        const originPosition = this.no;
        this.no -= 9;
        isValid = this.chechIsValid(originPosition, this.no);
        break;
      }
      case EMoveType.right: {
        const originPosition = this.no;
        this.no += 1;
        isValid = this.chechIsValid(originPosition, this.no, true);
        break;
      }
      case EMoveType.down: {
        const originPosition = this.no;
        this.no += 9;
        isValid = this.chechIsValid(originPosition, this.no);
        break;
      }
      case EMoveType.left: {
        const originPosition = this.no;
        this.no -= 1;
        isValid = this.chechIsValid(originPosition, this.no, true);
        break;
      }
      default: {
        break;
      }
    }
    return isValid;
  }

  private copyPosition() {
    return new Position(this.no, this.role, this.color, this.status);
  }

  private checkIsCollision(positions: Position[]) {
    const realPosition = positions[this.no];
    if (realPosition.role !== ERole.none) {
      if (realPosition.color === this.color) return ECollisionType.union;
      return ECollisionType.enemy;
    }
    return ECollisionType.none;
  }

  private limitPositions(movablePositions: number[]): number[] {
    switch (this.role) {
      case ERole.g:
      case ERole.s: {
        const permitPositions =
          this.color === EColor.b
            ? [3, 4, 5, 12, 13, 14, 21, 22, 23]
            : [66, 67, 68, 75, 76, 77, 84, 85, 86];
        return movablePositions.filter((v) => permitPositions.includes(v));
      }
      case ERole.e: {
        return movablePositions.filter((v) =>
          this.color === EColor.b ? v < 45 : v >= 45
        );
      }
      case ERole.z: {
        // done before
        break;
      }
      default: {
        return movablePositions;
      }
    }
    return movablePositions;
  }

  private executeMoveCommand(
    moveCommandLists: EMoveType[][],
    positions: Position[]
  ): number[] {
    const movablePositions = moveCommandLists.reduce<number[]>(
      (p, moveCommandList) => {
        let isValid = true;
        let isTakeOverByItself = false;
        const position = this.copyPosition();
        moveCommandList.forEach((moveCommand, index, arr) => {
          if (!isValid) return;

          switch (moveCommand) {
            case EMoveType.up: {
              isValid = position.move(EMoveType.up);
              break;
            }
            case EMoveType.right: {
              isValid = position.move(EMoveType.right);
              break;
            }
            case EMoveType.down: {
              isValid = position.move(EMoveType.down);
              break;
            }
            case EMoveType.left: {
              isValid = position.move(EMoveType.left);
              break;
            }
            case EMoveType.block: {
              if (position.checkIsCollision(positions) !== ECollisionType.none)
                isValid = false;
              break;
            }
            case EMoveType.until: {
              p.push(position.no);
              const lastMoveCommand = arr[index - 1];
              const tempPosition = position.copyPosition();
              while (
                tempPosition.checkIsCollision(positions) ===
                  ECollisionType.none &&
                tempPosition.move(lastMoveCommand)
              ) {
                p.push(tempPosition.no);
              }
              isTakeOverByItself = true;
              break;
            }
            case EMoveType.jump: {
              const lastMoveCommand = arr[index - 2];
              const tempPosition = position.copyPosition();
              tempPosition.no = p[p.length - 1];

              if (
                tempPosition.checkIsCollision(positions) !== ECollisionType.none
              ) {
                p.pop();
                while (tempPosition.copyPosition().move(lastMoveCommand)) {
                  tempPosition.move(lastMoveCommand);
                  if (
                    tempPosition.checkIsCollision(positions) !==
                    ECollisionType.none
                  ) {
                    p.push(tempPosition.no);
                    break;
                  }
                }
              }

              isTakeOverByItself = true;
              break;
            }
            default: {
              break;
            }
          }
        });
        if (isValid && !isTakeOverByItself) p.push(position.no);
        return p;
      },
      []
    );
    return this.limitPositions(movablePositions);
  }

  public getMovablePosition(positions: Position[]): number[] {
    let moveCommandLists: EMoveType[][] = [];
    switch (this.role) {
      case ERole.g: {
        moveCommandLists = [
          [EMoveType.left],
          [EMoveType.up],
          [EMoveType.down],
          [EMoveType.right],
        ];
        break;
      }
      case ERole.s: {
        moveCommandLists = [
          [EMoveType.left, EMoveType.up],
          [EMoveType.left, EMoveType.down],
          [EMoveType.right, EMoveType.up],
          [EMoveType.right, EMoveType.down],
        ];
        break;
      }
      case ERole.e: {
        moveCommandLists = [
          [
            EMoveType.left,
            EMoveType.up,
            EMoveType.block,
            EMoveType.left,
            EMoveType.up,
          ],
          [
            EMoveType.left,
            EMoveType.down,
            EMoveType.block,
            EMoveType.left,
            EMoveType.down,
          ],
          [
            EMoveType.right,
            EMoveType.up,
            EMoveType.block,
            EMoveType.right,
            EMoveType.up,
          ],
          [
            EMoveType.right,
            EMoveType.down,
            EMoveType.block,
            EMoveType.right,
            EMoveType.down,
          ],
        ];
        break;
      }
      case ERole.m: {
        moveCommandLists = [
          [EMoveType.left, EMoveType.block, EMoveType.left, EMoveType.up],
          [EMoveType.left, EMoveType.block, EMoveType.left, EMoveType.down],
          [EMoveType.right, EMoveType.block, EMoveType.right, EMoveType.up],
          [EMoveType.right, EMoveType.block, EMoveType.right, EMoveType.down],
          [EMoveType.up, EMoveType.block, EMoveType.up, EMoveType.left],
          [EMoveType.up, EMoveType.block, EMoveType.up, EMoveType.right],
          [EMoveType.down, EMoveType.block, EMoveType.down, EMoveType.left],
          [EMoveType.down, EMoveType.block, EMoveType.down, EMoveType.right],
        ];
        break;
      }
      case ERole.c: {
        moveCommandLists = [
          [EMoveType.left, EMoveType.until],
          [EMoveType.right, EMoveType.until],
          [EMoveType.up, EMoveType.until],
          [EMoveType.down, EMoveType.until],
        ];
        break;
      }
      case ERole.p: {
        moveCommandLists = [
          [EMoveType.left, EMoveType.until, EMoveType.jump],
          [EMoveType.right, EMoveType.until, EMoveType.jump],
          [EMoveType.up, EMoveType.until, EMoveType.jump],
          [EMoveType.down, EMoveType.until, EMoveType.jump],
        ];
        break;
      }
      case ERole.z: {
        moveCommandLists = [
          [EMoveType.left],
          [EMoveType.up],
          [EMoveType.down],
          [EMoveType.right],
        ].filter(([v]) => {
          if (this.color === EColor.b) {
            if (this.no < 45 && v === EMoveType.down) return true;
            if (this.no >= 45 && v !== EMoveType.up) return true;
            return false;
          }
          if (this.color === EColor.r) {
            if (this.no > 44 && v === EMoveType.up) return true;
            if (this.no <= 44 && v !== EMoveType.down) return true;
            return false;
          }
          return true;
        });
        break;
      }
      default: {
        break;
      }
    }

    return this.executeMoveCommand(moveCommandLists, positions);
  }
}
