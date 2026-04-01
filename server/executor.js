const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const executeCodeLocal = async (req, res) => {
    const { language, code, stdin } = req.body;
    if (!code) return res.status(400).json({ message: 'No code provided to execute.' });

    const jobId = crypto.randomUUID();
    let inputFilename = null;

    try {
        if (stdin) {
            inputFilename = path.join(tempDir, `${jobId}.txt`);
            fs.writeFileSync(inputFilename, stdin);
        }

        if (language === 'python' || language === 'python3') {
            const filename = path.join(tempDir, `${jobId}.py`);

            const pythonDriverCode = `
import sys
import json
import ast
import re
from typing import *

# ==============================
# LATECODE UNIVERSAL DRIVER
# ==============================
if __name__ == '__main__':
    try:
        sol = Solution()
        methods = [m for m in dir(sol) if not m.startswith('__')]
        if methods:
            target_method = methods[0]
            raw_input = sys.stdin.read().strip()
            if raw_input:
                if '=' in raw_input and re.search(r'\\w+\\s*=', raw_input):
                    parts = re.split(r',\\s*[a-zA-Z_]\\w*\\s*=', ', ' + raw_input)[1:]
                elif '|' in raw_input:
                    parts = raw_input.split('|')
                else:
                    parts = raw_input.split('\\n')
                
                args = []
                for part in parts:
                    val = part.strip()
                    try:
                        args.append(json.loads(val))
                    except:
                        try:
                            args.append(ast.literal_eval(val))
                        except:
                            args.append(val)
                res = getattr(sol, target_method)(*args)
                result_str = json.dumps(res).replace(' ', '')
                print(result_str)
            else:
                print("LATECODE-ERROR: Missing STDIN Input Testcases.")
        else:
            print("LATECODE-ERROR: Could not find any method in class Solution.")
    except Exception as e:
        print("LATECODE EXECUTION ERROR:", e)
`;
            const finalizedCode = code + '\n' + pythonDriverCode;
            fs.writeFileSync(filename, finalizedCode);

            const command = inputFilename ? `python "${filename}" < "${inputFilename}"` : `python "${filename}"`;

            exec(command, { timeout: 8000 }, (error, stdout, stderr) => {
                cleanup([filename, inputFilename]);
                if (error) return res.json({ run: { code: error.code || 1, stderr: stderr || error.message, stdout } });
                res.json({ run: { code: 0, stdout, stderr } });
            });

        } else if (language === 'cpp' || language === 'c++') {
            const filename = path.join(tempDir, `${jobId}.cpp`);
            const outFilename = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(filename, code);

            const compileCmd = `g++ "${filename}" -o "${outFilename}"`;
            exec(compileCmd, { timeout: 10000 }, (cErr, cOut, cErrOut) => {
                if (cErr) {
                    cleanup([filename, inputFilename]);
                    return res.json({ compile: { code: cErr.code || 1, stderr: cErrOut || cErr.message, stdout: cOut } });
                }

                const runCmd = inputFilename ? `"${outFilename}" < "${inputFilename}"` : `"${outFilename}"`;
                exec(runCmd, { timeout: 5000 }, (rErr, rOut, rErrOut) => {
                    cleanup([filename, outFilename, inputFilename]);
                    if (rErr) return res.json({ run: { code: rErr.code || 1, stderr: rErrOut || rErr.message, stdout: rOut } });
                    res.json({ run: { code: 0, stdout: rOut, stderr: rErrOut } });
                });
            });

        } else if (language === 'java') {
            const filename = path.join(tempDir, `Main_${jobId.replace(/-/g, '')}.java`);
            // Java 11+ can directly run single-file source code without explicit javac if properly formatted.
            // But standard way:
            fs.writeFileSync(filename, code);

            const compileCmd = `javac "${filename}"`;
            exec(compileCmd, { timeout: 10000 }, (cErr, cOut, cErrOut) => {
                if (cErr) {
                    cleanup([filename, inputFilename]);
                    return res.json({ compile: { code: cErr.code || 1, stderr: cErrOut || cErr.message, stdout: cOut } });
                }

                const className = path.basename(filename, '.java');
                const runCmd = inputFilename ? `java -cp "${tempDir}" ${className} < "${inputFilename}"` : `java -cp "${tempDir}" ${className}`;

                exec(runCmd, { timeout: 5000 }, (rErr, rOut, rErrOut) => {
                    cleanup([filename, path.join(tempDir, `${className}.class`), inputFilename]);
                    if (rErr) return res.json({ run: { code: rErr.code || 1, stderr: rErrOut || rErr.message, stdout: rOut } });
                    res.json({ run: { code: 0, stdout: rOut, stderr: rErrOut } });
                });
            });

        } else {
            res.status(400).json({ message: `Language ${language} is not configured for Local Execution Engine yet!` });
        }

    } catch (err) {
        res.status(500).json({ message: `Compiler Error: ${err.message}` });
    }
};

// Helper
function cleanup(files) {
    files.forEach(f => {
        if (f && fs.existsSync(f)) {
            try { fs.unlinkSync(f); } catch (e) { }
        }
    });
}

module.exports = { executeCodeLocal };
