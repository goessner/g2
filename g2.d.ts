// Type definitions for g2 2.0
// Project: https://github.com/goessner/g2
// Definitions by: Stefan Goessner
declare module "g2" {
    export function g2(): g2type;

    declare interface g2type {
        /**
         * Switches to cartesian coordinate system.
         */
        cartesian(): g2type;
        cir(x:number,y:Number,r:Number): g2type; 
    }
}