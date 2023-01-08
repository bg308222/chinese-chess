/*
                        <0
             0  1  2  3  4  5  6  7  8 => /9=0 => same row
             9 10 11 12 13 14 15 16 17 => /9=1
            18 19 20 21 22 23 24 25 26 => /9=2
            27 28 29 30 31 32 33 34 35
            36 37 38 39 40 41 42 43 44
            45 46 47 48 49 50 51 52 53  
            54 55 56 57 58 59 60 61 62
            63 64 65 66 67 68 69 70 71
            72 73 74 75 76 77 78 79 80
            81 82 83 84 85 86 87 88 89
            || || ||    >89
            %9 %9 %9
            0  1  2 => same column
*/

export enum ERole {
    g = "g",
    s = "s",
    e = "e",
    c = "c",
    m = "m",
    p = "p",
    z = "z",
    none =  "n",
}

export enum EColor {
    r = "r",
    b = "b",
    none = "n"
}

export enum EStatus {
     selected = 0,
     movable = 1,
     hover = 2,
     eatable = 3,
     none = 4
}

export enum EMoveType {
    up = 0,
    left = 1,
    down = 2,
    right = 3,
    block = 4,
    until = 5,
    jump = 6,
}

export enum ECollisionType {
    union = 0,
    enemy = 1,
    none = 2,
}