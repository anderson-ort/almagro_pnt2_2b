// en esta clase vamos a ver la parte practica como hacemos uso de estas tecnicas simples de JS

// CallBacks
// Un callback es simplemente una función que se pasa como parámetro a otra función, y se ejecuta en cierto momento.
// En tu web, podrías imaginar un “callback” cuando alguien hace clic en un ticket.

function comprarTicket(ciudad, callback) {
    console.log(`Procesando compra para ${ciudad}...`);
    // simulamos demora con setTimeout
    setTimeout(() => {
        console.log(`Compra confirmada en ${ciudad}`);
        callback(); // ejecutamos el callback
    }, 2000);
}



const mostrarMensaje = (texto) => {
    const msgDiv = document.querySelector(".mensaje");
    msgDiv.textContent = texto;
}

const ticketByEmail = () => {
    mostrarMensaje("🎉 ¡Te llega el mail con la entrada!");
};


const ticketByWhatsApp = () => {
    mostrarMensaje("🎉 ¡Te llega el ticket por whatsapp!")
};


const btnEmail = document.querySelector(".btn-email");
const btnWhatsApp = document.querySelector(".btn-whatsapp");

btnEmail.addEventListener("click", (e) => {
    const ciudad = e.target.dataset.ciudad;
    comprarTicket(ciudad, ticketByEmail);
});

btnWhatsApp.addEventListener("click", (e) => {
    const ciudad = e.target.dataset.ciudad;
    comprarTicket(ciudad, ticketByWhatsApp);
});

// podriamos armarlo tambien para rosario


// Clousures
// Un closure es cuando una función “recuerda” el scope donde fue creada, incluso si se ejecuta en otro contexto.

let buenosAiresTickets = 100;
let rosarioTickets = 50;

const counterBA = document.querySelector(".ticket.baires .counter");
counterBA.textContent = buenosAiresTickets; // valor inicial

const counterRosario = document.querySelector(".ticket.rosario .counter");
counterRosario.textContent = rosarioTickets; // valor inicial

const crearContadorTickets = (tickets) => {
    return () => {
        if (tickets > 0) {
            tickets--;
            console.log(`🎫 Ticket vendido, quedan ${tickets}`);
            return tickets;
        } else {
            console.log("❌ Tickets agotados");
            return undefined;
        }
    };
};



// Creamos dos closures independientes
const venderBuenosAires = crearContadorTickets(buenosAiresTickets);
const venderRosario = crearContadorTickets(rosarioTickets); // supongamos 50 tickets


btnEmail.addEventListener("click", () => {
    const restantes = venderBuenosAires();
    const counterBA = document.querySelector('.ticket.baires .counter');
    if (restantes !== undefined) {
        setTimeout(() => { counterBA.textContent = restantes }, 2000)
    }
});

btnWhatsApp.addEventListener("click", () => {
    const restantes = venderBuenosAires();
    const counterBA = document.querySelector('.ticket.baires .counter');
    if (restantes !== undefined) {
        setTimeout(() => { counterBA.textContent = restantes }, 2000)
    }
});


// HOF
// Son funciones que reciben o retornan otras funciones. Muy útil para procesar listas, por ejemplo, las ciudades donde hay shows.
const shows = [
    { ciudad: "Mendoza", fecha: "05/12/2025" },
    { ciudad: "Bariloche", fecha: "10/12/2025" },
    { ciudad: "Salta", fecha: "17/12/2025" },
    { ciudad: "Mar del Plata", fecha: "22/12/2025" },
    { ciudad: "Tucumán", fecha: "15/01/2026" },
    { ciudad: "Neuquén", fecha: "21/01/2026" },
    { ciudad: "Corrientes", fecha: "28/01/2026" },
    { ciudad: "La Plata", fecha: "05/02/2026" },
    { ciudad: "Ushuaia", fecha: "12/02/2026" },
    { ciudad: "San Juan", fecha: "19/02/2026" },
];

// const renderShows = (lista) => {
//     return lista
//         .map(
//             (show) => `
//         <div class="show-item">
//           <h3>${show.ciudad}</h3>
//           <p>📅 ${show.fecha}</p>
//         </div>
//       `
//         )
//         .join(""); // une todo en un string
// };


// const nextShowsDiv = document.querySelector(".shows-display .logo"); 
// nextShowsDiv.addEventListener("click", () => { const container = document.querySelector(".next-shows"); container.innerHTML = renderShowsRestApi(shows) })


// usando async-await
const url = new URL('https://68adf41ca0b85b2f2cf52bfc.mockapi.io/api/v1/cities/shows');
url.searchParams.append('page', 1);
url.searchParams.append('limit', 5);

const getShowsSeaShores = () =>
    fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            const container = document.querySelector(".next-shows");
            container.innerHTML = renderShowsRestApi(data);
            
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

// render function
const renderShowsRestApi = (lista) => {
    return lista
        .map(
            (show) => `
        <div class="show-item">
          <h3>${show.name}</h3>
          <p>📅 ${show.date}</p>
        </div>
      `
        )
        .join("");
};

// inject into DOM
const nextShowsDiv = document.querySelector(".shows-display .logo");

nextShowsDiv.addEventListener("click", getShowsSeaShores)