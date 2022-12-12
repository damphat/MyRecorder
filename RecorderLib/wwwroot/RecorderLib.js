export function showPrompt(message) {
  return prompt(message, 'Type anything here');
}

class VoiceRecorder {
    
    #recoder;

    /**
     * Ensure initialize
     * */
    async #init() {
        if (this.#recoder) return;
        var constraint = { audio: true };
        var stream = await navigator.mediaDevices.getUserMedia(constraint);
        var rec = new MediaRecorder(stream);
        rec.ondataavailable = console.log;
        rec.onerror = console.error;
        rec.onpause = console.log;
        rec.onresume = console.log;
        rec.onstart = console.log;
        rec.onstop = console.log;
        this.#recoder = rec;
    }

    /**
     * starts this recorder then returns an audio blob
     *
     * @returns {Promise<Blob>}
     */
    async start() {
        // TODO start(constraint, limitInSeconds)
        await this.#init();

        if (this.#recoder.state === 'recording') {
            throw new Error('already started');
        }

        return new Promise(async function (resolve, reject) {
            this.#recoder.ondataavailable = function (blob) {
                resolve(blob);
            }
            this.#recoder.onerror = function (err) {
                reject(err);
            }
        });
    }

    /**
     * stops this recorder 
     */
    stop() {
        if (this.#recoder) {
            this.#recoder.stop();
        }
    }
}