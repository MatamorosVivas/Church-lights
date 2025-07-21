const BRIDGE_IP = "192.168.1.67";

const API_USERNAME = "iNL9FYF8O5lUqVWLYAEBY7RdmdKd3GeElPa6yDcK";

const LIGHT_ID = "2"; 

const onBtn = document.getElementById('on-btn');
const offBtn = document.getElementById('off-btn');
const brightnessSlider = document.getElementById('brightness-slider');
const colorPicker = document.getElementById('color-picker');
const statusMessage = document.getElementById('status-message');

async function updateLightState(state) {
    const url = `http://${BRIDGE_IP}/api/${API_USERNAME}/lights/${LIGHT_ID}/state`;
    
    statusMessage.textContent = "Sending the command";

    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(state)
        });

        const data = await response.json();
        
        if (data[0] && data[0].error) {
            throw new Error(`Error: ${data[0].error.description}`);
        }

        statusMessage.textContent = "Command worked";
        console.log("Success:", data);

    } catch (error) {
        console.error('Error connecting to the light:', error);
        statusMessage.textContent = `Error: ${error.message}. Check the console.`;
    }
}


onBtn.addEventListener('click', () => {
    updateLightState({ on: true });
});

offBtn.addEventListener('click', () => {
    updateLightState({ on: false });
});

brightnessSlider.addEventListener('input', () => {
    const brightness = Math.round(parseInt(brightnessSlider.value, 10) * 2.54);
    updateLightState({ bri: brightness });
});

colorPicker.addEventListener('input', () => {
    const hexColor = colorPicker.value;
    const hsb = hexToHsb(hexColor);
    
    updateLightState({
        on: true, 
        hue: hsb.h,
        sat: hsb.s,
        bri: hsb.b
    });
});

function hexToHsb(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 65535),     
        s: Math.round(s * 254),       
        b: Math.round(v * 254)     
    };
}