// console.log("Hola mundo");

// // callbacks -> funciones que pueden pasados como parametros
// // closures -> funciones que devuelven otras funciones

// let contador = function(){
//     let count = 0;
//     return function(){
//         count++;
//         console.log(count);
//     }
// }


// const incrementador = contador();

// console.log(incrementador);


// incrementador();
// incrementador();
// incrementador();
// incrementador();

// // console.log(count);

// const incrementadorClon = contador()

// incrementadorClon();
// incrementadorClon();


// // funciones que son pasados como parametros

// const imprimirMensaje = (nombre, metodoDeSaludo) => {
//     console.log(metodoDeSaludo(nombre));
// }

// const saludoMatina = (nombre) => {
//     return `Buenos dias ${nombre}`;
// }

// const saludoMediaMatina = (nombre) => {
//     return `Buenas Tardes ${nombre}`;
// }

// const saludoNoniNoni = (nombre) => `A dormir vago, ${nombre}`

// //7 am
// imprimirMensaje("Maximo", saludoMatina);
// //12 pm
// imprimirMensaje("Maximo", saludoMediaMatina)
// //9 pm
// imprimirMensaje("Maximo", saludoNoniNoni)



// // Promises

// const promesa = new Promise(
//      (resolve, reject) => {
//         if(true){
//             setTimeout(
//                 () => {
//                     resolve("Esta todo bien")
//                 }
//                 , 2000
//             )

//         }else{
//             reject("Algo salio mal")
//         }
//     }
// )


// console.log(promesa);

// // promesa
// //     .then(
// //         res => console.log(res)
// //     )
    
// //     .catch(
// //         err => console.log(err)
// //     )



// async function exec(){
//         let res = await promesa
//         console.log(res)
//     }


// exec()



// // --> por que nos va a servir cuando tengamos que hacer llamdas a 
// // una api




// // cuando uso estas herramientas de ASync! ???

// // fetch --> es metodo -> utiliza promesas!!

// const URL = "https://jsonplaceholder.typicode.com/posts"


// // fetch(URL , {method: "GET"})
// //     .then( res => res.json() )
// //     .then( data => console.log(data))
// //     .catch( err => console.log(err))



// const getData = async() =>{
//     try {
//         let res = await fetch(URL , {method: "GET"})
//         let data = await res.json()
//         console.log(data)
//         console.log("esto es por funcion async");
        
//     } catch (error) {
//         console.error({error});
//     }
// }

// getData()



// DOM

const btn = document.querySelector("#btn")
const status = document.getElementById("status")
const container = document.querySelector("#container")

// TODO: Validar que ejecute una sola vez
let isExecuted = false

async function loadDataPics(){
    if (isExecuted) return;

    const url = "https://rickandmortyapi.com/api/character"


    btn.disabled = true
    btn.textContent = "Cargando..."

    status.textContent = "Cargando datos desde la api de R&M ..."

    try{

        // esperamos dos segundos
        await new Promise( 
            resolve => setTimeout(resolve, 2000)
        )

        
        let res = await fetch(url)

        if(!res.ok){
            status.textContent = "Error en la peticion"
            throw new Error("Error en la peticion")
        }

        let data = await res.json()

        status.textContent = "Carga Exitosa!"
        isExecuted = true;

        data.results.forEach(
            character => {
                const card = document.createElement("div")
                card.classList.add("card")
                card.classList.add(character.id)
                
                card.innerHTML = `
                <h3>${character.name}</h3>
                <img src="${character.image}" alt="${character.name}">
                `
                container.appendChild(card)
            }
        )

        btn.disabled = true;
        btn.textContent = "Carga Finalizada";
    
    }
    catch(error){
        console.log({error});

        status.textContent = "Error en la peticion"
        btn.disabled = false
       
    }

}





btn.addEventListener("click", loadDataPics)
    













    
