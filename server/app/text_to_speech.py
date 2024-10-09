import os
import random
import json
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer, AudioConfig
from dotenv import load_dotenv

load_dotenv()

AZURE_KEY = os.getenv('AZURE_KEY')
AZURE_REGION = os.getenv('AZURE_REGION')

SSML = '''
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
<voice name="en-US-JennyNeural">
  <mstts:viseme type="FacialExpression"/>
  {text}
</voice>
</speak>
'''

blendshapeNames = [
    "eyeBlinkLeft",
    "eyeLookDownLeft",
    "eyeLookInLeft",
    "eyeLookOutLeft",
    "eyeLookUpLeft",
    "eyeSquintLeft",
    "eyeWideLeft",
    "eyeBlinkRight",
    "eyeLookDownRight",
    "eyeLookInRight",
    "eyeLookOutRight",
    "eyeLookUpRight",
    "eyeSquintRight",
    "eyeWideRight",
    "jawForward",
    "jawLeft",
    "jawRight",
    "jawOpen",
    "mouthClose",
    "mouthFunnel",
    "mouthPucker",
    "mouthLeft",
    "mouthRight",
    "mouthSmileLeft",
    "mouthSmileRight",
    "mouthFrownLeft",
    "mouthFrownRight",
    "mouthDimpleLeft",
    "mouthDimpleRight",
    "mouthStretchLeft",
    "mouthStretchRight",
    "mouthRollLower",
    "mouthRollUpper",
    "mouthShrugLower",
    "mouthShrugUpper",
    "mouthPressLeft",
    "mouthPressRight",
    "mouthLowerDownLeft",
    "mouthLowerDownRight",
    "mouthUpperUpLeft",
    "mouthUpperUpRight",
    "browDownLeft",
    "browDownRight",
    "browInnerUp",
    "browOuterUpLeft",
    "browOuterUpRight",
    "cheekPuff",
    "cheekSquintLeft",
    "cheekSquintRight",
    "noseSneerLeft",
    "noseSneerRight",
    "tongueOut",
    "headRoll",
    "leftEyeRoll",
    "rightEyeRoll"
]

# Function to convert text to speech
def text_to_speech(text):
    try:
        # Replace text in SSML template
        ssml = SSML.format(text=text)

        # Create speech configuration
        speech_config = SpeechConfig(subscription=AZURE_KEY, region=AZURE_REGION)
        speech_config.speech_synthesis_output_format = 5  # mp3 format

        # Generate a random filename for the output
        random_string = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=5))
        filename = f"./public/speech-{random_string}.mp3"

        # Create an audio configuration object
        audio_config = AudioConfig(filename=filename)

        # Initialize variables for blendshape data
        blend_data = []
        time_step = 1 / 60
        time_stamp = 0

        # Create a synthesizer object
        synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

        # Define a callback function for viseme events
        def viseme_callback(evt):
            nonlocal time_stamp
            animation = json.loads(evt.animation)

            for blend_array in animation['BlendShapes']:
                blend = {blendshapeNames[i]: value for i, value in enumerate(blend_array)}
                blend_data.append({
                    'time': time_stamp,
                    'blendshapes': blend
                })
                time_stamp += time_step

        # Subscribe to the visemeReceived event
        synthesizer.viseme_received.connect(viseme_callback)

        # Synthesize speech and save to file
        result = synthesizer.speak_ssml_async(ssml).get()

        # Check for errors
        if result.reason == result.Reason.Canceled:
            cancellation_details = result.cancellation_details
            raise Exception(f"Speech synthesis canceled: {cancellation_details.reason}")

        return {"blendData": blend_data, "filename": f"/speech-{random_string}.mp3"}

    except Exception as e:
        raise Exception(f"Error during speech synthesis: {str(e)}")

