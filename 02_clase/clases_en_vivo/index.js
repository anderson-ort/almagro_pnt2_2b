// alert("Todo buenisimo!");


// variables --> const  --> No func
// lexical scoping 
// var 
// block scoping
// let & const //  {}

let nombre = "Marco Antonio Solis"
// const  ...

const body = document.body

// crear un elemnto
// No me a permitir cambiar el datatype!!!! NEVER!!
const parrafo = document.createElement("p")

parrafo.innerText = "As it is generally not recommended to mix the structure of the page (written in HTML) and manipulation of the DOM (written in JavaScript), the JavaScript parts will be grouped together here, and separated from the HTML."

console.log(parrafo);

body.appendChild(parrafo)


const newBox = document.createElement("div")
newBox.innerHTML = `
 <h1> Hola </h1>
 <pre>Soy parte del nuevo div</pre>
 `

 body.appendChild(newBox)



// datos primitivos undefined , null bool number symbol string
// function objeto Number() Map() Array()

let listaNombres =  ["Agusto","Emma", "2pac"]
console.log(listaNombres.join("--"))


Array.prototype.contame = function(){
    console.log("Te cuento un chisme de arrays") 
}



listaNombres.contame()


let soyUnNumero = 1;
let soyUnString = "1";

// igual no estricta 
console.log(  soyUnNumero == soyUnString); 

// igualdad estricta!
console.log(  soyUnNumero === soyUnString); 


console.log( "5" - 2) // 3
console.log( "5" + 2) // 7 || 52
console.log( 5 * "2") // 10
console.log( "5" * 2) // 10
console.log( 5 / "2") // 2.5 
console.log( 5 / "-1") // 2.5  // NaN

// functions --  arrays | map | class --> incorporado a  front!! 

// void  nil null 
// n parametros

function holaMundo( ...nParams){
    return "Hola mundo\n" + nParams.join("\t")
}


// arrow functions

// funciones anonimas // Java --> 
const holaMundoVersionFlecha = (...nParams) => "Hola mundo\n" + nParams.join("\t")

const holaMundoAnonima = function(...nParams) {
    return "Hola mundo\n" + nParams.join("\t")
}



console.log(holaMundo(1,2,3,4,5))
console.log(holaMundoVersionFlecha(1,2,3,4,5))
console.log(holaMundoAnonima(1,2,3,4,5))


// callbacks | alementos asyncs

// funciones de primer dentro de elementos como arrays
const dType = [1,2,3,4 , "ola k ase?", ()=>"ola k ase?", new Map(), new Array()]


console.log(dType)


dType.forEach(
    elemento => console.log(typeof(elemento))
)



const retornoArray = dType.map(
    elemento => typeof(elemento)
)


console.log(retornoArray)



const nombres = [
  "Juan",
  "María",
  "Lucas",
  "Sofía",
  "Mateo",
  "Valentina",
  "Nicolás",
  "Camila",
  "Tomás",
  "Martina",
  "Joaquín",
  "Paula",
  "Agustín",
  "Delfina",
  "Santiago",
  "Florencia",
  "Benjamín",
  "Julieta",
  "Lautaro",
  "Abril"
];



const renderData = (nombre) => {
    const body = document.body
    const marquee = document.createElement("marquee")
    marquee.innerHTML = `<strong>${nombre}<strong>`

    body.appendChild(marquee)
    console.log("El objeto fue renderizado");
    
}




nombres.forEach(renderData)