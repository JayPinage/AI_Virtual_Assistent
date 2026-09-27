import { spawn } from "child_process";
import axios from "axios";

const LLAMA_DIR = "C:\\llama-b11181-bin-win-cpu-x64";
const LLAMA_EXE = `${LLAMA_DIR}\\llama-server.exe`;
const MODEL_PATH = `${LLAMA_DIR}\\assistant-Q4_K_M.gguf`;

const LLAMA_URL = "http://127.0.0.1:8080";

let llamaProcess = null;

const isLlamaRunning = async () => {
    try {
        await axios.get(`${LLAMA_URL}/health`, {
            timeout: 1000
        });

        return true;
    } catch {
        return false;
    }
};

export const startLlamaServer = async () => {
    if (await isLlamaRunning()) {
        console.log("✅ llama-server is already running");
        return;
    }

    console.log("🚀 Starting llama-server...");

    llamaProcess = spawn(
        LLAMA_EXE,
        [
            "-m",
            MODEL_PATH,
            "--host",
            "127.0.0.1",
            "--port",
            "8080",
            "--ctx-size",
            "2048"
        ],
        {
            cwd: LLAMA_DIR,
            detached: false,
            stdio: ["ignore", "pipe", "pipe"]
        }
    );

    llamaProcess.stdout.on("data", (data) => {
        console.log(`[llama] ${data.toString().trim()}`);
    });

    llamaProcess.stderr.on("data", (data) => {
        console.log(`[llama] ${data.toString().trim()}`);
    });

    llamaProcess.on("error", (error) => {
        console.error("❌ Failed to start llama-server:", error);
    });

    llamaProcess.on("exit", (code) => {
        console.log(`llama-server stopped with code ${code}`);
        llamaProcess = null;
    });

    // Wait until server becomes available
    for (let i = 0; i < 30; i++) {
        if (await isLlamaRunning()) {
            console.log("✅ llama-server is ready");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error("llama-server did not start within 30 seconds");
};