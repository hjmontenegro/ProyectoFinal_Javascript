/*
Programa para comprar productos de almacen
*/

let maestroCategorias = [
    { id: 1, nombre: "almacen"  },
    { id: 2, nombre: "kiosco"  },
    { id: 3, nombre: "indumentaria"  },
    { id: 4, nombre: "lacteos"  }
];

let listaProductos = [
    { id: 1, nombre: "Harina", categoria: 1, stock: 3, precio: 7300, rutaImagen: "harina.jpeg" },
    { id: 2, nombre: "Fideos", categoria: 1, stock: 8, precio: 5600, rutaImagen: "fideos.jpg" },
    { id: 3, nombre: "Arroz", categoria: 1, stock: 2, precio: 5000, rutaImagen: "arroz.jpg" },
    { id: 4, nombre: "Coca Cola 2l", categoria: 1, stock: 4, precio: 4500, rutaImagen: "coca-cola-dosl.jpg" },

    { id: 5, nombre: "Coca cola 1/2l", categoria: 2, stock: 1, precio: 2800, rutaImagen: "coca-cola-mediol.jpg" },
    { id: 6, nombre: "Alfajor", categoria: 2, stock: 7, precio: 2650, rutaImagen: "alfajor.jpg" },
    { id: 7, nombre: "Chocolate", categoria: 2, stock: 7, precio: 2650, rutaImagen: "chocolate.jpg" },
    { id: 8, nombre: "Galletitas", categoria: 2, stock: 3, precio: 7300, rutaImagen: "galletitas.jpg" },

    { id: 9, nombre: "Short", categoria: 3, stock: 8, precio: 5600, rutaImagen: "short.jpg" },
    { id: 10, nombre: "Zapatillas", categoria: 3, stock: 2, precio: 5000, rutaImagen: "zapatillas.jpg" },
    { id: 11, nombre: "Remera", categoria: 3, stock: 4, precio: 4500, rutaImagen: "remera.jpg" },
    { id: 12, nombre: "Campera", categoria: 3, stock: 1, precio: 2800, rutaImagen: "campera.jpg" },

    { id: 13, nombre: "Leche", categoria: 4, stock: 7, precio: 2650, rutaImagen: "leche.jpg" },
    { id: 14, nombre: "Yogurt", categoria: 4, stock: 7, precio: 2650, rutaImagen: "yogurt.jpg" },
    { id: 15, nombre: "Manteca", categoria: 4, stock: 7, precio: 2650, rutaImagen: "manteca.jpg" },
    { id: 16, nombre: "Salchichas", categoria: 4, stock: 7, precio: 2650, rutaImagen: "Salchichas.jpg" },
];


principal(maestroCategorias, listaProductos);

function principal(mCategorias, lProductos) {

    let carrito = [];
  
    let botonVerCarrito = document.getElementById("botonVerCarrito");
    botonVerCarrito.addEventListener("click", (e) => mostrarOcultar(e, carrito));

    let botonBuscar = document.getElementById("botonBuscar");
    botonBuscar.addEventListener("click", function() {
        let cCategoria = document.getElementById("select-categoria");
        let iBusqueda = document.getElementById("input-entrada");

        renderizarProductos(lProductos, mCategorias, carrito, cCategoria.value, iBusqueda.value);
    });

    let botonLimpiar = document.getElementById("botonLimpiar");
    botonLimpiar.addEventListener("click", function() {
        let cCategoria = document.getElementById("select-categoria");
        let iBusqueda = document.getElementById("input-entrada");

        cCategoria.selectedIndex = 0; 
        iBusqueda.value = "";

        renderizarProductos(lProductos, mCategorias, carrito);
    });
    
    CargarMaestroCategorias(mCategorias);
    renderizarProductos(lProductos, mCategorias, carrito);
}

function mostrarOcultar(e) {
    let contenedorProductos = document.getElementById("contenedorProductos");
    let contenedorCarrito = document.getElementById("contenedorCarrito");
    let botonBuscar = document.getElementById("botonBuscar");

    // toggle
    contenedorProductos.classList.toggle("oculto");
    contenedorCarrito.classList.toggle("oculto");

    if (e.target.innerText === "Ver Carrito") {
        e.target.innerText = "Ver Productos";
        botonBuscar.disabled = true; 
    } else {
        e.target.innerText = "Ver Carrito";
        botonBuscar.disabled = false; 
    }
}


function filtrarCategoria(mCategorias, idCategoria) {
    return mCategorias.filter(categoria => categoria.id === idCategoria);
}

function filtrarProductosxSeleccion(lProductos, categoria = null, seleccion = null) {
    let fProductos = lProductos;
    
    if (categoria != null && categoria != "")
        fProductos =  fProductos.filter(producto => producto.categoria === Number(categoria));

    if (seleccion != null && seleccion != "")
        fProductos = fProductos.filter(producto => producto.nombre.includes(seleccion) );

    return fProductos;
}

function existeCategoria(mCategorias, idCategoria) {
    let categoriaSel = mCategorias.filter(categoria => categoria.id === idCategoria);

    if(categoriaSel.length === 0)
        return true;
    else
        return false;
}

