import os
import json
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer, AudioConfig, ResultReason

# Load blendShapeNames (same as blendShapeNames.js)
blendShapeNames = ["eyeBlinkLeft", "eyeLookDownLeft", "eyeLookInLeft", "eyeLookOutLeft", "eyeLookUpLeft",
                   "eyeSquintLeft", "eyeWideLeft", "eyeBlinkRight", "eyeLookDownRight", "eyeLookInRight",
                   "eyeLookOutRight", "eyeLookUpRight", "eyeSquintRight", "eyeWideRight", "jawForward", "jawLeft",
                   "jawRight", "jawOpen", "mouthClose", "mouthFunnel", "mouthPucker", "mouthLeft", "mouthRight",
                   "mouthSmileLeft", "mouthSmileRight", "mouthFrownLeft", "mouthFrownRight", "mouthDimpleLeft",
                   "mouthDimpleRight", "mouthStretchLeft", "mouthStretchRight", "mouthRollLower", "mouthRollUpper",
                   "mouthShrugLower", "mouthShrugUpper", "mouthPressLeft", "mouthPressRight", "mouthLowerDownLeft",
                   "mouthLowerDownRight", "mouthUpperUpLeft", "mouthUpperUpRight", "browDownLeft", "browDownRight",
                   "browInnerUp", "browOuterUpLeft", "browOuterUpRight", "cheekPuff", "cheekSquintLeft",
                   "cheekSquintRight", "noseSneerLeft", "noseSneerRight", "tongueOut", "headRoll", "leftEyeRoll",
                   "rightEyeRoll"]

# Azure credentials
AZURE_KEY = os.getenv('AZURE_KEY')
AZURE_REGION = os.getenv('AZURE_REGION')

SSML_TEMPLATE = '''
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-JennyNeural">
  <mstts:viseme type="FacialExpression"/>
  __TEXT__
</voice>
</speak>
'''

def generate_visemes(text):
    """Generate viseme data for the input text using Azure Speech API."""

    # Configure the Azure speech synthesizer (no audio output, just viseme tracking)
    speech_config = SpeechConfig(subscription=AZURE_KEY, region=AZURE_REGION)

    synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=None)

    ssml = SSML_TEMPLATE.replace("__TEXT__", text)

    blend_data = []  # To store viseme data
    time_step = 1 / 60  # 60 FPS timing
    time_stamp = 0

    # Callback function to handle viseme events
    def viseme_callback(evt):
        nonlocal time_stamp
        animation = json.loads(evt.animation)
        for blend_array in animation['BlendShapes']:
            blend = {blendShapeNames[i]: blend_array[i] for i in range(len(blendShapeNames))}
            blend_data.append({
                'time': time_stamp,
                'blendshapes': blend
            })
            time_stamp += time_step

    synthesizer.viseme_received.connect(viseme_callback)

    # Perform speech synthesis (without actual audio generation)
    result = synthesizer.speak_ssml_async(ssml).get()

    # Check if the synthesis was successful
    if result.reason == ResultReason.SynthesizingAudioCompleted:
        return blend_data  
    else:
        raise Exception(f"Speech synthesis failed: {result.reason}")
