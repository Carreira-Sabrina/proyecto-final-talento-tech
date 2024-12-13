import {
    generarHTMLProductos,
    obtenerCategorias,
    poblarSelectorCategorias
} from "./utilidadesCargaDinamica.js"

import {
    guardarCarritoEnLocalStorage,
    cargarCarritoDeLocalStorage,
    actualizarNumeroProductosCarrito
} from "./utilidadesCarrito.js"


//Capturar elementos HTML
//========================================================================================

//El div donde se generan dinamicamente las tarjetas de productos
const contenedorProductos = document.getElementById("contenedor-productos")


//El elemento select cuyas option se poblaran dinamicamente en base a las categorías que vengan de la API
const selectorCategorias = document.getElementById("selector-categorias")

//Acá se almacenarán los botones de agregar al carrito generados dinámicamente
let botonesAgregarAlCarrito = [];

//El span donde se muestra la cantidad de productos que hay en el carrito de compras en el <nav>
const numeroCarrito = document.getElementById("numero-carrito");


//Hacer fetch de la API
//=========================================================================================

//URL de una API
const URL_API = "https://fakestoreapi.com/products"



//Trae y devuelve los datos de la api que se almacenan para generar contenido dinamicamente
//REESCRIBIR CON TRY - CATCH !! 🦜🦜🦜🦜🦜🦜🦜🦜🦜🦜🦜⛔

async function traerDatosAPI(){
    const respuestaAPI = await fetch(URL_API);
    const respuestaAPIJson = await respuestaAPI.json();
    return respuestaAPIJson;

}

const productos = await traerDatosAPI(); 


//Generar contenido dinamicamente
//=========================================================================================

//Poblar el select
poblarSelectorCategorias(selectorCategorias,obtenerCategorias(productos));


// Generar los productos dinámicamente
generarHTMLProductos(productos,contenedorProductos);
//Capturar los botones
//botonesAgregarAlCarrito = document.querySelectorAll(".tarjeta-producto-agregar"); 

//Agregar los eventListener
prepararBotonesAgregarCarrito()


//El carrito o bien empieza vacío o bien trae algo del localStorage
let contenidoCarritoCompras = cargarCarritoDeLocalStorage();
let carritoCompras = contenidoCarritoCompras || [];

//Funciones para agregar los botones de agregar producto al carrito
//===============================================================================

//Los botones de agregar carrito se generan tambien dinámicamente
// Hay un temita con el onclick DEL HTML Y LOS SCRIPTS DE type= module ASI QUE HAY QUE USAR eventListeners con los botones y volver a asignarlos cada vez que hay un refresh

export function prepararBotonesAgregarCarrito(){
    //Capturar botones
    botonesAgregarAlCarrito = document.querySelectorAll(".tarjeta-producto-agregar"); 
    

    //Agregar event listener

    botonesAgregarAlCarrito.forEach((boton)=> boton.addEventListener("click",agregarProductoAlCarrito))
}

//Callback del eventListener de los botones

function agregarProductoAlCarrito(e){
    /*WORK IN PROGRESS */

    const id = e.target.id;
    //POR ALGUNA RAZON NO ME FUNCIONA CON ===
    const producto = productos.find((producto)=> producto.id == id)


    //PRIMERO TENGO QUE SABER SI EL PRODUCTO EXISTE EN EL CARRITO:
    if (carritoCompras.includes(producto)){
        console.log("EL PRODUCTO YA EXISTE EN EL CARRITO")
        producto.cantidad +=1;
        

    }else{
        //Como que deberia agregar una propiedad cantidad al objeto MMMMMMM
        producto.cantidad = 1
        carritoCompras.push(producto)
    }

    console.log("**** HASTA AHORA EN EL CARRITO HAY: *******")
    console.log(carritoCompras)

    // ACTUALIZAR EL NUMERITO DEL CARRITO

    actualizarNumeroProductosCarrito(numeroCarrito,carritoCompras)

    //DE TODAS MANERAS HAY QUE ACTUALIZAR EL CARRITO EN EL LOCAL STORAGE
    guardarCarritoEnLocalStorage(carritoCompras);
}

//=====================================================================================================================



//Filtrar los productos por categoría con el select (callback para el event listener)
function filtarProductosPorCategoria(categoria){
    if(categoria === "todos"){
        return productos
    }
    else{
        return productos.filter((producto)=> producto.category === categoria)
    }
}


// Callback del eventListener del <select>
function mostrarProductosPorCategoria(e){
    let categoria = e.target.value;
    let productosFiltrados = filtarProductosPorCategoria(categoria)
    generarHTMLProductos(productosFiltrados,contenedorProductos)
    prepararBotonesAgregarCarrito()
}


//Event listener del <select> NO PONGAS EL e ACA 🤦‍♀️🤦‍♀️🤦‍♀️🤦‍♀️

selectorCategorias.addEventListener("change",mostrarProductosPorCategoria)



//Funcion auxiliar para convertir palabras con la primera letra en mayuscula porque JS tiene tanto pero no capitalize 
function capitalizarPalabra(palabra){
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}















