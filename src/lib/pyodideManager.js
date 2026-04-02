let pyodide = null;
let isLoading = false;

export async function initPyodide() {
    if (pyodide || isLoading) return pyodide;
    isLoading = true;
    try {
        console.log('Loading Pyodide WebAssembly...');
        pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        console.log('Pyodide loaded successfully!');
    } catch (err) {
        console.error('Failed to load Pyodide:', err);
    } finally {
        isLoading = false;
    }
    return pyodide;
}

export async function runUserCode(code) {
    if (!pyodide) {
        await initPyodide();
    }
    if (!pyodide) return { output: null, error: "Critical Error: Python runtime failed to load." };

    try {
        // Redirect stdout to capture print statements
        await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);

        // Run the user's code
        await pyodide.runPythonAsync(code);

        // Capture the standard output
        const output = await pyodide.runPythonAsync(`sys.stdout.getvalue()`);
        const errOutput = await pyodide.runPythonAsync(`sys.stderr.getvalue()`);

        return { output: output + errOutput, error: null };
    } catch (e) {
        return { output: null, error: e.message };
    }
}

export async function checkVariable(varName) {
    if (!pyodide) return undefined;
    try {
        const val = pyodide.globals.get(varName);
        return val;
    } catch (e) {
        return undefined;
    }
}
