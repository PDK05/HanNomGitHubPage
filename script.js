(function(){

"use strict";

/* ============================
   PAYLOAD (được build offline)
============================ */

const P = new Uint8Array([
__ENCODED__
]);

const I = new Uint32Array([
__INDEX__
]);

/* ============================
   CUSTOM PRNG
============================ */

function R(seed){
    return function(){
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        return seed >>> 0;
    }
}

/* ============================
   BYTE RESOLVER (không dựng full)
============================ */

function byteAt(pos){

    let kgen = R(0xdeadbeef);

    for(let i=0;i<P.length;i++){

        let k = kgen() & 0xFF;
        let v = (P[i] - (i % 251)) & 0xFF;
        let originalIndex = I[i];

        if(originalIndex === pos){
            return v ^ k;
        }
    }

    return 0;
}

/* ============================
   LAZY LINE READER
============================ */

function search(query){

    let decoder = new TextDecoder();
    let buffer = [];
    let results = [];
    let temp = [];

    for(let pos=0; pos<P.length; pos++){

        let b = byteAt(pos);

        if(b === 10){ // newline

            let line = decoder.decode(new Uint8Array(temp));
            if(line.includes(query)){
                results.push(line);
            }

            temp.length = 0;

        }else{
            temp.push(b);
        }
    }

    return results;
}

/* ============================
   UI BIND
============================ */

window.secureSearch = function(){

    const q = document.getElementById("q").value;
    const res = search(q);

    document.getElementById("out").textContent =
        res.join("\n");

}

/* ============================
   OPTIONAL MEMORY SCRUB
============================ */

function wipe(){
    for(let i=0;i<P.length;i++){
        P[i] = 0;
    }
}

})();
