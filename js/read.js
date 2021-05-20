
  function cargaInfo(id){
    //alert(id);
    var cad = "";
    var ma= "";
    var mm = "";
    var me = "";
    var deo = "";
    var ga =""; 

    $.getJSON("info/programa.json", function (data) {
     for (a in data) {
        for (b= 0; b < data[a].length; b++) {

          if(id == data[a][b].ID){
            document.getElementById(id).classList.add('active');

            cad += '<p><b>Programa: </b> '+data[a][b].DP+'</p>'+
                   '<p><b>Subprograma: </b>'+data[a][b].DS+'</p>';


            ma = data[a][b].MPA;
            mm = data[a][b].MPA;
            me = data[a][b].MPE;
            deo = data[a][b].MDO;
            ga = data[a][b].MGA; 

            calculaPorcentaje (ma,mm,me,deo,ga);
            $(document).bind("kendo:skinChange", createChart);

            setTimeout(function(){ document.getElementById(id).classList.remove('active'); }, 1500);
            
          }else{
            $("#texto").html('');
          }
        }

          $("#texto").html(cad);
      }
    });
  }

  function createChart(pma,pmm,pme,pdeo,pga,prest2) {
    $("#chart").kendoChart({
            title: {
                position: "bottom",
                text: "Desglose de presupuesto aprovado"
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category #: \n #= value#%"
                }
            },
            series: [{
                type: "pie",
                startAngle: 150,
                data: [{
                    category: "P. Ejecutado",
                    value: pme,
                    color: "#9de219"
                },{
                    category: "P. Déficit de Operación",
                    value: pdeo,
                    color: "#90cc38"
                },{
                    category: "P. Gastos Administrativos",
                    value: pga,
                    color: "#068c35"
                },{
                    category: "Presupuesto Restante",
                    value: prest2,
                    color: "#505761"
                }]
            }],
            tooltip: {
                visible: true,
                format: "{0}%"
            }
        });
  }

  function calculaPorcentaje(ma,mm,me,deo,ga){
    var pma = (ma * 100)/ma;
    var pmm = (mm * 100)/ma;
    var pme = ((me * 100)/ma).toFixed(3);
    var pdeo = ((deo * 100)/ma).toFixed(3);
    var pga = ((ga * 100)/ma).toFixed(3);

    prest1 = (parseFloat(pme)+parseFloat(pdeo)+parseFloat(pga));
    prest2 = parseFloat(prest1) - parseFloat(pma);
    console.log(prest1);
    console.log(prest2);
    
    createChart(pma,pmm,pme,pdeo,pga,prest2);
  }

$(document).ready(function () {

  /*racargar mapa*/
  $('#svgfile').load('img/mapa.svg');

  /*radio button Consulta*/
  $("input[name=rConsulta]").click(function () {

      if($('input:radio[name=rConsulta]:checked').val() == "Federal"){
        $('.cls-1').css('fill','#D4EC8E');
        $("#ltEstados").addClass("e-oculto");

        var btn= '<ul class="list-group">';
        $.getJSON("info/programa.json", function (data) {
         for (a in data) {
             for (b= 0; b < data[a].length; b++) {
               //console.log(data[a][b].ID);
               btn += '<li class="list-group-item" id="'+data[a][b].ID+'" onclick="cargaInfo('+data[a][b].ID+')">'+ data[a][b].DS+'</li>'; //<input type="button" id="boton1" onclick="cargaInfo('+data[a][b].ID+')" value="Ver información" />
             }
          }
          btn += '</ul>';

          $('#dvLPS').html(btn);
        });
      }else{
        $('.cls-1').css('fill','none');
        $("#ltEstados").removeClass("e-oculto");
        $('#dvLPS').html('');
      }
  });

  /*Buscador / Checks */
  $('#iBuscar').keyup(function() {
    var buscador = $(this).val();
    var regex = new RegExp(buscador, "i");
    var count = 1;

    if(buscador === "")  {
      $('#pFiltro').html("");
      return;
    }

    $.getJSON('info/estados.json', function(data) {
        for (e in data) {
            var output = '<br><form>';
            $.each(data[e], function(key, val){
              if ((val.nombre.search(regex) != -1) || (val.nombre.search(regex) != -1)) {
                /*console.log(val.nombre);
                 output += '<li>' + val.nombre + '</li>';*/
                output += '<div class="form-check" style="text-align: left">'+
                          '<input class="form-check-input ck" type="checkbox" value="'+val.cod+'" id="'+val.id+'" name="eOpciones">'+
                          '<label class="form-check-label" for="'+val.id+'">'+val.nombre+'</label>'+
                          '</div>';
              }
            });
            output += '<br>'+ /*+
                       '<div class="form-check" style="text-align: left">'+
                       '<input class="form-check-input check_todos" name="Todos" type="checkbox" value="1" id="todos">'+
                       '<label class="form-check-label" for="todos">Seleccionar todos</label>'+
                       '</diV>'+*/
                       '</form>';
            $('#pFiltro').html(output);    
        }
    })
  });





}); 