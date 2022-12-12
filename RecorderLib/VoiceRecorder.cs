using Microsoft.JSInterop;
namespace RecorderLib;
public class VoiceRecorder
{
    private IJSRuntime jsRuntime { get; set; }
    private IJSObjectReference? module;

    public VoiceRecorder(IJSRuntime jsRuntime)
    {
        this.jsRuntime = jsRuntime;
    }
    public async Task<string> Start()
    {
        if (module == null)
        {
            module = await jsRuntime.InvokeAsync<IJSObjectReference>(
                "import",
                "./_content/RecorderLib/RecorderLib.js"
            );
        }

        return await module.InvokeAsync<string>("startRecorder");

    }

    public async void Stop()
    {
        if (module != null)
        {
            await module.InvokeVoidAsync("stopRecorder");
        }
    }

}