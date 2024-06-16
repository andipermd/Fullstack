// peta KELAPA  GADING
const mymap = L.map("mapdiv").setView([-6.1675765594271335, 106.90423450912299], 15)

// mymap.flyTo([-6.178461561613726, 106.92347650392048], 14, {
//     animate: true,
//     duration:5,
    
// })

// Basemap

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomain:['a','b','c']
    }
);


osm.addTo(mymap)

const esriSatelitBasemap = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles &copy; Esri &mdash; Source",
    }
  );


  const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: ' &copy;  <a href="https://opentopomap.org">OpenTopoMap</a>'
  })

// Legenda

const rawanBanjir = L.tileLayer.wms("http://localhost/geoserver/wms?",{
    layers: "simplygeo:banjir_kgt",
    format: "image/png",
    transparent:true
})


const buildings = L.tileLayer.wms("http://localhost/geoserver/wms?",{
    layers: "simplygeo:buildings_kgt",
    format: "image/png",
    transparent:true
})


const roads = L.tileLayer.wms("http://localhost/geoserver/wms?",{
    layers: "simplygeo:RawaTerateRoads",
    format: "image/png",
    transparent:true
})


const waterways = L.tileLayer.wms("http://localhost/geoserver/wms?",{
    layers: "simplygeo:sungai_kgt",
    format: "image/png",
    transparent:true
})

const batasStyle = {
    color: "yellow",
}


const batasKelurahan = L.tileLayer.wms("http://localhost/geoserver/wms?",{
    layers: "simplygeo:batas_kgt",
    format: "image/png",
    transparent:true,
    style: batasStyle
})

batasKelurahan.addTo(mymap)





// Layer Control
const baseMap = {
    "OpenstreetMap" : osm,
    "Esri Satelite" : esriSatelitBasemap,
    "OpenTopoMap" : openTopoMap
}

const overlayMap = {
    "Batas Kelurahan" : batasKelurahan,
    "Rawan Banjir" : rawanBanjir,
    "Gedung" : buildings,
    "Jalan" : roads,
    "Sungai" : waterways
}

const active =  L.control.layers(baseMap, overlayMap , {
    collapsed:false
}).addTo(mymap)

// Object info
mymap.on("click", function(e){
const pos = e.latlng
const pt = mymap.latLngToContainerPoint(pos)
const w = mymap.getSize().x 
const h = mymap.getSize().y 
var bnd = mymap.getBounds()
const west = bnd.getWest()
const east = bnd.getEast()
const south = bnd.getSouth()
const north = bnd.getNorth()


    $.ajax({
        url :"/geoserver/wms",
        data : {
            service : "WMS",
            version : "1.1.1",
            request : "GetFeatureInfo",
            info_format : "application/json",
            layers:"simplygeo:RawaTeratebuildings",
            query_layers:"simplygeo:RawaTeratebuildings",
            width: w,
            height:h,
            x:parseInt(pt.x),
            y:parseInt(pt.y),
            bbox:west+','+south+','+east+','+north
        },
          success: function(ajaxresult){
            const data = ajaxresult.features[0].properties;
            let content = "<table><tr><th>Field</th><th>Value</th></tr>";
                $.each(data, function(index, value){
                    content += "<tr><td>"+index+"</td><td>"+value+"</td></tr>"
                })
                content += "</table"
                L.popup().setLatLng(pos).setContent(content).openOn(mymap)
            // if(typeof(ajaxresult) != 'undefined'){
            //     console.log(ajaxresult)
            //     if(ajaxresult.features.lenght > 0 ) {
                   
            //     }
            // }
            
        },
        eror: function(jqXHR, textStatus, errorThrown){
            alert("error")
        },
    })

})