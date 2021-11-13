import React, {Component} from 'react'
import AudioPlay from './audioPlay';
import Axios from './axios'
// import './index.css';
import { Radio, Layout, Menu, Button, Space } from 'antd';
class EmbedderUpload extends Component {

    constructor(props){
        super(props)
        this.state = {
            play:false,
            name:'',
            id: -1,
            src: ''
        }
    }
    submit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        var tk = ''
        if (localStorage.getItem("token")) {

            tk = localStorage.getItem("token");

        }
        const config = {
            // responseType: 'blob',
            headers: { 'content-type': `multipart/form-data`, 'token':tk }
          }

        Axios.post(`/upload/embedder`, formData, config)
        .then((response) =>{
            var data = response.data
            console.log(data)
            if (data['id']>-1){
                this.setState({id:data['id'], src:'http://127.0.0.1:4397/embedder_audio/'+data['id'], name:data['name']})
                const { id,name} = this.state;
                this.props.callBack(id,name);
            }
        })
    };

    render() {
        const {id, src} = this.state;
        if (this.state.id > -1){
        return (
            <div>
                <form onSubmit={this.submit}>
                    <input type="file" name='embedder' accept="audio/*"/>
                    <input type="text" name='name' style={{ marginRight: 20}}/>
                    <input type="submit" value="Upload"/>
                </form>
                <div style={{"text-align":"center"}}>
                <AudioPlay 
                key = {this.state.id}
                src = {this.state.src}
                test = 'Embedder'
                />  
                </div>        
            </div>
        )}
        if (this.state.id == -1){
            return (
                <div>
                    <form onSubmit={this.submit}>
                        <input type="file" name='embedder' accept="audio/*"/>
                        <input type="text" name='name' style={{ marginRight: 20}}/>
                        <input type="submit" value="Upload"/>
                    </form>            
                </div>
            )
        }
    }
}

export default EmbedderUpload;