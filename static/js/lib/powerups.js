///////////////////////////////////////////////////////////////////////////////////////////
// POWERUPS CLASS (OBJECT):
/* Health renew
let healthRenew = [];
healthRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
}
let initialHealthPushed = false;

// Shield - player ship shield renewal
let shieldRenew = [];
shieldRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - shieldImage.height) - minHeight) + minHeight)
}
let initialShieldRenewPushed = false;

// Timer(s) array
let timeRenew = [];
timeRenew[0] = {
    x: cWidth,
    y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
}
let initialTimeRenewPushed = false; */

// ------------------------------------------------

// // Spawn health renew every 30 seconds.
// function healthRenewFunction() {
//     if(initialHealthPushed) {
//         setTimeout(() => {
//             healthRenew.push({
//                 x: cWidth,
//                 y: Math.floor(Math.random() * ( (maxHeight - firstAid.height) - minHeight) + minHeight)
//             })
        
//             healthRenewFunction();
//         }, 30 * 1000);
//     } else {
//         setTimeout(() => {
//             healthRenewFunction();
//         }, 30 * 1000);
//     }
// }
// healthRenewFunction();

// // Spawn shield renew every minute
// function shieldRenewFunction() {
//     if(initialShieldRenewPushed) {
//         setTimeout(() => {
//             shieldRenew.push({
//                 x: cWidth,
//                 y: Math.floor(Math.random() * ( (maxHeight - shieldImage.height) - minHeight) + minHeight)
//             })

//             shieldRenewFunction();
//         }, 60 * 1000);
//     } else {
//         setTimeout(() => {
//             shieldRenewFunction();
//         }, 60 * 1000);
//     }
// }
// shieldRenewFunction();

// // Spawn timer to add more time to play every 10-15 seconds
// function timeRenewFunction(){
//     if(initialTimeRenewPushed) {
//         setTimeout(() => {
//             timeRenew.push({
//                 x: cWidth,
//                 y: Math.floor(Math.random() * ( (maxHeight - timerImage.height) - minHeight) + minHeight)
//             })

//             timeRenewFunction();
//             document.querySelector(".time").classList.remove("timeShake");
//         }, 10 * 1000);
//     } else {
//         setTimeout(() => {
//             timeRenewFunction();
//         }, 20 * 1000);
//     }
// }
// timeRenewFunction();