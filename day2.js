// // //callback function
// // function hello( n1,n2,callback){
// //     console.log("Hello, World! asynchronous");
 

// // }
// // let a=10;
// // let b=20;
// // function sayhi(){
// //     console.log("callback function");
// // }
// // hello(a,b,sayhi());
// // function good(){
// //     console.log("good afternoon");
// // }


// function hello(n1,n2,callback){
// console.log("hello world");
// callback();
// }
// let a=10;
// let b=20;
// console.log(hello(a,b,sayHi));
// console.log(hello(a,b,sayHello));

// console.log(hello(a,b, function demo(){
// console.log("callback is calling");
// }))


// function sayHi(){
//     console.log("call back");

// }
// sayHi();

// function sayHello(){
// console.log("this is 2nd callback function");
// }
// sayHello();
function hello(n1,n2,callback){
console.log("hello world");
callback();
}
let a=10;
let b=20;
console.log(hello(a,b,sayHi));
console.log(hello(a,b,sayHello));

console.log(hello(a,b, function demo(){
console.log("callback is calling");
}))


function sayHi(){
    console.log("call back");

}
sayHi();

function sayHello(){
console.log("this is 2nd callback function");
}
sayHello();
