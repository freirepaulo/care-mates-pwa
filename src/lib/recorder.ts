export class RecorderService {
  private mediaRecorder?: MediaRecorder;
  private chunks: BlobPart[] = [];
  private stream?: MediaStream;

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    this.mediaRecorder = new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      this.chunks.push(event.data);
    };

    this.mediaRecorder.start();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return;

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, {
          type: "audio/webm",
        });

        this.stream?.getTracks().forEach((track) => track.stop());
        this.stream = undefined;

        this.chunks = [];
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }
}
