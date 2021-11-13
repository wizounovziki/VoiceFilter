## SECTION 1 : Voice Filter Website


---

## SECTION 2 : Team List

| Full Name     | Student ID (MTech)  | Work Items (Who Did What) | Email (Optional) |
| :---------------- |:---------------:| :-----| :-----|
| Ding Yuxing   | A0186876E | Frontend development, Embedder testing, Filter discussion| e0321114@u.nus.edu |
| Sun Chengyuan | A0180523M | Speech to text deploy and audio segmentation algorithm| e0338228@u.nus.edu |
| Wang Futong   | A0191584W | backend development, integration| e0338228@u.nus.edu |
| Xu Mingjie    | A0186860U | Fliter modeling and| e0321114@u.nus.edu |

---


## SECTION 3 : Environment Setup and System Running

### [ 1 ] Prepare basic enviorment

Install [nodejs (npm)](https://nodejs.org/en/download/) on the computer

Install yarn by typing in nodejs path : 

`$npm install yarn`

Install [python >=3.5](https://www.python.org/downloads/)

> Option: create an virtual enviorment of python:

`$python -m venv ./venv`

`$source activate venv/bin/activate` for Linux

`$venv/script/activate` for Windows

cd to the voice backend folder, run pip install requirements.txt

`$cd PATH/OF/Virtual`

`$pip install -r requirements.txt`

cd to the frontend folder, run yarn build

`$yarn build`

### [2]   Models Setup

attention: pls check your CUDA version to install suitable [pytorch](https://pytorch.org/get-started/previous-versions/), we only test on torch 1.7.0-1.9.0

create data folder ,database and download model

run folder_creation.sh

run sqlcmd.sh

download deepspeech [model](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm) and [scorer](https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer), put them into checkpoint/deepspeeech/

download voicefilter [checkpoint](https://github.com/Xumj82/voicefilter/releases/download/chkpoint/chkpt_190000.pt) and [embedder](https://github.com/Xumj82/voicefilter/blob/main/datasets/embedder.pt), put them into checkpoint/voicefilter/

-create table inside database

`python sqliteModel.py`

### [ 3 ] Run the server

Run the system, firstly go to the backend folder, run main.py (taking port 4397), then go to the frontend folder (taking port 3000), run yarn start. 
`$ python main.py`
`$ yarn start`
**Go to URL using web browser** http://0.0.0.0:3000 or http://127.0.0.1:3000

---
