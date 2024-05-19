/*
Programa para comprar productos de almacen
*/
const obtenerCarritoLS = () => JSON.parse(localStorage.getItem("carrito")) || []

principal();

async function principal() {

    const mCategorias = await pedirInfoCategorias();
    const lProductos = await pedirInfoProductos();

    //console.log(JSON.stringify(mCategorias));
    //let carrito = [];

    let botonVerCarrito = document.getElementById("botonVerCarrito");
    botonVerCarrito.addEventListener("click", function (e) {
        mostrarOcultar(e, lProductos, mCategorias);
    });

    let botonBuscar = document.getElementById("botonBuscar");
    botonBuscar.addEventListener("click", function () {
        let cCategoria = document.getElementById("select-categoria");
        let iBusqueda = document.getElementById("input-entrada");

        renderizarProductos(lProductos, mCategorias, cCategoria.value, iBusqueda.value.toLowerCase());
    });

    let botonLimpiar = document.getElementById("botonLimpiar");
    botonLimpiar.addEventListener("click", function () {
        limpiarCamposBusqueda();
        renderizarProductos(lProductos, mCategorias);
    });

    let botonLimpiarCarrito = document.getElementById("btn-limpiar-carrito");
    botonLimpiarCarrito.addEventListener("click", function () {
        localStorage.removeItem("carrito");
        renderizarCarrito(lProductos, mCategorias);
    });

    

    let botonPagar = document.getElementById("btn-pagar");
    botonPagar.addEventListener("click", function () {
        let carrito = obtenerCarritoLS();

        if (carrito.length > 0)
        {
        swal({
            title: "¿Confirma el Pago?",
            //text: "Si confirma el envío, nos pondremos en contacto a la brevedad.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                swal("Pago Realizado", {
                icon: "success",
                });
                localStorage.removeItem("carrito");
                renderizarCarrito(lProductos, mCategorias);
            } else {
                swal("Pago Cancelado", {icon: "warning"});
                
            }
        });
    } else {
        swal("Carrito Vacio", {
            icon: "error",
            });
    }

        
        
    });
    CargarMaestroCategorias(mCategorias);
    renderizarProductos(lProductos, mCategorias);
}

async function pedirInfoCategorias() {
    try {
        const response = await fetch("./js/data/maestros/Categorias.json");
        return await response.json();
    } catch (error) {
        console.log("Algo salio mal");
    }
}

async function pedirInfoProductos() {
    try {
        const response = await fetch("./js/data/Productos.json");
        return await response.json();
    } catch (error) {
        console.log("Algo salio mal");
    }
    //}

}

function mostrarOcultar(e, lProductos, mCategorias) {
    let contenedorProductos = document.getElementById("contenedorProductos");
    let contenedorCarrito = document.getElementById("contenedorCarrito");
    let botonBuscar = document.getElementById("botonBuscar");
    let botonLimpiar = document.getElementById("botonLimpiar");

    limpiarCamposBusqueda();

    // toggle
    contenedorProductos.classList.toggle("oculto");
    contenedorCarrito.classList.toggle("oculto");

    if (e.target.innerText === "Ver Carrito") {
        e.target.innerText = "Ver Productos";
        botonBuscar.disabled = true;
        botonLimpiar.disabled = true;

        renderizarCarrito(lProductos, mCategorias);
    } else {
        e.target.innerText = "Ver Carrito";
        botonBuscar.disabled = false;
        botonLimpiar.disabled = false;

        renderizarProductos(lProductos, mCategorias);
    }
}

function limpiarCamposBusqueda() {
    let cCategoria = document.getElementById("select-categoria");
    let iBusqueda = document.getElementById("input-entrada");

    cCategoria.selectedIndex = 0;
    iBusqueda.value = "";
}

function filtrarCategoria(mCategorias, idCategoria) {
    return mCategorias.filter(categoria => categoria.id === idCategoria);
}

function filtrarProductosxSeleccion(lProductos, categoria = null, seleccion = null) {
    let fProductos = lProductos;

    if (categoria != null && categoria != "")
        fProductos = fProductos.filter(producto => producto.categoria === Number(categoria));

    if (seleccion != null && seleccion != "")
        fProductos = fProductos.filter(producto => producto.nombre.toLowerCase().includes(seleccion));

    return fProductos;
}

