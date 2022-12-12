/** @type {VoiceRecorder} */
var recorder;

/**
 * start the recorder and return a blobURL as a Promise<string>
 */
export async function startRecorder() {
    if (recorder) throw Error("already started");
    recorder = new VoiceRecorder();
    try {
        return await recorder.start();
    } finally {
        recorder = null;
    }
}

/**
 * stop the current recorder
 */
export async function stopRecorder() {
    if (recorder) {
        recorder.stop();
    }
}

export class VoiceRecorder {
    /** @type {MediaRecorder} */
    #recorder;

    /**
     * Ensure initialize
     * */
    async #init() {
        if (this.#recorder) return;
        var constraint = { audio: true };
        var stream = await navigator.mediaDevices.getUserMedia(constraint);
        var rec = new MediaRecorder(stream);
        rec.ondataavailable = console.log;
        rec.onerror = console.error;
        rec.onpause = console.log;
        rec.onresume = console.log;
        rec.onstart = console.log;
        rec.onstop = console.log;
        this.#recorder = rec;
    }

    /**
     * starts this recorder then returns an audio blobURL asynchronously
     *
     * @returns {Promise<string>}
     */
    async start() {
        await this.#init();

        if (this.#recorder.state === "recording") {
            throw new Error("already started");
        }

        this.#recorder.start();

        return new Promise(async (resolve, reject) => {
            this.#recorder.ondataavailable = function (blob) {
                resolve(URL.createObjectURL(blob.data));
            };
            this.#recorder.onerror = function (err) {
                reject(err);
            };
        });
    }

    /**
     * stops this recorder
     */
    stop() {
        if (this.#recorder) {
            this.#recorder.stop();
        }
    }
}
