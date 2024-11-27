var preview = (event)=>{
    var imagen = document.getElementById('image-create')
    var resolucion = document.getElementById('resolucion')
    var altoOriginal = imagen.naturalHeight
    var anchoOriginal = imagen.naturalWidth

    resolucion.value = anchoOriginal + "x" + altoOriginal

    var file_image = new FileReader()
    var preview_img = document.getElementById('image-create')

    file_image.onload = ()=>{
        if(file_image.readyState == 2){
            preview_img.src = file_image.result
        }
    }

    file_image.readAsDataURL(event.target.files[0])
}

var perfil = (event)=>{
    var file_image = new FileReader()
    var preview_img = document.getElementById('image-perfil')

    file_image.onload = ()=>{
        if(file_image.readyState == 2){
            preview_img.src = file_image.result
        }
    }

    file_image.readAsDataURL(event.target.files[0])
}


function cambiarEstado()
{
    const estado = document.getElementById("Estado").value

    if(estado == "Protegido")
    {
        document.forms['formulario'].action = "/Publicar/Private"
        document.getElementById("Derecho_Uso").options.item(0).selected = "selected"
    }
    else
    {
        document.forms['formulario'].action = "/Publicar/Publico"
        document.getElementById("Derecho_Uso").options.item(1).selected = "selected"
    }
}

function cambiarDerecho()
{
    const derecho = document.getElementById("Derecho_Uso").value

    if(derecho == "Copyright")
    {
        document.forms['formulario'].action = "/Publicar/Private"
        document.getElementById("Estado").options.item(0).selected = "selected"
    }
    else
    {
        document.forms['formulario'].action = "/Publicar/Publico"
        document.getElementById("Estado").options.item(1).selected = "selected"
    }
}

function calificar(element) {
    const stars = document.querySelectorAll('.fa-regular.fa-star');
    const rating = parseInt(element.id);

    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = 'gold';
        } else {
            star.style.color = 'white';
        }
    });

    document.getElementById('valoracion').value = rating;
}

function cargarEtiquetas()
{
    const etiqueta = document.getElementById("etiqueta").value
    const listaEtiqueta = document.getElementById("etiquetas")
    
    listaEtiqueta.value = listaEtiqueta.value + etiqueta + " "

    document.getElementById("etiqueta").value = ""
}

function cambiarWatermark(){
    var Tipo = document.getElementById("Tipo").value
    var valor = document.getElementById("valor")
    var boton = document.getElementById("boton")

    if(Tipo == "Imagen"){
        document.forms['formulario'].action = '/Usuario/Watermark'
        document.forms['formulario'].enctype = 'multipart/form-data'
        valor.innerHTML =   "<label class='form-label text-light font-weight-bold' for='watermark' id='imageLabel'>Cargar una Imagen</label>"
                            + "<input class='form-control' type='file' name='watermark' id='watermark' accept='image/png,image/jpeg,image/jpg' onchange='previewWatermark(event)' required>"
                            + "<br><br><div id='image-container'>"
                            +    "<img  src='/img/Perfil.jpg' style='width: 200px; height: 200px; border-radius: 25px; margin-left: 10rem;' id='image-previewWatermark'>"
                            + "</div>"
        boton.innerHTML = "<button class='btn btn-success' style='margin-left: 13.5rem;' type='submit'>Guardar</button>"
    }

    if(Tipo == "Texto"){
        document.forms['formulario'].action = '/Usuario/Textomark'
        document.forms['formulario'].enctype = 'application/x-www-form-urlencoded'
        valor.innerHTML = "<label class='form-label text-light font-weight-bold' for='watermark'>Introduce Un Texto</label>"
                            + "<input class='form-control' type='text' name='watermark' id='watermark' required>"
        boton.innerHTML = "<button class='btn btn-success' style='margin-left: 13.5rem;'  type='submit'>Guardar</button>"
    }
}

var previewWatermark = (event)=>{
    var imagen = document.getElementById('image-previewWatermark')

    var file_image = new FileReader()
    var preview_img = document.getElementById('image-previewWatermark')

    file_image.onload = ()=>{
        if(file_image.readyState == 2){
            preview_img.src = file_image.result
        }
    }

    file_image.readAsDataURL(event.target.files[0])
}