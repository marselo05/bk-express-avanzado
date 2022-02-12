const express   = require('express');
const { Router } = express;
let multer          = require('multer');
const app       = express();
const PORT      = 8080;
let productos   = [];

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/folder', express.static('imagenes'));
app.use(express.static('public'));

let routerProductos = new Router();

let storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // callback error
    },
    filename: (req, file, cb ) => {
        cb(null, `${Date.now()} - ${file.originalname}`);
        //${path.extname(file.originalname)}
    }
})

let uploadMiddleware = multer({storage})
// Express Avanzado
// PRODUCTOS
    routerProductos.get('', (req, res, next) => {
        // Obtengo productos    
        res.json({ response: productos })
    }); // devuelve * los productos
    
    routerProductos.get('/:id', (req, res, next) => {
        let { id } = req.params;
        let producto    = null;
        let error       = 'Producto no encontrado.'; 
        
        if(Number(id)) {
            
            producto = productos.find( element => element.id == id);
            error       = true; 
        }
        else
            error = "El ID ingresado no es un número";

        res.json({ 
            resourse: producto,
            error: error
        })
    }); // devuelve un producto según su id
    
    routerProductos.post('/', uploadMiddleware.single('thumbnail'), (req, res, next) => {
        
        const file = req.file;
        if (!file) 
            new Error("Error en la carga de la imagen");
            
        // ID producto
        let pos = 1;
            pos = ( productos.length == 0 ) ? 1 : (productos.length + 1);
        
            req.body.id         = pos; 
            req.body.thumbnail  = req.file.originalname; 
            productos.push( req.body );

        res.json({responce: productos});

    }); // recibe y agrega un producto, y lo devuelve con su id asignado.

    routerProductos.put('/:id', (req, res, next) => {

        let { id }      = req.params;
        let pos         = null;
        let error       = 'Producto no encontrado.';

        if(Number(id)) 
        {
            productos.forEach( (element, index) => {
                if(element.id==id){
                    pos = index;
                }
            });
            
            productos[pos].title     = req.body.title;
            productos[pos].price     = req.body.price;
            productos[pos].thumbnail = req.body.thumbnail;
            
            error       = true; 
        }
        else
            error = "El ID ingresado no es un número";

        res.json({
            resourse: 'update',
            producto: pos,
            error: error
        })
        
    }); // recibe y actualiza un producto según su id.

    routerProductos.delete('/:id', (req, res, next) => {
        let { id }      = req.params;
        let pos         = null;
        let error       = 'Producto no encontrado.';

        if(Number(id)) 
        {
            productos.forEach( (element, index) => {
                if(element.id==id)
                    pos = index;
            });
            productos.splice(pos,1)
            error       = true; 
        }
        else
            error = "El ID ingresado no es un número";

        res.json({
            resourse: productos,
            error: error,
            posicion: pos
        })
    }); // elimina un producto según su id.

app.use('/api/productos', routerProductos);

app.listen( PORT, () => {
    console.log(`Estamos escuchando el pruerto en esta uri: http://localhost:${PORT}`);
});



// [x] Para el caso de que un producto no exista, se devolverá el objeto: { error : 'producto no encontrado' }
// [-] Implementar la API en una clase separada, utilizando un array como soporte de persistencia en memoria.
// [x] Incorporar el Router de express en la url base '/api/productos' y configurar todas las subrutas en base a este.
// [x] Crear un espacio público de servidor que contenga un documento index.html con un formulario de ingreso de productos con los datos apropiados.
// [x] El servidor debe estar basado en express y debe implementar los mensajes de conexión al puerto 8080 y en caso de error, representar la descripción del mismo.
// [x] Las respuestas del servidor serán en formato JSON. La funcionalidad será probada a través de Postman y del formulario de ingreso.