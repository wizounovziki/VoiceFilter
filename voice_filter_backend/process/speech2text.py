import deepspeech
import numpy as np
import soundfile as sf
import struct
import wave
import os
model_file_path = 'checkpoint\deepspeech\deepspeech-0.9.3-models.pbmm'
scorer_file_path = 'checkpoint\deepspeech\deepspeech-0.9.3-models.scorer'
def load_model(scorer_activate=False):
    model = deepspeech.Model(model_file_path)
    if scorer_activate:
        model.enableExternalScorer(scorer_file_path)
        lm_alpha = 0.75
        lm_beta = 1.85
        model.setScorerAlphaBeta(lm_alpha, lm_beta)
        beam_width = 500
        model.setBeamWidth(beam_width)
    return model

def splitVoiceAndSave(musicFileName):
    # minimal voice value
    voiceMinValue = 0.01
    # Time interval between two sentences（second）
    voiceMaxDistanceSecond = 0.2
    # The minimum time length of a single audio（second）
    voiceMinSecond = 0.1
    sig, sample_rate = sf.read(musicFileName)
    print('loading:%s' % musicFileName)
    print("sample rate：%d" % sample_rate)
    print("time：%s" % (sig.shape[0] / sample_rate), '秒')

    # 
    if len(sig.T) == 2:
        inputData = sig.T[0]
    else:
        inputData = sig

    dd = {}
    for k, v in enumerate(inputData):
        if abs(v) < voiceMinValue:
            dd[k] = 0
        else:
            dd[k] = v

    x = [i / sample_rate for i in range(len(inputData))]
    y = list(dd.values())

    # delect space
    for key in list(dd):
        if dd[key] == 0:
            dd.pop(key)

    # define voice distance
    voiceSignalTime = list(dd.keys())
    list1 = []
    list2 = []
    for k, v in enumerate(voiceSignalTime[:-2]):
        list2.append(v)
        if voiceSignalTime[k + 1] - v > voiceMaxDistanceSecond * sample_rate:
            list1.append(list2)
            list2 = []

    if len(list1) == 0:
        list1.append(list2)

    if len(list1) > 0 and (
            voiceSignalTime[-1] - voiceSignalTime[-2]) < voiceMaxDistanceSecond * sample_rate:
        list1[-1].append(voiceSignalTime[-2])

    voiceTimeList = [x for x in list1 if len(x) > voiceMinSecond * sample_rate]
    print('total segement：', len(voiceTimeList))
    result_audio_list = []
    for voiceTime in voiceTimeList:
        voiceTime1 = int(max(0, voiceTime[0] - 0.8 * sample_rate))
        voiceTime2 = int(min(sig.shape[0], voiceTime[-1] + 0.8 * sample_rate))
        temp_audio = inputData[voiceTime1:voiceTime2]
        temp_path = os.path.join("data",os.path.splitext(os.path.split(musicFileName)[-1])[0] + '_%d_%d_%s_split.wav' % (voiceTime1, voiceTime2, sample_rate))
        with wave.open(temp_path,"wb") as outwave:
            nchannels = 1
            sampwidth = 2
            fs = sample_rate
            data_size = len(temp_audio)
            framerate = int(fs)
            nframes = data_size
            comptype = "NONE"
            compname = "not compressed"
            outwave.setparams((nchannels, sampwidth, framerate, nframes, comptype, compname))
            for v in temp_audio:
                outwave.writeframes(struct.pack('h', int(v * 64000 / 2)))
        result_audio_list.append(temp_path)
    return result_audio_list

def speech_to_text(audio_file_path,model):
    result_text_list = []
    result_audio_list = splitVoiceAndSave(audio_file_path)
    count= 0
    for temp_path in result_audio_list:
        with wave.open(temp_path, 'r') as w:
            rate = w.getframerate()
            frames = w.getnframes()
            buffer = w.readframes(frames)
            # print(rate)
            # print(model.sampleRate())
            data16 = np.frombuffer(buffer, dtype=np.int16)
            type(data16)
            text = model.stt(data16)
            result_text_list.append(text)
        os.remove(temp_path)

    count = 0
    for r in result_text_list:
        if count>0:
            prev = result_text_list[count-1]
            this = result_text_list[count]

            cursor = 2
            overlap_str = ''
            overlap = 2
            
            for i in range(2,min(len(prev), len(this))):
                if prev[-(cursor):] in this[0:cursor] or prev[-(cursor):] is this[0:cursor]:
                    overlap_str = this[0:cursor]
                    overlap = cursor
                cursor+=1
            result_text_list[count] = this[overlap:]
        count+=1


    return result_text_list

model = load_model()

if __name__ == '__main__':
    import json
    dir = 'C:/Users/Public/VoiceFilter/demo/'
    file_list = os.listdir(dir)
    # print(file_list)
    name_list = []
    for f in file_list:
        name = f.split('-')[0]
        if not name in name_list:
            print(name)
            name_list.append(name)
            # process estimate and target text of this sample
            # 000000-estimated
            estimate  = name + '-estimated.wav'
            target  = name + '-target.wav'

            es_text = speech_to_text(dir+estimate,model)
            tg_text = speech_to_text(dir+target,model)

            record = {'pure': tg_text, 'result':es_text}

            jd = json.dumps(record)

            f = open(name+'.json', 'w')
            f.write(jd)
            f.close()
            
    # result_text_list = ["then placed the pair on a strong chair or dressor or table of convenient height poor int", 
    #                     "poor into the spunge the remainder of the warm milk and water", 
    #                     "water stir into it is much of the flower s you can with the spoon then wipe it out plain with your fingers and lay it aside"]
    # count = 0
    # for r in result_text_list:
    #     if count>0:
    #         prev = result_text_list[count-1]
    #         this = result_text_list[count]

    #         cursor = 2
    #         overlap_str = ''
    #         overlap = 2
    #         # print(min(len(prev), len(this)))
    #         for i in range(2,min(len(prev), len(this))):
    #             # print(prev[-(cursor):],this[0:cursor] )
    #             if prev[-(cursor):] in this[0:cursor] or prev[-(cursor):] is this[0:cursor]:
    #                 print('**********************************')
    #                 overlap_str = this[0:cursor]
    #                 print(overlap_str)
    #                 overlap = cursor
    #             cursor+=1
    #         result_text_list[count] = this[overlap:]
    #     count+=1
    # print(result_text_list)
