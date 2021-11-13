import React, { Component } from 'react'
import MixedUpload  from './mixedUpload';
import EmbedderUpload from './embedderUpload';
import EmbedderList from './embedderList';
import {HashRouter,Route,Link} from 'react-router-dom'
import Axios from './axios'
import AudioPlay from './audioPlay';
import { Radio, Layout, Menu, Button, Space} from 'antd';

import { PoweroffOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;
export default class HomeContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nameList:[],
            mixedId:-1,
            embedderType:0,
            embedderId:-1,
            embedderName:'',
            resAudioId:-1,
            resSrc:'',
            text:'Click to text to get result.',
            user:'Login',
            filterLoading:false,
            toTextLoading:0
        };
    }

    callBackMixed = (mixedId) => {
        this.setState({ mixedId});
      };
    
      callBackEmbedder = (embedderId,embedderName) => {
        this.setState({ embedderId,embedderName});
      };

      callBackEmbedderFromList = (embedderId, embedderName) =>{
          this.setState({embedderId, embedderName})
      };
    
      resultAudioComponent = () =>{
        // if(true){
        if(this.state.mixedId>-1 &&this.state.embedderId>-1){    
           
          if(this.state.resAudioId<=-1){
            // if(false){
            return (  
                      <div className="site-layout-background" style={{ padding: 10, minHeight: 200,marginTop: 40,textAlign: "center",backgroundColor:'#6495ED' }}>
                              <p style={{'color':'white','font-size': 20}}>Step 3: Get the Filtered Result and Proceed to Text</p>
                              <Button  loading={this.state.filterLoading} onClick={this.handleFilterClick} style={{'width': 300}}>
                                               Filter
                              </Button>
                    {/* <button className='filter' onClick={this.handleFilterClick}>Filter</button> */}
                    </div>
                    )
          }
          else{
            return (
              <div className="site-layout-background" style={{ padding: 10, minHeight: 200,marginTop: 40,textAlign: "center",backgroundColor:'#6495ED' }}>
                  <p style={{'color':'white','font-size': 20}}>Step 3: Get the Filtered Result and Proceed to Text</p>
                   <p style={{'color':'white','font-size': 15}}>Filtered Result</p>
                   <div style={{"text-align":"center"}}>
                   <AudioPlay
                      key = {this.state.resAudioId}
                      src = {this.state.resSrc}
                      test = 'Result'
                      
                   />
                   </div>
                   <div style={{'margin-top':20, 'margin-bottom':20}}>

                   <Button  loading={this.state.toTextLoading} onClick={this.handleToTextClick} style={{'width': 300}}>
                                               To Text
                    </Button></div>

                   <textarea rows="10" cols="60" value={this.state.text} readOnly={true}>
                      
                   </textarea>  

        
              </div>)
          }
        }
      }
    
      handleFilterClick = () =>{
        this.setState({filterLoading:true})
        let formData = new FormData();
        formData.append('embedder_id',this.state.embedderId)
        formData.append('audio_id',this.state.mixedId)
        const config = {
            headers: { 'content-type': `multipart/form-data` }
        }
    
        Axios.post(`/filter`, formData, config)
        .then((response) =>{
            var data = response.data
            if (data['id']>-1){
                this.setState({resAudioId:data['id'], resSrc:'http://127.0.0.1:4397/audio/'+data['id'],filterLoading:false})
            }
        })
      }
    
      handleToTextClick = () =>{
        this.setState({toTextLoading:true})
        let formData = new FormData();
        formData.append('res',this.state.resAudioId)
        const config = {
            headers: { 'content-type': `multipart/form-data` }
        }
    
        Axios.get(`/to_text/`+this.state.resAudioId, formData, config)
        .then((response) =>{
            var data = response.data
            console.log(data)
            this.setState({text:data['text'],toTextLoading:false})
        })
      }
    
      handleChange = (event) =>{
        this.setState({embedderType:event.target.value})
        // if (event.target.value ==1){
    
        //   const config = {
        //     // responseType: 'blob',
        //     headers: { 'content-type': `multipart/form-data` }
        //   }              
        // Axios.get(`/embedder`, config)
        // .then((response) =>{
        //     var data = response.data
        //     this.setState({nameList:response.data})
        // })
        // }
      }

    render(){
        return<div className="App">
        <header style ={{'margin-top':30}} className="App-header">
             <h1 style={{'font-size': 30,'line-height':40,'color': '#212121','font-weight': 600,'margin-bottom': 10}}>Voice Filter</h1>
             <p style={{'font-size': 24,'line-height':30,'color': '#212121','font-weight': 600,'margin-bottom': 10}}>Get your target vocal in a mixed audio and convert to text in 3 steps.</p>
        </header>
        <Content className="site-layout" style={{ padding: '0 500px', marginTop: 40 }}>
        <div className="site-layout-background" style={{ padding: 10, minHeight: 200,textAlign: "center",backgroundColor:'#6495ED' }}>
        <p style={{'color':'white','font-size': 20}}>Step 1: Select a Mixed Audio</p>
        <MixedUpload {...this.state} callBack={this.callBackMixed}/>
        </div>
        <div className="site-layout-background" style={{ padding: 10, minHeight: 200,marginTop: 40,textAlign: "center",backgroundColor:'#6495ED' }}>
          <p style={{'color':'white','font-size': 20}}>Step 2: Select the Pure Target Audio</p>
          <Radio.Group onChange={this.handleChange} value={this.state.embedderType} style={{'margin-bottom': 20}}>
                <Radio value={0} style={{'color':'white','font-size': 15}}>Upload Embedder </Radio>
                <Radio value={1} style={{'color':'white','font-size': 15}}>Load Stored Embedder</Radio>
          </Radio.Group>
          {/* <EmbedderList {...this.state} callBack={this.callBackEmbedder}/> */}
          {this.state.embedderType==0? <EmbedderUpload {...this.state} callBack={this.callBackEmbedder}/>: <EmbedderList {...this.state} callBack={this.callBackEmbedderFromList}/>}
          </div>
          {
            this.resultAudioComponent()
          }
          
          </Content>
      </div>
    }
}
