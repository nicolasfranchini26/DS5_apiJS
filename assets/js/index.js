const URL_API = 'https://mindicador.cl/api';
const inputCantidad = document.getElementById('amount');
const selectMoneda = document.getElementById('currency');
const parrafoResultado = document.getElementById('result');
const grafico = document.getElementById('chart').getContext('2d');
let chart ='' // Variable para almacenar el gráfico

document.getElementById('convert').addEventListener('click', async () => {
    const cantidad = parseFloat(inputCantidad.value);
    const moneda = selectMoneda.value;

    if (isNaN(cantidad) || cantidad <= 0) {
        parrafoResultado.textContent = 'Por favor ingrese una cantidad válida.';
        return;
    }

    try {
        // Obtener tipo de cambio
        const respuesta = await fetch(`${URL_API}/${moneda}`);
        if (!respuesta.ok) throw new Error('Error al obtener el tipo de cambio.');

        const datos = await respuesta.json();
        const tasaCambio = datos.serie[0].valor; // Valor del último día

        // Convertir moneda
        const cantidadConvertida = (cantidad * tasaCambio).toFixed(2); // Multiplicar por la tasa de cambio
        const nombreMoneda = moneda === 'dolar' ? 'USD' : moneda === 'euro' ? 'EUR' : moneda === 'bitcoin' ? 'BTC' : 'UF';
        parrafoResultado.textContent = `Resultado: ${cantidadConvertida} ${nombreMoneda}`;

        // Obtener historial
        const respuestaHistorial = await fetch(`${URL_API}/${moneda}`);
        if (!respuestaHistorial.ok) throw new Error('Error al obtener el historial.');

        const datosHistorial = await respuestaHistorial.json();
        const ultimosDiezDias = datosHistorial.serie.slice(0, 10).reverse(); // Últimos 10 días
        const etiquetas = ultimosDiezDias.map(entry => entry.fecha.split('T')[0]);
        const valores = ultimosDiezDias.map(entry => entry.valor);

        // Destruir el gráfico anterior si existe
        if (chart) {
            chart.destroy();
        }

        // Crear nuevo gráfico
        chart = new Chart(grafico, {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: `${nombreMoneda} en los últimos 10 días`,
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks:{
                        color: '#ffffff'}
                    },
                    y: {
                        ticks: {
                            color:'#ffffff'},
                        beginAtZero: false
                    }
                }
            }
        });
        
    } catch (error) {
        parrafoResultado.textContent = `Error: ${error.message}`;
    }

});