function existeCategoria(mCategorias, idCategoria) {
    let categoriaSel = mCategorias.filter(categoria => categoria.id === idCategoria);

    if (categoriaSel.length === 0)
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

function renderizarProductos(lproductos, mCategorias, categoria = null, seleccion = null) {
    let carrito = obtenerCarritoLS();
    let contenedorProductos = document.getElementById("lista-productos");
    contenedorProductos.innerHTML = "";

    let vcategoria = "";
    let fProductos = filtrarProductosxSeleccion(lproductos, categoria, seleccion);

    fProductos.forEach(producto => {

        let tarjetaProducto = document.createElement("div");
        let posicionProductoEnCarrito = carrito.findIndex(icarrito => icarrito.id === producto.id);
        let cantidadEnCarrito = (posicionProductoEnCarrito == -1) ? 0 : carrito[posicionProductoEnCarrito].unidades;

        tarjetaProducto.className = "productos";
        tarjetaProducto.innerHTML = `
            <img src="./images/productos/${producto.rutaImagen}" />
            <h3>${producto.nombre}</h3>
            <h4>$ ${producto.precio}</h4>
            <p>Disponible: ${producto.stock - cantidadEnCarrito}</p>
            <button name=${producto.id} id=botonCarrito${producto.id} class='btn btn-primary btn-sm' type='button'>Comprar</button>
        `;

        let seleccion = Number(producto.categoria);

        if (vcategoria != producto.categoria) {

            let lcategoria = filtrarCategoria(mCategorias, seleccion);
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
        if ((producto.stock - cantidadEnCarrito) <= 0) {
            botonAgregarAlCarrito.disabled = true;
        }
        else
            botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(e, lproductos, mCategorias));

        //Obtengo la categoria para ver si lo meto en otro grupo
        vcategoria = `${producto.categoria}`;


    });
}

function agregarProductoAlCarrito(e, lproductos, mCategorias) {
    let carrito = obtenerCarritoLS();
    let idDelProducto = Number(e.target.name);
    let cCategoria = document.getElementById("select-categoria");
    let iBusqueda = document.getElementById("input-entrada");
    let productoBuscado = lproductos.find(producto => producto.id === idDelProducto);
    let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto);
    let posicionProductoEnProducto = lproductos.findIndex(producto => producto.id === idDelProducto);


    if (posicionProductoEnCarrito !== -1) {
        carrito[posicionProductoEnCarrito].unidades++;
        carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].precioUnitario * carrito[posicionProductoEnCarrito].unidades;

        lanzarTostada("Se agrego una unidad al Producto " + carrito[posicionProductoEnCarrito].nombre, "top", "left", 2000);
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            stock: productoBuscado.stock, //el stock deberia modificarse en la lista de productos, pero para este ejemplo lo hago en el carrito
            subtotal: productoBuscado.precio
        })

        lanzarTostada("Producto agregado", "top", "left", 2000);

    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarProductos(lproductos, mCategorias, cCategoria.value, iBusqueda.value);
    renderizarCarrito(lproductos, mCategorias);
}

function eliminarProductoDelCarrito(e, lproductos, mCategorias) {
    let carrito = obtenerCarritoLS();
    let idDelProducto = Number(e.target.name);
    let cCategoria = document.getElementById("select-categoria");
    let iBusqueda = document.getElementById("input-entrada");
    let posicionProductoEnCarrito = carrito.findIndex(producto => producto.id === idDelProducto);

    if (posicionProductoEnCarrito !== -1) {

        if (carrito[posicionProductoEnCarrito].unidades > 1)
        {
            carrito[posicionProductoEnCarrito].unidades--;
            carrito[posicionProductoEnCarrito].subtotal = carrito[posicionProductoEnCarrito].precioUnitario * carrito[posicionProductoEnCarrito].unidades;

            lanzarTostada("Se quito un elemento del Producto " + carrito[posicionProductoEnCarrito].nombre, "top", "left", 1000);
            

        } else {

            carrito = carrito.filter(producto => producto.id !== idDelProducto);
            e.target.parentElement.remove();

            lanzarTostada("Producto eliminado", "top", "left", 1000);
        }
    }
    localStorage.setItem("carrito", JSON.stringify(carrito ))

    renderizarCarrito(lproductos, mCategorias);
}

function renderizarCarrito(lproductos, mCategorias) {
    let contenedorCarrito = document.getElementById("tablita");
    let carrito = obtenerCarritoLS();

    let sumaTotal = 0;
    contenedorCarrito.innerHTML = "";
    carrito.forEach(iproducto => {
    let fila = `
        <tr>
            <td><p>${iproducto.nombre}</p></td>
            <td><p>${iproducto.precioUnitario}</p></td>
            <td><p>${iproducto.unidades}</p></td>
            <td><p>$ ${iproducto.subtotal}</p></td>
            <td><button name='${iproducto.id}' id='botonEliminar${iproducto.id}' class='btn btn-primary' type='button'>ELIMINAR</button></td>
        </tr>
        `;
        sumaTotal += iproducto.subtotal;

        contenedorCarrito.innerHTML += fila;
    });

        let total = `
        <tr>
            <td colspan=2> &nbsp;</td>
            <td><p style='font-weight: bolder;'>TOTAL</p></td>
            <td><p style='font-weight: bolder;'>$ ${sumaTotal}</p></td>
        </tr>
        `;

    contenedorCarrito.innerHTML += total;

    carrito.forEach(iproducto => {

        let botonEliminarItem = document.getElementById(`botonEliminar${iproducto.id}`);

        botonEliminarItem.addEventListener("click", (e) => { eliminarProductoDelCarrito(e, lproductos, mCategorias)}); 

    });


}

function lanzarAlerta(title, text, icon, timer) {
    Swal.fire({
        title, // equivale a title: title,
        text,
        icon: icon,
        showConfirmButton: false,
        timer: timer
    })
}

function lanzarTostada(text, gravity, position, duration) {
    Toastify({
        text,
        gravity,
        position,
        duration, // equivalente a duration: duration
        close: true,
        className: "tostada",
        //backgroundColor: "black",
        style: {
            fontSize: "large",
            background: "black"
        },
        //onClick: () => lanzarAlerta("probando"),
        //destination: "./prueba.html"
    }).showToast();
}