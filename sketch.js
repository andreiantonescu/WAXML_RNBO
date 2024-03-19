var waxmlLoaded = false
waxml.addEventListener("init", () => {
    console.log("Loaded WAXML")
    waxmlLoaded = true
    rnboSetup(waxml._ctx)
})

// setup RNBO and connect to p5 context
async function rnboSetup(context) { // pass in context from p5
    const outputNode = context.createGain()
    outputNode.connect(context.destination)
  
    // load reverb patch
    response = await fetch("effects/rnbo.shimmerev.json")
    const reverbPatcher = await response.json()
    const reverbDevice = await RNBO.createDevice({ context, patcher: reverbPatcher })

    response2 = await fetch("effects/rnbo.platereverb.json")
    const reverbPatcher2 = await response2.json()
    const reverbDevice2 = await RNBO.createDevice({ context, patcher: reverbPatcher2 })
  
    // establish signal chain: waxml → Reverb Patch → Output
    // connect synth to reverb patch
    let waxmlNode = waxml.querySelector("#outputNode")
    waxmlNode.connect(reverbDevice.node)
    reverbDevice.node.connect(reverbDevice2.node)
  
    // connect reverb patch to output
    reverbDevice2.node.connect(outputNode)
    context.suspend()
  }