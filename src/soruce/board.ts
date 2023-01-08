import React from "react";
import { Position } from "./position";
import { EColor, ERole, EStatus } from "./type";

export class Board {
    
    public originPositions: Position[] = [
        //black
        new Position(0,  ERole.c,  EColor.b),
        new Position(1,  ERole.m,  EColor.b),
        new Position(2,  ERole.e,  EColor.b),
        new Position(3,  ERole.s,  EColor.b),
        new Position(4,  ERole.g,  EColor.b),
        new Position(5,  ERole.s,  EColor.b),
        new Position(6,  ERole.e,  EColor.b),
        new Position(7,  ERole.m,  EColor.b),
        new Position(8,  ERole.c,  EColor.b),

        new Position(9,  ERole.none,  EColor.none),
        new Position(10,  ERole.none,  EColor.none),
        new Position(11,  ERole.none,  EColor.none),
        new Position(12,  ERole.none,  EColor.none),
        new Position(13,  ERole.none,  EColor.none),
        new Position(14,  ERole.none,  EColor.none),
        new Position(15,  ERole.none,  EColor.none),
        new Position(16,  ERole.none,  EColor.none),
        new Position(17,  ERole.none,  EColor.none),

        new Position(18,  ERole.none,  EColor.none),
        new Position(19,  ERole.p,  EColor.b),
        new Position(20,  ERole.none,  EColor.none),
        new Position(21,  ERole.none,  EColor.none),
        new Position(22,  ERole.none,  EColor.none),
        new Position(23,  ERole.none,  EColor.none),
        new Position(24,  ERole.none,  EColor.none),
        new Position(25,  ERole.p,  EColor.b),
        new Position(26,  ERole.none,  EColor.none),

        new Position(27,  ERole.z,  EColor.b),
        new Position(28,  ERole.none,  EColor.none),
        new Position(29,  ERole.z,  EColor.b),
        new Position(30,  ERole.none,  EColor.none),
        new Position(31,  ERole.z,  EColor.b),
        new Position(32,  ERole.none,  EColor.none),
        new Position(33,  ERole.z,  EColor.b),
        new Position(34,  ERole.none,  EColor.none),
        new Position(35,  ERole.z,  EColor.b),

        new Position(36,  ERole.none,  EColor.none),
        new Position(37,  ERole.none,  EColor.none),
        new Position(38,  ERole.none,  EColor.none),
        new Position(39,  ERole.none,  EColor.none),
        new Position(40,  ERole.none,  EColor.none),
        new Position(41,  ERole.none,  EColor.none),
        new Position(42,  ERole.none,  EColor.none),
        new Position(43,  ERole.none,  EColor.none),
        new Position(44,  ERole.none,  EColor.none),

        //red 
        new Position(45,  ERole.none,  EColor.none),
        new Position(46,  ERole.none,  EColor.none),
        new Position(47,  ERole.none,  EColor.none),
        new Position(48,  ERole.none,  EColor.none),
        new Position(49,  ERole.none,  EColor.none),
        new Position(50,  ERole.none,  EColor.none),
        new Position(51,  ERole.none,  EColor.none),
        new Position(52,  ERole.none,  EColor.none),
        new Position(53,  ERole.none,  EColor.none),

        new Position(54,  ERole.z,  EColor.r),
        new Position(55,  ERole.none,  EColor.none),
        new Position(56,  ERole.z,  EColor.r),
        new Position(57,  ERole.none,  EColor.none),
        new Position(58,  ERole.z,  EColor.r),
        new Position(59,  ERole.none,  EColor.none),
        new Position(60,  ERole.z,  EColor.r),
        new Position(61,  ERole.none,  EColor.none),
        new Position(62,  ERole.z,  EColor.r),

        new Position(63,  ERole.none,  EColor.none),
        new Position(64,  ERole.p,  EColor.r),
        new Position(65,  ERole.none,  EColor.none),
        new Position(66,  ERole.none,  EColor.none),
        new Position(67,  ERole.none,  EColor.none),
        new Position(68,  ERole.none,  EColor.none),
        new Position(69,  ERole.none,  EColor.none),
        new Position(70,  ERole.p,  EColor.r),
        new Position(71,  ERole.none,  EColor.none),

        new Position(72,  ERole.none,  EColor.none),
        new Position(73,  ERole.none,  EColor.none),
        new Position(74,  ERole.none,  EColor.none),
        new Position(75,  ERole.none,  EColor.none),
        new Position(76,  ERole.none,  EColor.none),
        new Position(77,  ERole.none,  EColor.none),
        new Position(78,  ERole.none,  EColor.none),
        new Position(79,  ERole.none,  EColor.none),
        new Position(80,  ERole.none,  EColor.none),

        new Position(81,  ERole.c,  EColor.r),
        new Position(82,  ERole.m,  EColor.r),
        new Position(83,  ERole.e,  EColor.r),
        new Position(84,  ERole.s,  EColor.r),
        new Position(85,  ERole.g,  EColor.r),
        new Position(86,  ERole.s,  EColor.r),
        new Position(87,  ERole.e,  EColor.r),
        new Position(88,  ERole.m,  EColor.r),
        new Position(89,  ERole.c,  EColor.r),
    ]

    private positions: Position[]
    private setter?: React.Dispatch<React.SetStateAction<Position[]>>

    constructor() {
        this.positions =  this.originPositions;
    }

    public setSetter(setter: React.Dispatch<React.SetStateAction<Position[]>>) {
        this.setter = setter;
    }

    public clearStatus() {
        this.positions.forEach((position)=>{
            position.status = EStatus.none
        })
    }

    public handleSelect(target: number) {
        this.clearStatus()

        const position = this.positions[target]
        if (position.role === ERole.none) {
            return;
        };

        /* const movablePosition = */  position.getMovablePosition(this.positions)
        
        position.status = EStatus.selected;
    }

    public render() {
        if(this.setter) this.setter([...this.positions])
    }
}