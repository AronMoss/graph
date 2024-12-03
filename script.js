let chart;

function toggleInputs() {
    const equationType = document.querySelector('input[name="equationType"]:checked').value;
    document.getElementById('linearInputs').style.display = equationType === 'linear' ? 'block' : 'none';
    document.getElementById('quadraticInputs').style.display = equationType === 'quadratic' ? 'block' : 'none';
    updateGraph();
}

function calculateRange(points) {
    let minX = Math.min(...points.map(p => p.x));
    let maxX = Math.max(...points.map(p => p.x));
    let minY = Math.min(...points.map(p => p.y));
    let maxY = Math.max(...points.map(p => p.y));
    
    // Add 20% padding to the range
    const xPadding = (maxX - minX) * 0.2;
    const yPadding = (maxY - minY) * 0.2;
    
    // Ensure range is at least -10 to 10
    minX = Math.min(-10, minX - xPadding);
    maxX = Math.max(10, maxX + xPadding);
    minY = Math.min(-10, minY - yPadding);
    maxY = Math.max(10, maxY + yPadding);
    
    // Make range symmetric if needed
    const xRange = Math.max(Math.abs(minX), Math.abs(maxX));
    const yRange = Math.max(Math.abs(minY), Math.abs(maxY));
    
    return {
        minX: -xRange,
        maxX: xRange,
        minY: -yRange,
        maxY: yRange
    };
}

function generatePoints(isQuadratic, params) {
    const points = [];
    // Use more points for smoother curves
    const step = 0.1;
    const range = 20; // Initial range to calculate points
    
    for (let x = -range; x <= range; x += step) {
        let y;
        if (isQuadratic) {
            y = params.a * x * x + params.b * x + params.c;
        } else {
            y = params.m * x + params.b;
        }
        points.push({x: x, y: y});
    }
    return points;
}

function updateGraph() {
    const equationType = document.querySelector('input[name="equationType"]:checked').value;
    let points;
    let equation;

    if (equationType === 'linear') {
        const slope = parseFloat(document.getElementById('slope').value);
        const intercept = parseFloat(document.getElementById('intercept').value);
        points = generatePoints(false, {m: slope, b: intercept});
        equation = `y = ${slope}x + ${intercept}`;
    } else {
        const a = parseFloat(document.getElementById('quadA').value);
        const b = parseFloat(document.getElementById('quadB').value);
        const c = parseFloat(document.getElementById('quadC').value);
        points = generatePoints(true, {a: a, b: b, c: c});
        equation = `y = ${a}x² + ${b}x + ${c}`;
    }

    const range = calculateRange(points);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart('graphCanvas', {
        type: 'scatter',
        data: {
            datasets: [{
                label: equation,
                data: points,
                showLine: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
                x: {
                    grid: {
                        color: '#ddd',
                        drawTicks: false
                    },
                    min: range.minX,
                    max: range.maxX,
                    position: 'center',
                    title: {
                        display: true,
                        text: 'X'
                    }
                },
                y: {
                    grid: {
                        color: '#ddd',
                        drawTicks: false
                    },
                    min: range.minY,
                    max: range.maxY,
                    position: 'center',
                    title: {
                        display: true,
                        text: 'Y'
                    }
                }
            }
        }
    });
}

// Initial graph plot
document.addEventListener('DOMContentLoaded', updateGraph);