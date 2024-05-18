// Sample Project Written for GRAND EVENT NEUTRINO COLLABORATION, by:
//     
//                                        SHIVAJI CHAULAGAIN
//----------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const geodata = antenna_geometry();     // importing from jsonreader.js using <script src="jsonreader.js"><script> in html
    //console.log(geodata);
    document.getElementById('fileinput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const jsonData = JSON.parse(content);
            geometry_plot_section(jsonData); // calling function that provide hitx, hity, hitz, wt, tbins data and process it
        };
        reader.readAsText(file);
        // Reset file input after processing
    });
    const key = Object.keys(geodata[0]);
    const xValues = key.map(k => geodata[0][k]['X']);
    const yValues = key.map(k => geodata[0][k]['Y']);
    const zValues = key.map(k => geodata[0][k]['Z']);
    const plotElement = document.getElementById('plot');

    // create an initial 3D scatter plot of antenna geometry
    const traced = {
        x: xValues,
        y: yValues,
        z: zValues,
        mode: 'markers',
        marker: {
            size: 6,
            opacity: 0.9,//updatedData.map(point => point.opacity),
            color: 'rgba(0, 255, 0, 1)'
        },
        type: 'scatter3d'
    };
    const layout = {
        scene: {
            xaxis: {
                title: 'X Axis',
                color: 'rgba(128, 128, 128, 0.9)',      
                showline: true,  
                linewidth: 4    ,   
            },
            yaxis: {
                title: 'Y Axis',
                color: 'rgba(128, 128, 128, 0.9)',   
                showline: true,    
                linewidth: 4,    
            },
            zaxis: {
                title: 'Z Axis',
                color: 'rgba(128, 128, 128, 0.9)',     
                showline: true,    
                linewidth: 4,    
            },
            aspectmode: 'cube', 
            grid: {
                show: true,          
                color: 'rgba(128, 128, 128, 0.6)',       
            }
        },
        width: 650,
        height: 550
    };
    Plotly.newPlot(plotElement,[traced], layout);

    // create a initial layout for Electrifield and hilbert Electric field traces
    function range(n){
        return Array.from({length:n+1}, (_,i) => i);
    };
    const t = range(3500);
    const Elayout = {
        title: {
            text:"<b>E-field traces</b>",
        },
        xaxis:{
            title: "Time",
            range: [0,3500],
            showline: true,
            showticklabels: true,
            dividerwidth:2,
            ticks: "outside",
            dtick:500,
            minorgridcount: 4
        },
        yaxis:{
            title: "E-field [uV/m]",
            showline: true,
            showticklabels: true,
            ticks: "outside"
        },
        width: 530,
        height: 300,
        zoomBehavior: 'both',
        showgrid: true
    };
    const hlayout = {
        title: {
            text: "Hilbert Envelope",
            font:{
                size: 12,
            }
        },
        xaxis:{
            title: "Time",
            range: [0,3500],
            showline: true,
            showticklabels: true,
            dividerwidth:2,
            ticks: "outside",
            dtick:500,
            minorgridcount: 4
        },
        yaxis:{
            title: "E-field [uV/m]",
            showline: true,
            showticklabels: true,
            ticks: "outside"
        },
        width: 530,
        height: 300,
        showgrid: true
    };
    // create an initial plot for table
    const val = [[
        "Particle",
        "Ene [EeV]",
        "Zen [deg]",
        "Azi [deg]",
        "BInc [deg]",
        "BDec [deg]",
        "Xmax [g/cm2]"
    ],[0,0,0,0,0,0,0]];
    var headerColor = "grey";
    var rowEvenColor = "lightgrey";
    var rowOddColor = "white";
    var data = [{
        type: 'table',
        columnorder: [1,2],
        columnwidth: [1,1],
        header: {
            values: [["<b>Quantity</b>"], ["<b>Values</b>"]],
            align: "center",
            height:20,
            line: {width: 1, color: 'black'},
            fill: {color: headerColor},
            font: {family: "Arial", size: 12, color: "white"}
        },
        cells: {
            values: val,
            align: "center",
            height: 20,
            line: {color: "black", width: 1},
            fill: {color: [[rowOddColor,rowEvenColor,rowOddColor,
                                    rowEvenColor,rowOddColor,rowEvenColor,rowOddColor]]},
            font: {family: "Arial", size: 11, color: ["black"]}
        }
    }]
        
    Plotly.newPlot('table', data, {width:340, height:500});
    Plotly.newPlot("Eplot", [{x:[0], y:[0], mode: 'markers'}], Elayout);
    Plotly.newPlot("h_eplot", [{x:[0], y:[0], mode: 'markers'}], hlayout);

    // create an event handler that plot Electric field and hilber Electric field traces in another plot
    const clickevent = (efield, h_efield) => {
        plotElement.on('plotly_click', function(eventData){
            const electricField = efield;
            const Hilbert_Efield = h_efield;
            const Akey = Object.keys(electricField);
            console.log(Akey)
            if (eventData.points.length > 0){
                Akey.forEach(key => {
                    if ("A"+ eventData.points[0].pointNumber === key ){
                        plot_electricField(electricField, Hilbert_Efield, key);
                    }
                });
            }
        });
    };
    // plot an electric field traces
    const plot_electricField = (electricField,Hilberfield,e) => {  // e1 as key
        const Ex = electricField[e]["Ex"];
        const Ey = electricField[e]["Ey"];
        const Ez = electricField[e]["Ez"];
        const Eminx = Math.min(...Ex);
        console.log(e)
        console.log(Eminx);
        const Eminy = Math.min(...Ey);
        const Eminz = Math.min(...Ez);
        const Emin = Math.min(...[Eminx, Eminy, Eminz])- 0.05*Math.abs(Math.min(...[Eminx, Eminy, Eminz]));
        const Emaxx = Math.max(...Ex);
        const Emaxy = Math.max(...Ey);
        const Emaxz = Math.max(...Ez);
        const Emax = Math.max(...[Emaxx, Emaxy, Emaxz]) + 0.05*Math.abs(Math.max(...[Emaxx, Emaxy, Emaxz]));
        // for hilbert envelope
        const hx = Hilberfield[e]["hx"];
        const hy = Hilberfield[e]["hy"];
        const hz = Hilberfield[e]["hz"];
        const hminx = Math.min(...hx);
        const hminy = Math.min(...hy);
        const hminz = Math.min(...hz);
        const hmin = Math.min(...[hminx, hminy, hminz])- 0.05*Math.abs(Math.min(...[hminx, hminy, hminz]));
        const hmaxx = Math.max(...hx);
        const hmaxy = Math.max(...hy);
        const hmaxz = Math.max(...hz);
        const hmax = Math.max(...[hmaxx, hmaxy, hmaxz]) + 0.05*Math.abs(Math.max(...[hmaxx, hmaxy, hmaxz]));
        //create a function that shows transition of electric field
        const Edata = [{
            x: t,
            y: Ex,
            type: 'scatter2d',
            mode: "lines",
            colorscale: 'Viridis',
            opacity:1,
            name: 'Ex'
        }, {
            x: t,
            y: Ey,
            type: 'scatter2d',
            mode: "lines",
            colorscale: 'Viridis',
            opacity:1,
            name: 'Ey'
        },{
            x: t,
            y: Ez,
            type: 'scatter2d',
            mode: "lines",
            colorscale: 'Viridis',
            opacity:1,
            name: 'Ez',
        }];
        const Elayouts = {
            title: {
                text:"<b>E-field traces ("+e+")</b>",
            },
            legend:{
                orientation: 'h',
                x:0.5,
                y:0.95,
                xanchor: 'left',  // Anchor legend to the right side of the plot
                yanchor: 'middle',

            },

            xaxis:{
                title: "Time",
                range: [0,3500],
                showline: true,
                showticklabels: true,
                dividerwidth:2,
                ticks: "outside",
                dtick:500,
                minorgridcount: 4
            },
            yaxis:{
                title: "E-field [uV/m]",
                range: [Emin, Emax],
                showline: true,
                showticklabels: true,
                ticks: "outside"

            },
            width: 530,
            height: 300,
            showgrid: true
        };
        const Hdata = [{
            x: t,
            y: hx,
            type: 'scatter2d',
            mode: "lines",
            colorscale: 'Viridis',
            opacity:1,
            name: 'hx'
        }, {
            x: t,
            y: hy,
            type: 'scatter2d',
            mode: "lines",
            colorscale: 'Viridis',
            opacity:1,
            name: 'hy'
        },{
            x: t,
            y: hz,
            type: 'scatter2d',
            mode: "lines",
            colorscale: 'Viridis',
            opacity:1,
            name: 'hz',
        }];
        const hlayouts = {
            title: {
                text: "Hilbert Envelope",
                font:{
                    size: 14
                }
            },
            legend:{
                orientation: 'h',
                x:0.5,
                y:0.95,
                xanchor: 'left',  // Anchor legend to the right side of the plot
                yanchor: 'middle',

            },
            xaxis:{
                title: "Time",
                range: [0,3500],
                showline: true,
                showticklabels: true,
                dividerwidth:2,
                ticks: "outside",
                dtick:500,
                minorgridcount: 4
            },
            yaxis:{
                title: "E-field [uV/m]",
                range: [hmin, hmax],
                showline: true,
                showticklabels: true,
                ticks: "outside"

            },
            width: 530,
            height: 300,
            showgrid: true
        };
        Plotly.newPlot("h_eplot", Hdata, hlayouts, {scrollZoom: true});
        Plotly.newPlot("Eplot", Edata, Elayouts, {scrollZoom: true});
        
        // create a button for transition effect of electric field varying with time
        const button = document.getElementById("playbutton");
        button.addEventListener("click", function() {
            transition_E(Ex, Ey, Ez, Emin, Emax,e);
            transition_h(hx, hy, hz, hmin, hmax)
        
        });
    };
    function transition_E(Ex, Ey, Ez, Emin, Emax,e){
        const frames = [];
        let nbr = 1500; // Please set frame length as your choice. I have set default 1500 here nbr=t.length=3500
        for (var i = 0; i < nbr; i++) {
            frames[i] = {data: [{x: [], y: []}, {x: [], y: []},{x: [], y: []}]}
            frames[i].data[0].x = t.slice(0, i+1);
            frames[i].data[0].y = Ex.slice(0, i+1);
            frames[i].data[1].x = t.slice(0, i+1);
            frames[i].data[1].y = Ey.slice(0, i+1);
            frames[i].data[2].x = t.slice(0, i+1);
            frames[i].data[2].y = Ez.slice(0, i+1);
        };
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'Ex',
            x: frames[5].data[0].x,
            y: frames[5].data[0].y,
        };
        
        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'Ey',
            x: frames[5].data[1].x,
            y: frames[5].data[1].y,
        };
        
        var trace3 = {
            type: "scatter",
            mode: "lines",
            name: 'Ez',
            x: frames[5].data[2].x,
            y: frames[5].data[2].y,
        }
        
        var data = [trace1,trace2, trace3];
        var layout = {
            title: "<b>E-field traces ("+e+")</b>",
            legend:{
                orientation: 'h',
                x:0.5,
                y:0.95,
                xanchor: 'left',  // Anchor legend to the right side of the plot
                yanchor: 'middle',

            },
            xaxis:{
                title: "Time",
                range: [0,3500],
                showline: true,
                showticklabels: true,
                dividerwidth:2,
                ticks: "outside",
                dtick:500,
                minorgridcount: 4
            },
            yaxis:{
                title: "E-field [uV/m]",
                range: [Emin, Emax],
                showline: true,
                showticklabels: true,
                ticks: "outside"

            },
            
        };
        
        Plotly.newPlot('Eplot', data, layout).then(function() {
            Plotly.animate('Eplot', frames,{
                fromcurrent: true,
                transition: {
                  duration: 0
                },
                frame: {
                  duration: 0,
                  redraw: false
                }
            });
        });

    };
    // for hilbert
    function transition_h(hx, hy, hz, hmin, hmax){
        const frameh = [];
        let nb = 1500;   // Please set frame length as your choice. I have set default 1500 here nb=t.length=3500
        for (var i = 0; i < nb; i++) {
            frameh[i] = {data: [{x: [], y: []}, {x: [], y: []},{x: [], y: []}]}
            frameh[i].data[0].x = t.slice(0, i+1);
            frameh[i].data[0].y = hx.slice(0, i+1);
            frameh[i].data[1].x = t.slice(0, i+1);
            frameh[i].data[1].y = hy.slice(0, i+1);
            frameh[i].data[2].x = t.slice(0, i+1);
            frameh[i].data[2].y = hz.slice(0, i+1);
        };
        var traceh1 = {
            type: "scatter",
            mode: "lines",
            name: 'hx',
            x: frameh[5].data[0].x,
            y: frameh[5].data[0].y,
        };
        var traceh2 = {
            type: "scatter",
            mode: "lines",
            name: 'hy',
            x: frameh[5].data[1].x,
            y: frameh[5].data[1].y,
        };
        var traceh3 = {
            type: "scatter",
            mode: "lines",
            name: 'hz',
            x: frameh[5].data[2].x,
            y: frameh[5].data[2].y,
        }
        var datas = [traceh1,traceh2, traceh3];
        var hlayout = {
            title:{
                text: "Hilbert Envelope",
                font:{
                    size: 14
                }},
            legend:{
                    orientation: 'h',
                    x:0.5,
                    y:0.95,
                    xanchor: 'left',  // Anchor legend to the right side of the plot
                    yanchor: 'middle',
    
                },
            xaxis:{
                title: "Time",
                range: [0,3500],
                showline: true,
                showticklabels: true,
                dividerwidth:2,
                ticks: "outside",
                dtick:500,
                minorgridcount: 4
            },
            yaxis:{
                title: "E-field [uV/m]",
                range: [hmin, hmax],
                showline: true,
                showticklabels: true,
                ticks: "outside"

            },   
        };
        Plotly.newPlot('h_eplot', datas, hlayout).then(function() {
            Plotly.animate('h_eplot', frameh,{
                fromcurrent: true,
                transition: {
                  duration: 0
                },
                frame: {
                  duration: 0,
                  redraw: false
                }
            });
        });

    };

    // let's define a function that display event summary
    const event_information = (quantities, values) =>{
        const val = [quantities,values];
        var headerColor = "grey";
        var rowEvenColor = "lightgrey";
        var rowOddColor = "white";
        var data = [{
            type: 'table',
            columnorder: [1,2],
            columnwidth: [1,1],
            header: {
              values: [["<b>Quantity</b>"], ["<b>Values</b>"]],
              align: "center",
              height:20,
              line: {width: 1, color: 'black'},
              fill: {color: headerColor},
              font: {family: "Arial", size: 12, color: "white"}
            },
            cells: {
                values: val,
                align: "center",
                height: 20,
                line: {color: "black", width: 1},
                fill: {color: [[rowOddColor,rowEvenColor,rowOddColor,
                                      rowEvenColor,rowOddColor,rowEvenColor,rowOddColor]]},
                font: {family: "Arial", size: 11, color: ["black"]}
            }
          }]
          
         Plotly.newPlot('table', data, {width:340, height:500});
    };
    // const keys = Object.keys(hitXYZ);

      

    const geometry_plot_section = (jsonData) => {
        const key1 = Object.keys(jsonData["hitgeo"]["hitXYZ"])
        const hitxValues = key1.map(k => jsonData["hitgeo"]["hitXYZ"][k]["X"]);
        const hityValues = key1.map(k => jsonData["hitgeo"]["hitXYZ"][k]["Y"]);
        const hitzValues = key1.map(k => jsonData["hitgeo"]["hitXYZ"][k]["Z"]);
        const hitT = jsonData["hitgeo"]["hitT"];
        const wt = jsonData["hitgeo"]["wt"];
        // let's extract about electric field information
        const electric_field = jsonData["Efield"];
        const hilbert_field = jsonData["Hfield"];
        const quantities = jsonData["textinform"]["Quantity"];
        const values = jsonData["textinform"]["Value"];
        
        const geodataPoint = Array.from(xValues, (value, index) => ({
            x: value,
            y: yValues[index],
            z: zValues[index],
            isHit: false,
            size: 12,
            color: 'rgba(0, 255, 0, 1)', // Initial color for all points,
            weight:' ',
            hitt: ' ',
            opacity: 1
        }));
        let previoussize = [];
        let previousindex = [];
        const colors = color_pick();   // return colors from color_palette.js
        function prepareFrameData(progress, idx,n) {
            let previouslyHitIndex = -1;
            let previouslyHitSize = 0;
            const geot =  geodataPoint.map((element, index) => {
              const modifiedElement = { ...element, isPreviousHit: false }; // Reset flag
              modifiedElement.color = 
                    index === idx && element.isHit ? colors[index] : // Current hit point
                    (element.isHit && index !== idx) ? colors[index]: // Previously marked hit point (original index)
                    (index === previouslyHitIndex) ? previouslyHitSize : element.color;
              
              modifiedElement.isPreviousHit = element.isHit; // Update flag on hit
              // Update size based on conditions
              modifiedElement.size =
                index === idx && element.isHit ? Math.log(wt[index])*4 : // Current hit point
                (element.isHit && index !== idx) ? Math.log(wt[index])*4: // Previously marked hit point (original index)
                (index === previouslyHitIndex) ? previouslyHitSize : element.size; // Update size at previous hit point index
              
              modifiedElement.weight = 
                    index === idx && element.isHit ? wt[index] : // Current hit weight
                    (element.isHit && index !== idx) ? wt[index]: // Previously marked hit weight (original index)
                    (index === previouslyHitIndex) ? previouslyHitSize : element.weight;

               modifiedElement.hitt = 
                    index === idx && element.isHit ? hitT[index] : // Current hit time
                    (element.isHit && index !== idx) ? hitT[index]: // Previously marked hit time (original index)
                    (index === previouslyHitIndex) ? previouslyHitSize : element.hitt;
            //   modifiedElement.opacity = 
            //         index === idx && element.isHit ? 1 : // Current hit opacity
            //         (element.isHit && index !== idx) ? 1: // Previously marked hit opacity (original index)
            //         (index === previouslyHitIndex) ? previouslyHitSize : element.opacity; //default opacity for rest of the points
              return modifiedElement;
            });
            // // Update previously hit point info after processing data points (optional)
            previousindex.push(idx);
            return geot;
        };
          // i am pushing a frame data here and filter it out according to the size
        function createPlot(showHitPoints = false, idx,n) {
            const updatedData = prepareFrameData(showHitPoints ? 1 : 0, idx,n);
            //const weights = updatedData.map(point => point.weight)
            const trace = {
                x: updatedData.map(point => point.x),
                y: updatedData.map(point => point.y),
                z: updatedData.map(point => point.z),
                mode: 'markers',
                marker: {
                    size: updatedData.map(point => point.size),
                    opacity: 1,//updatedData.map(point => point.opacity),
                    color: updatedData.map(point => point.color)
                },
                hovertemplate: '<b>X:</b> %{x:.2f} <br><b>Y:</b> %{y:.2f} <br><b>Z:</b> %{z:.2f} <br><b>time:</b> %{text:.2f} <br><b>Weight:</b> %{customdata:.5f} <extra></extra>',
                text: updatedData.map(point => point.hitt),
                customdata: updatedData.map(point => point.weight),
                type: 'scatter3d'
            };

            Plotly.newPlot(plotElement,[trace], layout);

            // display event summary
            event_information(quantities, values);
           
           // place here an click event for point click on plot
            clickevent(electric_field, hilbert_field);
        };
        // sorted values of hit points
        const timeValues = key1.map(key => {
            const numKey = key.replace('A', '');  // Extract the number part of the key
            return hitT[numKey];
        });
        
            // array of key-value pairs
        const keyValuePairs = key1.map((key, index) => {
            return { key: key, time: timeValues[index] };
        });
        
            // Sorting key-value pairs based on time values
        keyValuePairs.sort((a, b) => a.time - b.time);
    
        // sorting keys to sort hitxValues, hityValues, and hitzValues
        const sortedHitXValues = keyValuePairs.map(pair => jsonData["hitgeo"]["hitXYZ"][pair.key].X);
        const sortedHitYValues = keyValuePairs.map(pair => jsonData["hitgeo"]["hitXYZ"][pair.key].Y);
        const sortedHitZValues = keyValuePairs.map(pair => jsonData["hitgeo"]["hitXYZ"][pair.key].Z);
        
        const showHitPointsButton = document.getElementById('showHitPointsButton');
        showHitPointsButton.addEventListener('click', () => {
            let updateCount = 0;
            let idx = 0;
            // this will update each hit point every 500 millisecond
            const intervalId = setInterval(() => {
                if (updateCount >= hitxValues.length) { 
                    clearInterval(intervalId);
                    return;
                }
                
                const indx = sortedHitXValues[updateCount];    // using sorted hit points values here
                const indy = sortedHitYValues[updateCount];
                const indz = sortedHitZValues[updateCount];
                for (let i=0; i<xValues.length; i++){
                    if (geodataPoint[i].x == indx && geodataPoint[i].y == indy && geodataPoint[i].z == indz) { 
                        geodataPoint[i].isHit = true;
                        idx = i;
                        break;
                    }
                }
                updateCount++;
                let n = updateCount-1;
                createPlot(true, idx,n);
            }, 500); // Update every 0.5 seconds
        });
    };
});