function CargarMaestroCategorias(mCategorias) {
    agregarOptions("select-categoria", mCategorias);
}

//Función para agregar opciones a un <select>.
function agregarOptions(domElement, array) {
    let selector = document.getElementsByName(domElement)[0];
    for (categoria in array) {
        let opcion = document.createElement("option");
        let palabra = array[categoria].nombre;
        opcion.text = palabra.charAt(0).toUpperCase() + palabra.slice(1);
        // Añadimos un value a los option para hacer mas facil escoger los pueblos
        opcion.value = array[categoria].id;
        selector.add(opcion);
    }
}

function renderizarProductos(lproductos, mCategorias, carrito, categoria = null, seleccion = null) {
    let contenedorProductos = document.getElementById("lista-productos");
    contenedorProductos.innerHTML = "";

    let vcategoria = "";
    let fProductos = filtrarProductosxSeleccion(lproductos, categoria, seleccion);

    fProductos.forEach(producto => {
        
        let tarjetaProducto = document.createElement("div");
        
        tarjetaProducto.className = "productos";
        tarjetaProducto.innerHTML = `
            <img src="./images/productos/${producto.rutaImagen}" />
            <h3>${producto.nombre}</h3>
            <h4>$ ${producto.precio}</h4>
            <p>Disponible: ${producto.stock}</p>
            <button name=${producto.id} id=botonCarrito${producto.id} class='btn btn-primary btn-sm' type='button'>Comprar</button>
        `;
        
        let seleccion = Number(producto.categoria);

        if (vcategoria != producto.categoria)
            {
                
                let lcategoria = filtrarCategoria(maestroCategorias, seleccion);
                let divTitulo = document.createElement("div");
                
                let nombreCategoria = lcategoria[0].nombre;
                nombreCategoria = nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1);

                divTitulo.innerHTML = `Listado Productos ${nombreCategoria}`;
                divTitulo.className = "separadorTitulo";
                contenedorProductos.appendChild(divTitulo);
                //contenedorProductos.appendChild(tarjetaSeccion); 
            }

            contenedorProductos.appendChild(tarjetaProducto);
        
            let botonAgregarAlCarrito = document.getElementById("botonCarrito" + producto.id);
            if(producto.stock <= 0)
            {
                botonAgregarAlCarrito.disabled = true;
            }
            else
                botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(e, carrito, lproductos, mCategorias));

            vcategoria = `${producto.categoria}`;

        
    });
}

function agregarProductoAlCarrito(e, carrito, lproductos, mCategorias) {
    let idDelProducto = Number(e.target.name);
    let cCategoria = document.getElementById("select-categoria");
    let iBusqueda = document.getElementById("input-entrada");
    let productoBuscado = lproductos.find(producto => producto.id === idDelProducto);
    let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto);
    let posicionProductoEnProducto = lproductos.findIndex(producto => producto.id === idDelProducto);
    
    lproductos[posicionProductoEnProducto].stock--;

    if (posicionProductoEnCarrito !== -1) {
        carrito[posicionProductoEnCarrito].unidades++;
        carrito[posicionProductoEnCarrito].stock--;
        carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].precioUnitario * carrito[posicionProductoEnCarrito].unidades;    
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            stock: productoBuscado.stock - 1, //el stock deberia modificarse en la lista de productos, pero para este ejemplo lo hago en el carrito
            subtotal: productoBuscado.precio
        })
    }

    //return carrito;

    renderizarProductos(lproductos, mCategorias, carrito, cCategoria.value, iBusqueda.value);
    renderizarCarrito(carrito);
}

function renderizarCarrito(carrito) {
    let contenedorCarrito = document.getElementById("tablita");
    let sumaTotal = 0;
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto => {
        let tarjetaProductoCarrito = document.createElement("div");
        tarjetaProductoCarrito.className = "tarjetaProductoCarrito";
        tarjetaProductoCarrito.id = `tarjetaProductoCarrito${producto.id}`;

        let fila = `
        <tr>
        <td><p>${producto.nombre}</p></td>
        <td><p>${producto.precioUnitario}</p></td>
        <td><p>${producto.unidades}</p></td>
        <td><p>$ ${producto.subtotal}</p></td>
        <td><button id=eliminar${producto.id} class='btn btn-primary btn-sm' type='button' disabled>ELIMINAR</button></td>
        </tr>
        `;
        sumaTotal +=  producto.subtotal;

        contenedorCarrito.innerHTML += fila;

        let botonEliminar = document.getElementById(`eliminar${producto.id}`);
        botonEliminar.addEventListener("click", eliminarProductoDelCarrito);
    });

    let total = `
    <tr>
        <td colspan=2> &nbsp;</td>
        <td><p style='font-weight: bolder;'>TOTAL</p></td>
        <td><p style='font-weight: bolder;'>$ ${sumaTotal}</p></td>
    </tr>
    `;

    contenedorCarrito.innerHTML += total;
}

function eliminarProductoDelCarrito(e) {
   //e.target.parentElement.remove()
}